from rest_framework import serializers
from .models import Attendance, Leave, WorkSession, WorkSegment


class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'


class LeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leave
        fields = '__all__'
        read_only_fields = ('reviewed_by', 'reviewed_at')


class WorkSegmentSerializer(serializers.ModelSerializer):
    duration_display = serializers.SerializerMethodField()

    class Meta:
        model = WorkSegment
        fields = ('id', 'started_at', 'ended_at', 'duration_seconds', 'duration_display')

    def get_duration_display(self, obj):
        s = obj.duration_seconds
        return f"{s // 3600:02d}:{(s % 3600) // 60:02d}:{s % 60:02d}"


class WorkSessionSerializer(serializers.ModelSerializer):
    active_worked_seconds = serializers.SerializerMethodField()
    active_break_seconds  = serializers.SerializerMethodField()
    segments              = WorkSegmentSerializer(many=True, read_only=True)
    session_count         = serializers.SerializerMethodField()

    class Meta:
        model = WorkSession
        fields = (
            'id', 'user', 'date', 'state',
            'last_paused_at',
            'worked_seconds', 'break_seconds',
            'active_worked_seconds', 'active_break_seconds',
            'segments', 'session_count',
        )
        read_only_fields = (
            'user', 'date', 'last_paused_at',
            'worked_seconds', 'break_seconds',
        )

    def get_active_worked_seconds(self, obj):
        return obj.active_worked_seconds()

    def get_active_break_seconds(self, obj):
        return obj.active_break_seconds()

    def get_session_count(self, obj):
        return obj.segments.count()
