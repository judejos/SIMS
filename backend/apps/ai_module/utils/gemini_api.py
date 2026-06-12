import os
from google import genai
from google.genai import types

MODEL = 'gemini-2.5-flash'
_client = None


def get_client():
    global _client
    if _client is None:
        api_key = os.getenv('GEMINI_API_KEY', '')
        if not api_key or api_key == 'your-actual-gemini-api-key':
            raise ValueError(
                'GEMINI_API_KEY is not set. '
                'Get your key from https://aistudio.google.com/app/apikey '
                'and add it to backend/.env as GEMINI_API_KEY=your-key'
            )
        _client = genai.Client(api_key=api_key)
    return _client


def call_gemini(prompt: str, system: str = '', max_tokens: int = 1024) -> str:
    contents = f"{system}\n\n{prompt}" if system else prompt
    response = get_client().models.generate_content(
        model=MODEL,
        contents=contents,
        config=types.GenerateContentConfig(max_output_tokens=max_tokens),
    )
    return response.text


def call_gemini_stream(prompt: str, system: str = ''):
    contents = f"{system}\n\n{prompt}" if system else prompt
    for chunk in get_client().models.generate_content_stream(
        model=MODEL,
        contents=contents,
    ):
        if chunk.text:
            yield chunk.text
