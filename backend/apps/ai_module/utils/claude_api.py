# Deprecated: Claude has been replaced with Gemini.
# This file is kept for backward compatibility only.
from .gemini_api import call_gemini as call_claude, call_gemini_stream as call_claude_stream

__all__ = ['call_claude', 'call_claude_stream']
