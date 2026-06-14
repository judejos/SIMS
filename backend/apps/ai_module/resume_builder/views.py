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
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file uploaded.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            text = ""
            filename = file_obj.name.lower()
            if filename.endswith('.pdf'):
                import pdfplumber
                with pdfplumber.open(file_obj) as pdf:
                    for page in pdf.pages:
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text + "\n"
            elif filename.endswith('.docx') or filename.endswith('.doc'):
                import docx
                doc = docx.Document(file_obj)
                for para in doc.paragraphs:
                    text += para.text + "\n"
            else:
                text = file_obj.read().decode('utf-8', errors='ignore')

            return Response({'text': text.strip()})
        except Exception as e:
            return Response({'error': f'Failed to parse file: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
