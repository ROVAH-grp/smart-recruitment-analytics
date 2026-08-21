import sys
import os
import re

sys.path.append(os.path.join(os.path.dirname(__file__), "parser"))
sys.path.append(os.path.join(os.path.dirname(__file__), "nlp"))

from pdf_parser import extract_text_from_pdf
from docx_parser import extract_text_from_docx
from skills import extract_skills
from education import extract_education, EDUCATION_KEYWORDS
from sections import extract_section, extract_name


def build_candidate_profile(resume_text: str) -> dict:
    """
    Combines all extraction functions into a single structured
    candidate profile dictionary.
    """
    education_entries = extract_education(resume_text)

    raw_projects = extract_section(resume_text, "PROJECTS")
    project_lines = raw_projects.split("\n") if raw_projects else []

    # Filter out any lines that are actually education entries
    # (happens when a resume has no explicit "EDUCATION" header,
    # so the PROJECTS section runs on and swallows the degree lines).
    cleaned_projects = []
    for line in project_lines:
        is_education_line = line in education_entries or any(
            re.search(r"\b" + re.escape(keyword) + r"\b", line, re.IGNORECASE)
            for keyword in EDUCATION_KEYWORDS
        )
        if not is_education_line:
            cleaned_projects.append(line)

    profile = {
        "name": extract_name(resume_text),
        "skills": extract_skills(resume_text),
        "education": education_entries,
        "projects": cleaned_projects
    }
    return profile


if __name__ == "__main__":
    # Test with the PDF sample
    test_pdf_path = "resumes/sample_test_resume.pdf"
    resume_text = extract_text_from_pdf(test_pdf_path)

    profile = build_candidate_profile(resume_text)

    import json
    print("----- CANDIDATE PROFILE (PDF sample) -----")
    print(json.dumps(profile, indent=2))