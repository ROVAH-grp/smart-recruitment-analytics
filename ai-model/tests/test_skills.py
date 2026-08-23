import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "app", "nlp"))

from skills import extract_skills


def test_extract_skills_finds_known_skills():
    resume_text = "I know Python, SQL, and Power BI very well."
    result = extract_skills(resume_text, dictionary_path="data/skills_dictionary.json")

    assert "Python" in result
    assert "SQL" in result
    assert "Power BI" in result


def test_extract_skills_ignores_partial_word_matches():
    # "C" should NOT match inside "Computer"
    resume_text = "I studied Computer Science."
    result = extract_skills(resume_text, dictionary_path="data/skills_dictionary.json")

    assert "C" not in result


def test_extract_skills_returns_empty_list_for_no_matches():
    resume_text = "This text has no programming skills mentioned at all."
    result = extract_skills(resume_text, dictionary_path="data/skills_dictionary.json")

    assert result == []