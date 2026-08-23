import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "app", "matching"))

from matcher import calculate_match_score


def test_calculate_match_score_perfect_skills_match():
    candidate_profile = {
        "skills": ["Python", "SQL", "Power BI", "Excel"],
        "education": ["B.Tech Computer Science, 2023"],
        "projects": []
    }
    job_requirement = {
        "required_skills": ["Python", "SQL", "Power BI", "Excel"],
        "required_education": ["Bachelor"],
        "required_certifications": [],
        "preferred_projects_keywords": []
    }

    result = calculate_match_score(candidate_profile, job_requirement)

    assert result["breakdown"]["skills_score"] == 100.0
    assert result["breakdown"]["education_score"] == 100.0


def test_calculate_match_score_partial_skills_match():
    candidate_profile = {
        "skills": ["Java", "HTML"],
        "education": ["Diploma in Computer Engineering"],
        "projects": []
    }
    job_requirement = {
        "required_skills": ["Python", "SQL", "Power BI", "Excel"],
        "required_education": ["Bachelor"],
        "required_certifications": [],
        "preferred_projects_keywords": []
    }

    result = calculate_match_score(candidate_profile, job_requirement)

    assert result["breakdown"]["skills_score"] == 0.0
    assert result["breakdown"]["education_score"] == 0.0


def test_calculate_match_score_returns_expected_keys():
    candidate_profile = {"skills": [], "education": [], "projects": []}
    job_requirement = {"required_skills": [], "required_education": [], "required_certifications": [], "preferred_projects_keywords": []}

    result = calculate_match_score(candidate_profile, job_requirement)

    assert "overall_score" in result
    assert "breakdown" in result