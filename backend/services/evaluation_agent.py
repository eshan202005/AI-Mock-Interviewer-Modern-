"""Evaluation helper for interview questions using Groq API."""

from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()#load environment variables from .env file, including GROQ_API_KEY


def evaluate_answer(question, answer, question_number):
    """Evaluate a candidate answer and return structured feedback.

    Args:
        question (str): The interview question text.
        answer (str): The candidate's answer text.
        question_number (int): Zero-based index of the question.

    Returns:
        str: Structured evaluation output from the Groq model.
    """

    # Create the Groq client using the API key from the environment.
    client = Groq(
        api_key=os.getenv("GROQ_API_KEY")
    )

    clean_answer = answer.strip()

    # These default editor templates should count as unanswered.
    default_templates = [
        "",
        "# Write your Python solution here\n\ndef solve():\n    pass",
        "# Write your Python solution here\r\n\r\ndef solve():\r\n    pass",
        "def solve():\n    pass",
        "def solve():\r\n    pass",
        "pass"
    ]

    # For the first two questions, treat short or template code as not attempted.
    if question_number < 2:
        if (
            not clean_answer or
            clean_answer in default_templates or
            len(clean_answer) < 5
        ):
            return (
                "Result: Not Attempted\n"
                "Score: 0/10\n"
                "Feedback: No code was provided.\n"
                "Improvement: Write code to solve the problem.\n"
            )

    # For non-coding questions, treat a very short response as not attempted.
    else:
        if (
            not clean_answer or
            len(clean_answer) < 5
        ):
            return (
                "Result: Not Attempted\n"
                "Feedback: No response was provided.\n"
                "Improvement: Provide a detailed answer.\n"
            )

    # Build the prompt for the language model.
    prompt = f"""
You are an expert technical interviewer.

IMPORTANT RULES:

- Question 1 and Question 2 are coding questions.
- All remaining questions are non-coding questions.

--------------------------------

CODING QUESTIONS:

Evaluate the candidate's code.

Provide:

Result: Correct or Incorrect

Score: X/10

Logic Feedback:
Explain where the logic is right or wrong.

Improvement:
Suggest one improvement.

--------------------------------

NON-CODING QUESTIONS:

First decide:
Is the answer correct or incorrect?

Rules:

- If the answer is completely wrong or irrelevant:
    Result: Incorrect
    Do NOT give a score

- If the answer is partially correct or correct:
    Result: Correct
    Score: X/10
    Feedback: Brief evaluation
    Improvement: How the candidate can improve

--------------------------------

Now evaluate:

Question Number: {question_number + 1}

Question:
{question}

Answer:
{answer}

Return in clean structured format.
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    # Return the raw text from the API response.
    return response.choices[0].message.content  