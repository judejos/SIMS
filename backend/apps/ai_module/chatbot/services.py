from ..utils.gemini_api import call_gemini, call_gemini_stream
from .prompts import SYSTEM_PROMPT, build_chat_prompt


def get_chat_response(user_message: str, history: list = None) -> str:
    history = history or []
    prompt = build_chat_prompt(history, user_message)
    return call_gemini(prompt, system=SYSTEM_PROMPT)


def get_chat_response_stream(user_message: str, history: list = None):
    history = history or []
    prompt = build_chat_prompt(history, user_message)
    yield from call_gemini_stream(prompt, system=SYSTEM_PROMPT)
