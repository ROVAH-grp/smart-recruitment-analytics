import re

# Common degree/education keywords to look for
EDUCATION_KEYWORDS = [
    "B.Tech", "B.E.", "BE", "B.Sc", "BSc", "Bachelor",
    "M.Tech", "M.E.", "ME", "M.Sc", "MSc", "Master",
    "Diploma", "MBA", "MCA", "BCA", "PhD", "CBSE", "ICSE"
]

# Words that suggest this is an objective/summary sentence, not an education entry
SUMMARY_INDICATORS = ["seeking", "opportunity", "gaining", "practical industry"]


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