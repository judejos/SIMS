from ..utils.gemini_api import call_gemini
from .recommendations import get_resource_recommendations, get_skill_gap


def generate_learning_path(user_data: dict) -> dict:
    name = user_data.get('name', 'Intern')
    current_skills = user_data.get('skills', [])
    target_role = user_data.get('target_role', 'Software Engineer')
    duration_weeks = user_data.get('duration_weeks', 12)

    prompt = f"""
Create a {duration_weeks}-week personalized learning path for:
Name: {name}
Current Skills: {', '.join(current_skills) or 'None listed'}
Target Role: {target_role}

Structure the plan week by week with:
- Topic to learn
- Specific resources (courses, books, projects)
- Milestone/deliverable

Be practical and achievable.
"""
    plan = call_gemini(prompt, max_tokens=2048)
    skill_gaps = get_skill_gap(current_skills, target_role)
    resources = get_resource_recommendations(skill_gaps)

    return {
        'target_role': target_role,
        'duration_weeks': duration_weeks,
        'skill_gaps': skill_gaps,
        'recommended_resources': resources,
        'weekly_plan': plan,
    }
