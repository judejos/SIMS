from ..utils.gemini_api import call_gemini

RESUME_SYSTEM = "You are an expert resume writer. Create professional, ATS-friendly resumes."


def generate_resume(user_data: dict) -> str:
    prompt = f"""
Create a professional resume for:
Name: {user_data.get('name', '')}
Role: {user_data.get('role', 'Software Intern')}
Skills: {', '.join(user_data.get('skills', []))}
Education: {user_data.get('education', '')}
Experience: {user_data.get('experience', '')}
Projects: {user_data.get('projects', '')}

Format it as a clean, ATS-friendly resume with sections:
Summary, Skills, Education, Experience, Projects.
"""
    return call_gemini(prompt, system=RESUME_SYSTEM, max_tokens=2048)


def improve_resume(existing_resume: str, job_description: str = '') -> str:
    prompt = f"""
Improve this resume to be more impactful and professional:

{existing_resume}

{"Target job description: " + job_description if job_description else ""}

Provide specific improvements with the updated resume.
"""
    return call_gemini(prompt, system=RESUME_SYSTEM, max_tokens=2048)
