from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .interview_engine import generate_question, get_hint
from .evaluator import evaluate_answer, evaluate_full_interview


class StartInterviewView(APIView):
    def post(self, request):
        role = request.data.get('role', 'Software Engineer')
        question_type = request.data.get('type', 'technical')
        try:
            return Response({'question': generate_question(role, question_type)})
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class NextQuestionView(APIView):
    def post(self, request):
        role = request.data.get('role', 'Software Engineer')
        question_type = request.data.get('type', 'technical')
        history = request.data.get('history', [])
        try:
            return Response({'question': generate_question(role, question_type, history)})
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EvaluateAnswerView(APIView):
    def post(self, request):
        question = request.data.get('question', '')
        answer = request.data.get('answer', '')
        role = request.data.get('role', 'Software Engineer')
        if not question or not answer:
            return Response({'error': 'Question and answer are required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            return Response(evaluate_answer(question, answer, role))
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class InterviewSummaryView(APIView):
    def post(self, request):
        qa_pairs = request.data.get('qa_pairs', [])
        role = request.data.get('role', 'Software Engineer')
        if not qa_pairs:
            return Response({'error': 'Q&A pairs are required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            return Response(evaluate_full_interview(qa_pairs, role))
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class HintView(APIView):
    def post(self, request):
        question = request.data.get('question', '')
        role = request.data.get('role', 'Software Engineer')
        if not question:
            return Response({'error': 'Question is required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            return Response({'hint': get_hint(question, role)})
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
