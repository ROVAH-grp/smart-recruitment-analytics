def calculate_skills_score(candidate_skills: list, required_skills: list) -> float:
    """
    Returns the fraction of required_skills present in candidate_skills.
    Case-insensitive comparison.
    """
    if not required_skills:
        return 1.0

    candidate_skills_lower = [s.lower() for s in candidate_skills]
    matched = sum(1 for skill in required_skills if skill.lower() in candidate_skills_lower)
    return matched / len(required_skills)

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "nlp"))
from education import education_matches_requirement

def calculate_education_score(candidate_education: list, required_education: list) -> float:
    """
    Returns 1.0 if any candidate education entry matches a required
    education category (using synonym normalization), else 0.0.
    """
    if not required_education:
        return 1.0

    return 1.0 if education_matches_requirement(candidate_education, required_education) else 0.0

def calculate_projects_score(candidate_projects: list, preferred_keywords: list) -> float:
    """
    Returns the fraction of preferred_projects_keywords found anywhere
    in the candidate's projects text.
    """
    if not preferred_keywords:
        return 1.0

    combined_projects_text = " ".join(candidate_projects).lower()
    matched = sum(1 for keyword in preferred_keywords if keyword.lower() in combined_projects_text)
    return matched / len(preferred_keywords)


def calculate_match_score(candidate_profile: dict, job_requirement: dict) -> dict:
    """
    Calculates a weighted overall match score (0-100) between a
    candidate profile and a job requirement, using these weights:
    Skills 50%, Experience 20%, Education 10%, Certifications 10%, Projects 10%.

    Returns a dict with the overall score and each category's sub-score,
    so we can explain the breakdown (useful for your viva/presentation).
    """
    skills_score = calculate_skills_score(
        candidate_profile.get("skills", []),
        job_requirement.get("required_skills", [])
    )

    # Experience scoring is simplified for now — we don't extract years yet
    experience_score = 1.0

    education_score = calculate_education_score(
        candidate_profile.get("education", []),
        job_requirement.get("required_education", [])
    )

    # Certifications not extracted yet — scored as 0 for now
    certifications_score = 0.0

    projects_score = calculate_projects_score(
        candidate_profile.get("projects", []),
        job_requirement.get("preferred_projects_keywords", [])
    )

    overall_score = (
        skills_score * 0.50 +
        experience_score * 0.20 +
        education_score * 0.10 +
        certifications_score * 0.10 +
        projects_score * 0.10
    ) * 100

    return {
        "overall_score": round(overall_score, 2),
        "breakdown": {
            "skills_score": round(skills_score * 100, 2),
            "experience_score": round(experience_score * 100, 2),
            "education_score": round(education_score * 100, 2),
            "certifications_score": round(certifications_score * 100, 2),
            "projects_score": round(projects_score * 100, 2)
        }
    }


if __name__ == "__main__":
    import sys
    import os
    import json

    sys.path.append(os.path.join(os.path.dirname(__file__), "..", "parser"))
    sys.path.append(os.path.join(os.path.dirname(__file__), "..", "nlp"))
    sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

    from pdf_parser import extract_text_from_pdf
    from profile_builder import build_candidate_profile

    # Load the sample job requirement
    with open("data/sample_job.json", "r", encoding="utf-8") as f:
        job_requirement = json.load(f)

    # Build the candidate profile from the PDF sample
    resume_text = extract_text_from_pdf("resumes/sample_test_resume.pdf")
    candidate_profile = build_candidate_profile(resume_text)

    match_result = calculate_match_score(candidate_profile, job_requirement)

    print("----- MATCH RESULT -----")
    print(json.dumps(match_result, indent=2))