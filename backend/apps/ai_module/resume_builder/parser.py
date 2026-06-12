import re


def parse_resume_text(text: str) -> dict:
    """Extract structured data from raw resume text."""
    return {
        'email': _extract_email(text),
        'phone': _extract_phone(text),
        'skills': _extract_skills(text),
        'education': _extract_section(text, 'education'),
        'experience': _extract_section(text, 'experience'),
        'raw': text,
    }


def _extract_email(text: str) -> str:
    match = re.search(r'[\w.-]+@[\w.-]+\.\w+', text)
    return match.group() if match else ''


def _extract_phone(text: str) -> str:
    match = re.search(r'(\+?\d[\d\s\-]{8,14}\d)', text)
    return match.group().strip() if match else ''


def _extract_skills(text: str) -> list:
    KNOWN_SKILLS = [
        'python', 'django', 'react', 'javascript', 'typescript', 'sql',
        'java', 'c++', 'machine learning', 'data analysis', 'git',
        'docker', 'aws', 'rest api', 'html', 'css', 'node.js',
    ]
    lower = text.lower()
    return [s for s in KNOWN_SKILLS if s in lower]


def _extract_section(text: str, section: str) -> str:
    pattern = rf'{section}[:\s]*(.*?)(?=\n[A-Z]{{2,}}|\Z)'
    match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
    return match.group(1).strip()[:500] if match else ''
