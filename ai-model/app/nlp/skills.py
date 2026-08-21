import json
import re

def load_skills_dictionary(dictionary_path: str = "data/skills_dictionary.json") -> list:
    """
    Loads the list of known skills from the JSON dictionary file.
    """
    with open(dictionary_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data["skills"]


def extract_skills(resume_text: str, dictionary_path: str = "data/skills_dictionary.json") -> list:
    """
    Scans resume_text for any skills present in the skills dictionary.
    Uses word-boundary matching so partial word matches don't count
    (e.g. "C" won't match inside "Computer").
    Returns a list of matched skills (using the dictionary's original casing).
    """
    known_skills = load_skills_dictionary(dictionary_path)
    found_skills = []

    for skill in known_skills:
        # Build a regex pattern that matches the skill as a whole word/phrase,
        # case-insensitive. re.escape handles skills with special characters like "C++".
        pattern = r"\b" + re.escape(skill) + r"\b"
        if re.search(pattern, resume_text, re.IGNORECASE):
            found_skills.append(skill)

    return found_skills


if __name__ == "__main__":
    # Quick manual test — reuses the PDF parser to get resume text, then extracts skills
    import sys
    import os

    # Add the parser folder to the path so we can import it
    sys.path.append(os.path.join(os.path.dirname(__file__), "..", "parser"))
    from pdf_parser import extract_text_from_pdf

    test_pdf_path = "resumes/sample_test_resume.pdf"
    resume_text = extract_text_from_pdf(test_pdf_path)

    skills_found = extract_skills(resume_text)

    print("----- SKILLS FOUND -----")
    print(skills_found)
    