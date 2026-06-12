from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.utils import timezone
from .models import Attendance, Leave, WorkSession, WorkSegment
from .serializers import AttendanceSerializer, LeaveSerializer, WorkSessionSerializer
from apps.permissions import IsAdminOrManager


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.select_related('user').all()
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['user', 'status', 'date']
    search_fields = ['user__username', 'date', 'notes']
    ordering_fields = ['date', 'status']
    ordering = ['-date']

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        profile = getattr(user, 'profile', None)
        if profile and profile.role == 'intern':
            qs = qs.filter(user=user)
        return qs

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsAdminOrManager()]
        return [permissions.IsAuthenticated()]


class LeaveViewSet(viewsets.ModelViewSet):
    queryset = Leave.objects.select_related('user', 'reviewed_by').all()
    serializer_class = LeaveSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['user', 'status', 'leave_type']
    ordering = ['-created_at']

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        profile = getattr(user, 'profile', None)
        if profile and profile.role == 'intern':
            return qs.filter(user=user)
        if profile and profile.role == 'mentor':
            return qs.filter(user__intern__mentor=user)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminOrManager])
    def approve(self, request, pk=None):
        leave = self.get_object()
        leave.status = 'approved'
        leave.reviewed_by = request.user
        leave.reviewed_at = timezone.now()
        leave.save()
        return Response({'status': 'approved'})

    @action(detail=True, methods=['post'], permission_classes=[IsAdminOrManager])
    def reject(self, request, pk=None):
        leave = self.get_object()
        leave.status = 'rejected'
        leave.reviewed_by = request.user
        leave.reviewed_at = timezone.now()
        leave.save()
        return Response({'status': 'rejected'})


class WorkSessionViewSet(viewsets.GenericViewSet):
    """
    Multi-segment timer. One WorkSession per day, many WorkSegments per session.

    Flow:
      start → pause → resume → checkout   (segment 1 done, day still open)
      start → pause → resume → checkout   (segment 2 done, day still open)
      end_day                               (day closed, no more work)
    """
    serializer_class = WorkSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def _get_today(self, user):
        today = timezone.now().date()
        session, _ = WorkSession.objects.get_or_create(
            user=user, date=today,
            defaults={'state': 'idle'}
        )
        return session

    def _sync_attendance(self, session, now):
        """Keep the Attendance record in sync after every checkout / end_day."""
        worked_hours = round(session.worked_seconds / 3600, 2)
        first_segment = session.segments.order_by('started_at').first()
        check_in_time = first_segment.started_at.astimezone().time() if first_segment else None
        check_out_time = now.astimezone().time()
        att, _ = Attendance.objects.get_or_create(
            user=session.user, date=session.date,
            defaults={'status': 'present'}
        )
        att.check_in = check_in_time
        att.check_out = check_out_time
        att.working_hours = worked_hours
        att.status = 'present'
        att.save(update_fields=['check_in', 'check_out', 'working_hours', 'status'])

    # GET /api/attendance/timer/today/
    @action(detail=False, methods=['get'])
    def today(self, request):
        session = self._get_today(request.user)
        return Response(WorkSessionSerializer(session).data)

    # POST /api/attendance/timer/start/
    # Works from: idle, checked_out
    @action(detail=False, methods=['post'])
    def start(self, request):
        session = self._get_today(request.user)
        if session.state == 'day_ended':
            raise ValidationError('Day has been ended. No more work sessions today.')
        if session.state == 'working':
            raise ValidationError('Timer is already running.')
        if session.state == 'paused':
            raise ValidationError('Resume the current break first.')
        now = timezone.now()
        # Create a new segment for this check-in
        WorkSegment.objects.create(session=session, started_at=now)
        session.last_paused_at = now   # segment start pointer
        session.state = 'working'
        session.save(update_fields=['state', 'last_paused_at'])
        return Response(WorkSessionSerializer(session).data)

    # POST /api/attendance/timer/pause/
    @action(detail=False, methods=['post'])
    def pause(self, request):
        session = self._get_today(request.user)
        if session.state != 'working':
            raise ValidationError('Timer is not running.')
        now = timezone.now()
        if session.last_paused_at:
            session.worked_seconds += int((now - session.last_paused_at).total_seconds())
        session.last_paused_at = now
        session.state = 'paused'
        session.save(update_fields=['state', 'worked_seconds', 'last_paused_at'])
        return Response(WorkSessionSerializer(session).data)

    # POST /api/attendance/timer/resume/
    @action(detail=False, methods=['post'])
    def resume(self, request):
        session = self._get_today(request.user)
        if session.state != 'paused':
            raise ValidationError('Timer is not paused.')
        now = timezone.now()
        if session.last_paused_at:
            session.break_seconds += int((now - session.last_paused_at).total_seconds())
        session.last_paused_at = now
        session.state = 'working'
        session.save(update_fields=['state', 'break_seconds', 'last_paused_at'])
        return Response(WorkSessionSerializer(session).data)

    # POST /api/attendance/timer/checkout/
    # Ends the current segment but leaves the day OPEN for more work.
    @action(detail=False, methods=['post'])
    def checkout(self, request):
        session = self._get_today(request.user)
        if session.state in ('idle', 'checked_out', 'day_ended'):
            raise ValidationError('No active work segment to check out from.')
        now = timezone.now()
        if session.state == 'working' and session.last_paused_at:
            seg_secs = int((now - session.last_paused_at).total_seconds())
            session.worked_seconds += seg_secs
        elif session.state == 'paused' and session.last_paused_at:
            session.break_seconds += int((now - session.last_paused_at).total_seconds())
            seg_secs = 0
        else:
            seg_secs = 0

        # Close the latest open segment
        open_seg = session.segments.filter(ended_at__isnull=True).order_by('-started_at').first()
        if open_seg:
            open_seg.ended_at = now
            open_seg.duration_seconds = int((now - open_seg.started_at).total_seconds())
            open_seg.save(update_fields=['ended_at', 'duration_seconds'])

        session.last_paused_at = None
        session.state = 'checked_out'   # day still open
        session.save(update_fields=['state', 'worked_seconds', 'break_seconds', 'last_paused_at'])
        self._sync_attendance(session, now)
        return Response(WorkSessionSerializer(session).data)

    # POST /api/attendance/timer/end_day/
    # Finalises the day — no more work sessions allowed.
    @action(detail=False, methods=['post'])
    def end_day(self, request):
        session = self._get_today(request.user)
        if session.state == 'day_ended':
            raise ValidationError('Day is already ended.')
        if session.state == 'idle':
            raise ValidationError('No work was recorded today.')
        now = timezone.now()
        # Auto-checkout if still working or paused
        if session.state in ('working', 'paused'):
            if session.state == 'working' and session.last_paused_at:
                session.worked_seconds += int((now - session.last_paused_at).total_seconds())
            elif session.state == 'paused' and session.last_paused_at:
                session.break_seconds += int((now - session.last_paused_at).total_seconds())
            open_seg = session.segments.filter(ended_at__isnull=True).order_by('-started_at').first()
            if open_seg:
                open_seg.ended_at = now
                open_seg.duration_seconds = int((now - open_seg.started_at).total_seconds())
                open_seg.save(update_fields=['ended_at', 'duration_seconds'])
        session.last_paused_at = None
        session.state = 'day_ended'
        session.save(update_fields=['state', 'worked_seconds', 'break_seconds', 'last_paused_at'])
        self._sync_attendance(session, now)
        return Response(WorkSessionSerializer(session).data)
