import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "app", "nlp"))

from education import extract_education, education_matches_requirement


def test_extract_education_finds_degree_line():
    resume_text = "Some intro text\nB.Tech Computer Science, 2023\nSkills section here"
    result = extract_education(resume_text)

    assert any("B.Tech" in entry for entry in result)


def test_extract_education_skips_objective_sentences():
    resume_text = "Diploma student seeking an internship opportunity to gain practical industry experience."
    result = extract_education(resume_text)

    assert result == []


def test_education_matches_requirement_recognizes_btech_as_bachelor():
    candidate_education = ["B.Tech Computer Science, 2023"]
    required_education = ["Bachelor"]

    assert education_matches_requirement(candidate_education, required_education) is True


def test_education_matches_requirement_returns_false_when_no_match():
    candidate_education = ["Diploma in Computer Engineering"]
    required_education = ["Master"]

    assert education_matches_requirement(candidate_education, required_education) is False