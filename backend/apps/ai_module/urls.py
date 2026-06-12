from django.urls import path
from .views import InternInsightView
from .chatbot.views import ChatbotView
from .resume_builder.views import GenerateResumeView, ImproveResumeView, ParseResumeView
from .mock_interview.views import (
    StartInterviewView, NextQuestionView,
    EvaluateAnswerView, InterviewSummaryView, HintView
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class IndividualReportView(APIView):
    def get(self, request, user_id):
        try:
            from .performance_analysis.reports import generate_individual_report
            return Response(generate_individual_report(user_id))
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TeamReportView(APIView):
    def post(self, request):
        try:
            from .performance_analysis.reports import generate_team_report
            user_ids = request.data.get('user_ids', [])
            return Response(generate_team_report(user_ids))
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GenerateLearningPathView(APIView):
    def post(self, request):
        try:
            from .learning_path.generator import generate_learning_path
            return Response(generate_learning_path(request.data))
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


urlpatterns = [
    path('insights/<int:user_id>/', InternInsightView.as_view()),
    path('chatbot/', ChatbotView.as_view()),
    path('resume/generate/', GenerateResumeView.as_view()),
    path('resume/improve/', ImproveResumeView.as_view()),
    path('resume/parse/', ParseResumeView.as_view()),
    path('interview/start/', StartInterviewView.as_view()),
    path('interview/next/', NextQuestionView.as_view()),
    path('interview/evaluate/', EvaluateAnswerView.as_view()),
    path('interview/summary/', InterviewSummaryView.as_view()),
    path('interview/hint/', HintView.as_view()),
    path('performance/<int:user_id>/', IndividualReportView.as_view()),
    path('performance/team/', TeamReportView.as_view()),
    path('learning-path/', GenerateLearningPathView.as_view()),
]
