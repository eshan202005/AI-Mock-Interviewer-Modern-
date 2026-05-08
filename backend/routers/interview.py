from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import uuid

from services.question_generater import generate_questions
from services.interview_store import interview_sessions

router = APIRouter(
    prefix="/questions",
    tags=["Questions"]
)


# -----------------------------
# Request Models
# -----------------------------

class InterviewRequest(BaseModel):
    role: str
    skills: List[str]
    projects: List[str]
    experience: List[str]


class AnswerRequest(BaseModel):
    session_id: str
    question_index: int
    answer: str


# -----------------------------
# Generate Questions
# -----------------------------

@router.post("/generate")
def generate_interview_questions(
    data: InterviewRequest
):

    questions = generate_questions(
        data.role,
        data.skills,
        data.projects,
        data.experience
    )

    session_id = str(uuid.uuid4())

    interview_sessions[session_id] = {
        "questions": questions,
        "answers": {},
        "current_question": 0
    }

    return {
        "session_id": session_id,
        "questions": questions,
        "total_questions": len(questions)
    }


# -----------------------------
# Save Answer
# -----------------------------

@router.post("/save-answer")
def save_answer(
    data: AnswerRequest
):

    session = interview_sessions.get(
        data.session_id
    )

    if not session:

        return {
            "error": "Invalid session ID"
        }

    session["answers"][data.question_index] = data.answer

    return {
        "message": "Answer saved successfully"
    }


# -----------------------------
# Get Full Session
# -----------------------------

@router.get("/session/{session_id}")
def get_session(
    session_id: str
):

    session = interview_sessions.get(
        session_id
    )

    if not session:

        return {
            "error": "Invalid session ID"
        }

    return session


# -----------------------------
# Next Question
# -----------------------------

@router.post("/next-question")
def next_question(
    session_id: str
):

    session = interview_sessions.get(
        session_id
    )

    if not session:

        return {
            "error": "Invalid session ID"
        }

    total_questions = len(
        session["questions"]
    )

    if session["current_question"] < total_questions - 1:

        session["current_question"] += 1

    return {
        "current_question":
        session["current_question"]
    }


# -----------------------------
# Previous Question
# -----------------------------

@router.post("/previous-question")
def previous_question(
    session_id: str
):

    session = interview_sessions.get(
        session_id
    )

    if not session:

        return {
            "error": "Invalid session ID"
        }

    if session["current_question"] > 0:

        session["current_question"] -= 1

    return {
        "current_question":
        session["current_question"]
    }