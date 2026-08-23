import sys
import os
import shutil
import tempfile

sys.path.append(os.path.dirname(__file__))
sys.path.append(os.path.join(os.path.dirname(__file__), "parser"))
sys.path.append(os.path.join(os.path.dirname(__file__), "nlp"))

from fastapi import FastAPI, UploadFile, File, HTTPException
from pdf_parser import extract_text_from_pdf
from docx_parser import extract_text_from_docx
from profile_builder import build_candidate_profile

app = FastAPI(title="Smart Recruitment Analytics - AI Service")


@app.get("/")
def read_root():
    return {"message": "AI service is running"}


@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    filename = file.filename.lower()

    if not (filename.endswith(".pdf") or filename.endswith(".docx")):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")

    suffix = ".pdf" if filename.endswith(".pdf") else ".docx"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp_file:
        shutil.copyfileobj(file.file, tmp_file)
        tmp_path = tmp_file.name

    try:
        if suffix == ".pdf":
            resume_text = extract_text_from_pdf(tmp_path)
        else:
            resume_text = extract_text_from_docx(tmp_path)

        candidate_profile = build_candidate_profile(resume_text)
        return candidate_profile
    finally:
        os.remove(tmp_path)