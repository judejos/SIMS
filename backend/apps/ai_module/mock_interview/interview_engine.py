from ..utils.gemini_api import call_gemini

INTERVIEW_SYSTEM = """
You are an experienced technical interviewer conducting a mock interview.
Ask one question at a time. Be professional but encouraging.
Adapt difficulty based on the candidate's responses.
"""

QUESTION_TYPES = {
    'technical': 'Ask a technical question about {role} skills.',
    'behavioral': 'Ask a behavioral/situational question using the STAR method.',
    'hr': 'Ask a common HR interview question.',
}


def generate_question(role: str, question_type: str = 'technical', history: list = None) -> str:
    history = history or []
    context = '\n'.join([f"Q: {h['question']}\nA: {h['answer']}" for h in history[-3:]])
    prompt_template = QUESTION_TYPES.get(question_type, QUESTION_TYPES['technical'])
    prompt = f"""
Role being interviewed for: {role}
Previous Q&A:
{context}

{prompt_template.format(role=role)}
Ask only the question, no preamble.
"""
    return call_gemini(prompt, system=INTERVIEW_SYSTEM)


def get_hint(question: str, role: str) -> str:
    prompt = f"Give a brief hint (2-3 sentences) for answering this interview question for a {role} role: {question}"
    return call_gemini(prompt, system=INTERVIEW_SYSTEM)
