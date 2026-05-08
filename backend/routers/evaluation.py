from fastapi import APIRouter
from pydantic import BaseModel

from services.interview_store import interview_sessions
from services.evaluation_agent import evaluate_answer

router = APIRouter(
    prefix="/evaluation",
    tags=["Evaluation"]
)


class EvaluationRequest(BaseModel):
    session_id: str


@router.post("/submit")
def submit_interview(
    data: EvaluationRequest
):

    session = interview_sessions.get(
        data.session_id
    )

    if not session:

        return {
            "error": "Invalid session ID"
        }

    questions = session["questions"]
    answers = session["answers"]

    evaluations = []

    total_score = 0

    strengths = []
    weaknesses = []

    # ---------------------------------
    # Loop Through Questions
    # ---------------------------------

    for index, question in enumerate(questions):

        answer = answers.get(
            index,
            "No answer provided"
        )

        # ---------------------------------
        # Safe AI Evaluation
        # ---------------------------------

        try:

            ai_feedback = evaluate_answer(
                question,
                answer,
                index
            )

        except Exception as e:

            ai_feedback = (
                f"AI evaluation failed: {str(e)}"
            )

        # ---------------------------------
        # Score Logic
        # ---------------------------------

        if (
            answer == "No answer provided"
            or answer.strip() == ""
        ):

            score = 0

            weaknesses.append(
                f"Question {index + 1} was skipped"
            )

        else:

            answer_length = len(answer)

            if answer_length > 250:

                score = 9

                strengths.append(
                    f"Excellent detailed answer for Question {index + 1}"
                )

            elif answer_length > 120:

                score = 7

                strengths.append(
                    f"Good answer for Question {index + 1}"
                )

            elif answer_length > 50:

                score = 5

            else:

                score = 3

                weaknesses.append(
                    f"Very short answer for Question {index + 1}"
                )

        total_score += score

        # ---------------------------------
        # Store Evaluation
        # ---------------------------------

        evaluations.append({

            "question_number": index + 1,

            "question": question,

            "answer": answer,

            "feedback": ai_feedback,

            "score": score
        })

    # ---------------------------------
    # Final Score Calculation
    # ---------------------------------

    if len(questions) > 0:

        final_score = int(
            (
                total_score
                / (len(questions) * 10)
            ) * 100
        )

    else:

        final_score = 0

    # ---------------------------------
    # AI Summary
    # ---------------------------------

    if final_score >= 80:

        summary = (
            "Excellent interview performance with strong technical understanding and communication skills."
        )

    elif final_score >= 60:

        summary = (
            "Good overall performance with decent technical knowledge."
        )

    elif final_score >= 40:

        summary = (
            "Average interview performance. More practice is recommended."
        )

    else:

        summary = (
            "Interview performance needs improvement. Focus on solving more interview questions and improving explanations."
        )

    # ---------------------------------
    # Default Strengths
    # ---------------------------------

    if len(strengths) == 0:

        strengths.append(
            "Attempted interview process"
        )

    # ---------------------------------
    # Default Weaknesses
    # ---------------------------------

    if len(weaknesses) == 0:

        weaknesses.append(
            "Can further improve answer depth"
        )

    # ---------------------------------
    # FINAL RESPONSE
    # ---------------------------------

    return {

        "score": final_score,

        "summary": summary,

        "strengths": strengths,

        "weaknesses": weaknesses,

        "feedback": evaluations
    }