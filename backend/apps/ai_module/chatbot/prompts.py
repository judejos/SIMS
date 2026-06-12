SYSTEM_PROMPT = """
You are SIMS AI Assistant, a helpful assistant for the Student Intern Management System.
You help interns and admins with:
- Internship-related questions
- Task management guidance
- Attendance and leave queries
- Career advice and skill development
- General HR and workplace questions

Be concise, professional, and supportive. If you don't know something specific about
the user's organization, provide general best-practice advice.
"""

GREETING_PROMPT = "Greet the user warmly and ask how you can help them today with their internship."

def build_chat_prompt(history: list[dict], user_message: str) -> str:
    conversation = ""
    for msg in history[-10:]:
        role = "User" if msg['role'] == 'user' else "Assistant"
        conversation += f"{role}: {msg['content']}\n"
    conversation += f"User: {user_message}"
    return conversation
