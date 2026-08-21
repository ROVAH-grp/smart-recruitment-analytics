import re

# Section headers that might appear in a resume (used to detect section boundaries)
SECTION_HEADERS = [
    "EXPERIENCE", "EDUCATION", "SKILLS", "PROJECTS",
    "PERSONAL DETAILS", "SUMMARY", "OBJECTIVE"
]


def extract_experience(resume_text: str) -> str:
    """
    Finds the EXPERIENCE section in resume_text and returns everything
    between it and the next section header (or end of text if none found).
    Returns an empty string if no EXPERIENCE section is found.
    """
    lines = resume_text.split("\n")
    experience_lines = []
    inside_experience_section = False

    for line in lines:
        clean_line = line.strip()

        # Check if this line is the EXPERIENCE header itself
        if re.match(r"^EXPERIENCE$", clean_line, re.IGNORECASE):
            inside_experience_section = True
            continue

        # If we're inside the experience section, check if we've hit another header
        if inside_experience_section:
            is_another_header = any(
                re.match(r"^" + re.escape(header) + r"$", clean_line, re.IGNORECASE)
                for header in SECTION_HEADERS
            )
            if is_another_header:
                break  # stop, we've reached the next section

            if clean_line:  # skip empty lines
                experience_lines.append(clean_line)

    return "\n".join(experience_lines)


if __name__ == "__main__":
    import sys
    import os

    sys.path.append(os.path.join(os.path.dirname(__file__), "..", "parser"))
    from pdf_parser import extract_text_from_pdf

    test_pdf_path = "resumes/sample_test_resume.pdf"
    resume_text = extract_text_from_pdf(test_pdf_path)

    experience_found = extract_experience(resume_text)

    print("----- EXPERIENCE FOUND -----")
    print(experience_found)