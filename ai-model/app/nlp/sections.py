import re

SECTION_HEADERS = [
    "EXPERIENCE", "EDUCATION", "SKILLS", "PROJECTS",
    "PERSONAL DETAILS", "SUMMARY", "OBJECTIVE"
]


def extract_section(resume_text: str, section_name: str) -> str:
    """
    Generic section extractor. Finds the given section_name header in
    resume_text and returns everything between it and the next section
    header (or end of text). Returns empty string if not found.
    """
    lines = resume_text.split("\n")
    section_lines = []
    inside_section = False

    for line in lines:
        clean_line = line.strip()

        if re.match(r"^" + re.escape(section_name) + r"$", clean_line, re.IGNORECASE):
            inside_section = True
            continue

        if inside_section:
            is_another_header = any(
                re.match(r"^" + re.escape(header) + r"$", clean_line, re.IGNORECASE)
                for header in SECTION_HEADERS
            )
            if is_another_header:
                break

            if clean_line:
                section_lines.append(clean_line)

    return "\n".join(section_lines)


def extract_name(resume_text: str) -> str:
    """
    Assumes the candidate's name is the first non-empty line of the resume
    (common convention). Returns it stripped of whitespace.
    """
    lines = resume_text.split("\n")
    for line in lines:
        clean_line = line.strip()
        if clean_line:
            return clean_line
    return ""