import pymupdf  # PyMuPDF (using the modern import name)

def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Opens a PDF file and extracts all text from every page.
    Returns the combined text as a single string.
    """
    doc = pymupdf.open(pdf_path)
    full_text = ""

    for page_num, page in enumerate(doc):
        page_text = page.get_text()
        full_text += page_text

    doc.close()
    return full_text


if __name__ == "__main__":
    # Quick manual test — run this file directly to see extraction in action
    test_pdf_path = "resumes/sample_test_resume.pdf"
    extracted_text = extract_text_from_pdf(test_pdf_path)

    print("----- EXTRACTED TEXT START -----")
    print(extracted_text)
    print("----- EXTRACTED TEXT END -----")