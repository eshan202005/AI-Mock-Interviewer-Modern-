from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import uuid

from services.question_generater import generate_questions
from services.interview_store import interview_sessions

# DATABASE IMPORTS
from database.db import SessionLocal
from database.models import Interview

router = APIRouter(
    prefix="/questions",
    tags=["Questions"]
)


# -----------------------------
# REQUEST MODELS
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
# GENERATE QUESTIONS
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

    # -----------------------------
    # SAVE IN MEMORY ONLY
    # -----------------------------

    interview_sessions[session_id] = {
        "questions": questions,
        "answers": {},
        "current_question": 0
    }

    # -----------------------------
    # SAVE SUMMARY IN DATABASE
    # -----------------------------

    db = SessionLocal()

    new_interview = Interview(
        session_id=session_id,
        role=data.role,
        skills=", ".join(data.skills),
        projects=", ".join(data.projects),
        experience=", ".join(data.experience),
        total_score="Pending",
        evaluation="Pending"
    )

    db.add(new_interview)

    db.commit()

    db.refresh(new_interview)

    db.close()

    return {
        "session_id": session_id,
        "questions": questions,
        "total_questions": len(questions)
    }


# -----------------------------
# SAVE ANSWER
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

    # SAVE ANSWERS ONLY IN MEMORY

    session["answers"][data.question_index] = data.answer

    return {
        "message": "Answer saved successfully"
    }


# -----------------------------
# GET SESSION
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
# NEXT QUESTION
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
# PREVIOUS QUESTION
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


# -----------------------------
# GET ALL INTERVIEWS
# -----------------------------

@router.get("/all")
def get_all_interviews():

    db = SessionLocal()

    interviews = db.query(Interview).all()

    result = []

    for interview in interviews:

        result.append({
            "id": interview.id,
            "role": interview.role,
            "skills": interview.skills,
            "projects": interview.projects,
            "experience": interview.experience,
            "total_score": interview.total_score,
            "evaluation": interview.evaluation,
            "created_at": interview.created_at
        })

    db.close()

    return result