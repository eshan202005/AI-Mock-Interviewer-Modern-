from groq import Groq
import os
import re
from dotenv import load_dotenv

load_dotenv()


def generate_questions(role, skills, projects, experience):
# Create Groq client for generating interview questions

    client = Groq(
        api_key=os.getenv("GROQ_API_KEY")
    )
     # Determine whether the candidate has prior experience

    has_experience = len(experience) > 0
# Generate different numbers of questions
    # depending on candidate experience level
    if has_experience:
        question_count = 15
    else:
        question_count = 12
# Build a dynamic prompt using candidate profile information.
    # The AI uses role, skills, projects and experience
    # to generate personalized interview questions.
    prompt = f"""
You are an expert technical interviewer.

Role: {role}

Skills: {skills}

Projects: {projects}

Experience: {experience}

Generate exactly {question_count} interview questions.

IMPORTANT — Follow this exact order:

1. Question 1 — DSA Coding Question (Easy)

2. Question 2 — DSA Coding Question (Medium)

These two coding questions MUST be formatted EXACTLY like LeetCode.

VERY IMPORTANT FORMATTING RULES FOR CODING QUESTIONS:

- Use proper line breaks
- Put each section on a new line
- Never write everything in one paragraph
- Keep formatting clean and professional
- Use spacing exactly like LeetCode
- Coding questions MUST be multiline formatted

Use EXACTLY this structure:

Question:
<problem statement>

Example 1:
Input:
...

Output:
...

Explanation:
...

Constraints:
- ...
- ...

If the problem involves:
- Linked Lists
- Trees
- Graphs

Then include a text diagram.

Example linked list diagram:

1 -> 2 -> 3 -> 4

Example tree diagram:

        1
       / \\
      2   3

VERY IMPORTANT:
DO NOT compress coding questions into one paragraph.

3–6 — Skill-based questions
These must be based on the candidate's skills.

7–10 — Project-based questions
These must be based on the candidate's projects.
"""
# Add experience-based questions only for experienced candidates.
    # Freshers receive fewer questions and more focus on HR.
    if has_experience:

        prompt += """

11–13 — Experience-based questions
These must be based on the candidate's work experience.

14–15 — HR questions
"""

    else:
 # Add final formatting instructions to ensure
    # consistent numbered output from the LLM.
        prompt += """

11–12 — HR questions
"""

    prompt += """

CRITICAL RULES:

- Generate EXACTLY the required number of questions
- Return ONLY numbered questions
- Do NOT include headings
- Questions MUST start with proper numbering format

Example:
1. Question here
2. Question here
3. Question here

VERY IMPORTANT:
- Only Question 1 and Question 2 should be coding questions
- All remaining questions must be non-coding
- Coding questions must contain proper spacing and line breaks
- Use professional formatting like LeetCode
- Preserve all line breaks
- Do not merge Input/Output/Constraints into one line

Return only numbered questions.
"""
# Send question-generation request to Groq LLM
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    questions_text = response.choices[0].message.content

     # Use regex to split the LLM response into
    # individual numbered questions

    pattern = r"\d+\.\s.*?(?=\n\d+\.|\Z)"

    matches = re.findall(
        pattern,
        questions_text,
        re.DOTALL
    )

    questions = [
        q.strip()
        for q in matches
    ]
 # Ensure the final list contains only the required number of questions
    questions = questions[:question_count]

    return questions