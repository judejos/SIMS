from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .services import get_chat_response


class ChatbotView(APIView):
    def post(self, request):
        message = request.data.get('message', '').strip()
        history = request.data.get('history', [])

        if not message:
            return Response({'error': 'Message is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            reply = get_chat_response(message, history)
            return Response({'reply': reply})
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            return Response({'error': f'AI service error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
