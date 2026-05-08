AI Mock Interview Platform

A modern AI-powered mock interview platform built with React, FastAPI, and AI models.
The platform generates technical, coding, and voice-based interview questions from resumes and evaluates user responses with AI-generated scoring and feedback.

Features
AI-generated interview questions
Resume parsing and skill extraction
Coding interview support
Monaco code editor
Multiple programming language selection
Voice interview mode
Speech-to-text transcription
Replace / Extend answer options
AI evaluation and scoring
Per-question timer system
Question navigation with saved answers
Modern animated UI
Responsive design
Tech Stack
Frontend
React + Vite
Tailwind CSS
Framer Motion
Monaco Editor
Axios
Backend
FastAPI
Python
Uvicorn
AI / Services
Resume parsing
Question generation
Voice transcription
AI answer evaluation
Project Structure
ai/
│
├── backend/
│   ├── routers/
│   ├── services/
│   ├── uploads/
│   └── main.py
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── .gitignore
Installation
Clone Repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
Backend Setup
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

Backend runs on:

http://127.0.0.1:8000
Frontend Setup
cd frontend
npm install
npm run dev

Frontend runs on:

http://localhost:5173
Environment Variables

Create a .env file inside the backend folder.

Example:

OPENAI_API_KEY=your_api_key
Future Improvements
Webcam proctoring
AI emotion analysis
Live coding execution
Authentication system
Interview analytics dashboard
Database integration
Cloud deployment
Author

Developed by Eshan Gupta.