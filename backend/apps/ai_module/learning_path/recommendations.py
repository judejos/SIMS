from ..utils.gemini_api import call_gemini

LEARNING_RESOURCES = {
    'python': ['Python Crash Course', 'Real Python', 'CS50P'],
    'django': ['Django Official Docs', 'Django for Beginners', 'TestDriven.io'],
    'react': ['React Official Docs', 'Full Stack Open', 'Scrimba React'],
    'javascript': ['javascript.info', 'Eloquent JavaScript', 'FreeCodeCamp'],
    'sql': ['SQLZoo', 'Mode SQL Tutorial', 'PostgreSQL Tutorial'],
    'git': ['Pro Git Book', 'GitHub Skills', 'Atlassian Git Tutorials'],
    'machine learning': ['fast.ai', 'Coursera ML Specialization', 'Kaggle Learn'],
    'docker': ['Docker Official Docs', 'Play with Docker', 'Docker Mastery Udemy'],
}


def get_resource_recommendations(skills: list) -> dict:
    recommendations = {}
    for skill in skills:
        key = skill.lower()
        if key in LEARNING_RESOURCES:
            recommendations[skill] = LEARNING_RESOURCES[key]
    return recommendations


def get_skill_gap(current_skills: list, target_role: str) -> list:
    prompt = f"""
Current skills: {', '.join(current_skills)}
Target role: {target_role}

List only the top 5 missing skills needed for this role, one per line, no explanations.
"""
    response = call_gemini(prompt)
    return [s.strip().lstrip('- ').lstrip('0123456789. ') for s in response.strip().split('\n') if s.strip()]
