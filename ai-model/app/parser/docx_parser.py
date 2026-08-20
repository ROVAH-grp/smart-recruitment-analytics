from docx import Document

def extract_text_from_docx(docx_path: str) -> str:
    """
    Opens a DOCX file and extracts all text from every paragraph.
    Returns the combined text as a single string.
    """
    doc = Document(docx_path)
    full_text = ""

    for paragraph in doc.paragraphs:
        full_text += paragraph.text + "\n"

    return full_text


if __name__ == "__main__":
    # Quick manual test — run this file directly to see extraction in action
    test_docx_path = "resumes/sample_test_resume.docx"
    extracted_text = extract_text_from_docx(test_docx_path)

    print("----- EXTRACTED TEXT START -----")
    print(extracted_text)
    print("----- EXTRACTED TEXT END -----")