from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .generator import generate_resume, improve_resume
from .parser import parse_resume_text


class GenerateResumeView(APIView):
    def post(self, request):
        if not request.data.get('name'):
            return Response({'error': 'Name is required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            return Response({'resume': generate_resume(request.data)})
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ImproveResumeView(APIView):
    def post(self, request):
        existing = request.data.get('resume', '')
        if not existing:
            return Response({'error': 'Resume text is required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            return Response({'resume': improve_resume(existing, request.data.get('job_description', ''))})
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ParseResumeView(APIView):
    def post(self, request):
        text = request.data.get('text', '')
        if not text:
            return Response({'error': 'Resume text is required.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(parse_resume_text(text))
