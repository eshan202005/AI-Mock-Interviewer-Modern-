from fastapi import APIRouter, UploadFile, File
from PyPDF2 import PdfReader
import os

from services.resume_parsar import extract_resume_sections

router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)

UPLOAD_FOLDER = "uploads"

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):

    # Create uploads folder if not exists
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    # Save uploaded file
    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    # Read PDF
    reader = PdfReader(file_path)

    resume_text = ""

    for page in reader.pages:

        text = page.extract_text()

        if text:
            resume_text += text

    # Extract sections
    skills, projects, experience = extract_resume_sections(
        resume_text
    )

    return {
        "filename": file.filename,
        "skills": skills,
        "projects": projects,
        "experience": experience
    }