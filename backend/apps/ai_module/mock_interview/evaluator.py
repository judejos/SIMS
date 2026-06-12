from ..utils.gemini_api import call_gemini

EVALUATOR_SYSTEM = """
You are an expert interview coach. Evaluate answers objectively and constructively.
Provide scores and actionable feedback.
"""


def evaluate_answer(question: str, answer: str, role: str) -> dict:
    prompt = f"""
Role: {role}
Interview Question: {question}
Candidate's Answer: {answer}

Evaluate this answer and respond in this exact format:
Score: <number 1-10>
Strengths: <what was good>
Improvements: <what could be better>
Model Answer: <a strong example answer>
"""
    response = call_gemini(prompt, system=EVALUATOR_SYSTEM, max_tokens=1024)
    return _parse_evaluation(response)


def evaluate_full_interview(qa_pairs: list, role: str) -> dict:
    summary_prompt = f"""
Role: {role}
Interview Q&A:
{chr(10).join([f"Q: {p['question']}" + chr(10) + f"A: {p['answer']}" for p in qa_pairs])}

Provide an overall interview performance summary:
- Overall score (1-10)
- Top 3 strengths
- Top 3 areas to improve
- Hiring recommendation (Strong Yes / Yes / Maybe / No)
"""
    response = call_gemini(summary_prompt, system=EVALUATOR_SYSTEM, max_tokens=1024)
    return {'summary': response}


def _parse_evaluation(text: str) -> dict:
    result = {'raw': text, 'score': 0, 'strengths': '', 'improvements': '', 'model_answer': ''}
    for line in text.split('\n'):
        if line.startswith('Score:'):
            try:
                result['score'] = int(''.join(filter(str.isdigit, line.split(':')[1])))
            except (ValueError, IndexError):
                pass
        elif line.startswith('Strengths:'):
            result['strengths'] = line.replace('Strengths:', '').strip()
        elif line.startswith('Improvements:'):
            result['improvements'] = line.replace('Improvements:', '').strip()
        elif line.startswith('Model Answer:'):
            result['model_answer'] = line.replace('Model Answer:', '').strip()
    return result
