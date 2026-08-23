import re

# Common degree/education keywords to look for
EDUCATION_KEYWORDS = [
    "B.Tech", "B.E.", "BE", "B.Sc", "BSc", "Bachelor",
    "M.Tech", "M.E.", "ME", "M.Sc", "MSc", "Master",
    "Diploma", "MBA", "MCA", "BCA", "PhD", "CBSE", "ICSE"
]

# Words that suggest this is an objective/summary sentence, not an education entry
SUMMARY_INDICATORS = ["seeking", "opportunity", "gaining", "practical industry"]

# Maps degree abbreviations/variants to a canonical category,
# so "B.Tech" and "Bachelor" are recognized as equivalent.
EDUCATION_SYNONYMS = {
    "b.tech": "bachelor", "btech": "bachelor", "b.e.": "bachelor", "be": "bachelor",
    "b.sc": "bachelor", "bsc": "bachelor", "bachelor": "bachelor",
    "m.tech": "master", "mtech": "master", "m.e.": "bachelor", "me": "master",
    "m.sc": "master", "msc": "master", "master": "master",
    "diploma": "diploma", "mba": "master", "mca": "bachelor", "bca": "bachelor",
    "phd": "doctorate"
}


def extract_education(resume_text: str) -> list:
    """
    Scans resume_text line by line, looking for lines that contain
    known education/degree keywords. Skips lines that look like
    objective/summary sentences rather than actual education entries.
    Returns matching lines as a list of education entries.
    """
    education_entries = []
    lines = resume_text.split("\n")

    for line in lines:
        clean_line = line.strip()
        if not clean_line:
            continue

        # Skip lines that look like objective/summary sentences
        if any(indicator in clean_line.lower() for indicator in SUMMARY_INDICATORS):
            continue

        for keyword in EDUCATION_KEYWORDS:
            pattern = r"\b" + re.escape(keyword) + r"\b"
            if re.search(pattern, clean_line, re.IGNORECASE):
                education_entries.append(clean_line)
                break

    return education_entries


def education_matches_requirement(candidate_education: list, required_education: list) -> bool:
    """
    Checks whether any candidate education entry matches a required
    education category, using EDUCATION_SYNONYMS to normalize degree
    abbreviations (e.g. "B.Tech" counts as "Bachelor").
    """
    combined_text = " ".join(candidate_education).lower()

    candidate_categories = set()
    for keyword, category in EDUCATION_SYNONYMS.items():
        if keyword in combined_text:
            candidate_categories.add(category)

    required_categories = {
        EDUCATION_SYNONYMS.get(req.lower(), req.lower()) for req in required_education
    }

    return bool(candidate_categories & required_categories)


if __name__ == "__main__":
    import sys
    import os

    sys.path.append(os.path.join(os.path.dirname(__file__), "..", "parser"))
    from docx_parser import extract_text_from_docx

    test_docx_path = "resumes/sample_test_resume.docx"
    resume_text = extract_text_from_docx(test_docx_path)

    education_found = extract_education(resume_text)

    print("----- EDUCATION FOUND -----")
    for entry in education_found:
        print(entry)