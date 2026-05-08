from fastapi import APIRouter, UploadFile, File
import tempfile
import os

from services.voice import transcribe_audio

router = APIRouter(
    prefix="/voice",
    tags=["Voice"]
)


@router.post("/transcribe")
async def transcribe(
    audio: UploadFile = File(...)
):

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".wav"
    ) as temp_audio:

        content = await audio.read()

        temp_audio.write(content)

        temp_path = temp_audio.name

    transcript = transcribe_audio(
        temp_path
    )

    os.remove(temp_path)

    return {
        "transcript": transcript
    }