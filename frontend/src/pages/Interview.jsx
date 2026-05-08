import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

import {
    ChevronLeft,
    ChevronRight,
    Mic,
    Square,
    Clock3,
    Code2,
    Volume2,
} from "lucide-react"

import { useNavigate } from "react-router-dom"

import Editor from "@monaco-editor/react"

import API from "../services/api"

import Background from "../components/Background"

function Interview() {

    const navigate = useNavigate()

    const mediaRecorderRef = useRef(null)

    const audioChunksRef = useRef([])

    // -----------------------------------
    // STATES
    // -----------------------------------

    const [questions, setQuestions] =
        useState([])

    const [answers, setAnswers] =
        useState({})

    const [currentQuestion, setCurrentQuestion] =
        useState(0)

    const [answer, setAnswer] =
        useState("")

    const [loading, setLoading] =
        useState(true)

    const [recording, setRecording] =
        useState(false)

    const [transcribing, setTranscribing] =
        useState(false)

    const [submitting, setSubmitting] =
        useState(false)

    const [selectedLanguage, setSelectedLanguage] =
        useState("python")

    const [voiceMode, setVoiceMode] =
        useState("replace")

    // -----------------------------------
    // QUESTION TIMERS
    // -----------------------------------

    const [questionTimers, setQuestionTimers] =
        useState({})

    const [lockedQuestions, setLockedQuestions] =
        useState({})

    const session_id =
        localStorage.getItem("session_id")

    // -----------------------------------
    // CODE BOILERPLATES
    // -----------------------------------

    const boilerplates = {

        python:
            `# Write your Python solution here

def solve():
    pass
`,

        javascript:
            `// Write your JavaScript solution here

function solve() {

}
`,

        cpp:
            `// Write your C++ solution here

#include <iostream>
using namespace std;

int main() {

    return 0;
}
`,

        java:
            `// Write your Java solution here

public class Main {

    public static void main(String[] args) {

    }
}
`
    }

    // -----------------------------------
    // FETCH SESSION
    // -----------------------------------

    useEffect(() => {

        fetchSession()

    }, [])

    const fetchSession = async () => {

        try {

            const response =
                await API.get(
                    `/questions/session/${session_id}`
                )

            const fetchedQuestions =
                response.data.questions || []

            setQuestions(fetchedQuestions)

            // -----------------------------------
            // INITIALIZE TIMERS
            // -----------------------------------

            const timers = {}

            fetchedQuestions.forEach((_, index) => {

                if (index < 2) {

                    timers[index] = 1800
                }

                else {

                    timers[index] = 300
                }
            })

            setQuestionTimers(timers)

            const fetchedAnswers =
                response.data.answers || {}

            setAnswers(fetchedAnswers)

            const index =
                response.data.current_question || 0

            setCurrentQuestion(index)

            const savedAnswer =
                fetchedAnswers[index]

            if (savedAnswer) {

                setAnswer(savedAnswer)

            } else {

                if (index < 2) {

                    setAnswer(
                        boilerplates.python
                    )

                } else {

                    setAnswer("")
                }
            }

        } catch (error) {

            console.log(error)
        }

        setLoading(false)
    }

    // -----------------------------------
    // CURRENT QUESTION
    // -----------------------------------

    const currentQuestionText =
        questions[currentQuestion] || ""

    const cleanQuestion =
        currentQuestionText.replace(
            /^\d+\.\s*/,
            ""
        )

    const isCodingQuestion =
        currentQuestion < 2

    // -----------------------------------
    // CURRENT TIMER
    // -----------------------------------

    const timeLeft =
        questionTimers[currentQuestion] || 0

    const isLocked =
        lockedQuestions[currentQuestion] || false

    // -----------------------------------
    // PER QUESTION TIMER
    // -----------------------------------

    useEffect(() => {

        if (loading) return

        if (isLocked) return

        const timer = setInterval(() => {

            setQuestionTimers((prev) => {

                const current =
                    prev[currentQuestion]

                if (current <= 1) {

                    setLockedQuestions((old) => ({

                        ...old,

                        [currentQuestion]: true
                    }))

                    clearInterval(timer)

                    return {

                        ...prev,

                        [currentQuestion]: 0
                    }
                }

                return {

                    ...prev,

                    [currentQuestion]:
                        current - 1
                }
            })

        }, 1000)

        return () =>
            clearInterval(timer)

    }, [currentQuestion, isLocked])

    // -----------------------------------
    // FORMAT TIMER
    // -----------------------------------

    const formatTime = (seconds) => {

        const mins =
            Math.floor(seconds / 60)

        const secs =
            seconds % 60

        return `${mins}:${secs < 10
                ? "0"
                : ""
            }${secs}`
    }

    // -----------------------------------
    // AUTO SPEAK
    // -----------------------------------

    useEffect(() => {

        if (!cleanQuestion) return

        window.speechSynthesis.cancel()

        const utterance =
            new SpeechSynthesisUtterance(
                cleanQuestion
            )

        window.speechSynthesis.speak(
            utterance
        )

    }, [currentQuestion])

    // -----------------------------------
    // REPLAY QUESTION
    // -----------------------------------

    const replayQuestion = () => {

        window.speechSynthesis.cancel()

        const utterance =
            new SpeechSynthesisUtterance(
                cleanQuestion
            )

        window.speechSynthesis.speak(
            utterance
        )
    }

    // -----------------------------------
    // SAVE ANSWER
    // -----------------------------------

    const saveAnswer = async () => {

        try {

            await API.post(
                "/questions/save-answer",
                {

                    session_id,

                    question_index:
                        currentQuestion,

                    answer,
                }
            )

        } catch (error) {

            console.log(error)
        }
    }

    // -----------------------------------
    // NEXT QUESTION
    // -----------------------------------

    const nextQuestion = async () => {

        await saveAnswer()

        const updatedAnswers = {

            ...answers,

            [currentQuestion]: answer
        }

        setAnswers(updatedAnswers)

        if (
            currentQuestion <
            questions.length - 1
        ) {

            const nextIndex =
                currentQuestion + 1

            setCurrentQuestion(nextIndex)

            const nextAnswer =
                updatedAnswers[nextIndex]

            if (nextAnswer) {

                setAnswer(nextAnswer)

            } else {

                if (nextIndex < 2) {

                    setAnswer(
                        boilerplates[selectedLanguage]
                    )

                } else {

                    setAnswer("")
                }
            }
        }
    }

    // -----------------------------------
    // PREVIOUS QUESTION
    // -----------------------------------

    const previousQuestion =
        async () => {

            await saveAnswer()

            const updatedAnswers = {

                ...answers,

                [currentQuestion]: answer
            }

            setAnswers(updatedAnswers)

            if (currentQuestion > 0) {

                const prevIndex =
                    currentQuestion - 1

                setCurrentQuestion(prevIndex)

                const prevAnswer =
                    updatedAnswers[prevIndex]

                if (prevAnswer) {

                    setAnswer(prevAnswer)

                } else {

                    if (prevIndex < 2) {

                        setAnswer(
                            boilerplates[selectedLanguage]
                        )

                    } else {

                        setAnswer("")
                    }
                }
            }
        }

    // -----------------------------------
    // START RECORDING
    // -----------------------------------

    const startRecording =
        async () => {

            if (isLocked) return

            try {

                const stream =
                    await navigator
                        .mediaDevices
                        .getUserMedia({
                            audio: true
                        })

                const mediaRecorder =
                    new MediaRecorder(stream)

                mediaRecorderRef.current =
                    mediaRecorder

                audioChunksRef.current = []

                mediaRecorder.ondataavailable =
                    (event) => {

                        audioChunksRef.current.push(
                            event.data
                        )
                    }

                mediaRecorder.onstop =
                    async () => {

                        const audioBlob =
                            new Blob(
                                audioChunksRef.current,
                                {
                                    type: "audio/webm"
                                }
                            )

                        const formData =
                            new FormData()

                        formData.append(
                            "audio",
                            audioBlob,
                            "recording.webm"
                        )

                        try {

                            setTranscribing(true)

                            const response =
                                await API.post(
                                    "/voice/transcribe",
                                    formData,
                                    {

                                        headers: {

                                            "Content-Type":
                                                "multipart/form-data"
                                        }
                                    }
                                )

                            const transcript =
                                response.data.transcript || ""

                            if (
                                transcript.trim() !== ""
                            ) {

                                if (voiceMode === "replace") {

                                    setAnswer(
                                        transcript
                                    )

                                } else {

                                    setAnswer((prev) => {

                                        if (
                                            !prev ||
                                            prev.trim() === ""
                                        ) {

                                            return transcript
                                        }

                                        return (
                                            prev +
                                            " " +
                                            transcript
                                        )
                                    })
                                }
                            }

                        } catch (error) {

                            console.log(error)

                            alert(
                                "Voice transcription failed"
                            )
                        }

                        setTranscribing(false)
                    }

                mediaRecorder.start()

                setRecording(true)

            } catch (error) {

                console.log(error)
            }
        }

    // -----------------------------------
    // STOP RECORDING
    // -----------------------------------

    const stopRecording = () => {

        mediaRecorderRef.current?.stop()

        setRecording(false)
    }

    // -----------------------------------
    // SUBMIT INTERVIEW
    // -----------------------------------

    const submitInterview =
        async () => {

            await saveAnswer()

            try {

                setSubmitting(true)

                const response =
                    await API.post(
                        "/evaluation/submit",
                        {
                            session_id
                        }
                    )

                localStorage.setItem(
                    "evaluation",
                    JSON.stringify(
                        response.data
                    )
                )

                navigate("/results")

            } catch (error) {

                console.log(error)
            }

            setSubmitting(false)
        }

    // -----------------------------------
    // LOADING
    // -----------------------------------

    if (loading) {

        return (

            <div className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-black
                text-white
            ">

                Loading Interview...

            </div>
        )
    }

    return (

        <div className="
            relative
            min-h-screen
            overflow-hidden
            text-white
            px-6
            py-10
        ">

            <Background />

            <motion.div

                initial={{
                    opacity: 0,
                    y: 30
                }}

                animate={{
                    opacity: 1,
                    y: 0
                }}

                className="
                    relative
                    z-10
                    max-w-5xl
                    mx-auto
                "
            >

                {/* HEADER */}

                <div className="
                    flex
                    justify-between
                    items-center
                    mb-6
                ">

                    <div>

                        <h1 className="
                            text-5xl
                            font-black
                            bg-gradient-to-r
                            from-cyan-300
                            via-blue-400
                            to-purple-500
                            bg-clip-text
                            text-transparent
                        ">

                            AI Interview Session

                        </h1>

                    </div>

                    <div className="
                        flex
                        gap-4
                    ">

                        <div className="
                            px-5
                            py-3
                            rounded-2xl
                            bg-black/40
                            border
                            border-cyan-400/20
                            text-cyan-300
                            font-bold
                        ">

                            <div className="
                                flex
                                items-center
                                gap-2
                            ">

                                <Clock3 size={18} />

                                {formatTime(timeLeft)}

                            </div>

                        </div>

                        <div className="
                            px-5
                            py-3
                            rounded-2xl
                            bg-black/40
                            border
                            border-white/10
                        ">

                            Question {
                                currentQuestion + 1
                            } / {
                                questions.length
                            }

                        </div>

                    </div>

                </div>

                {/* PROGRESS */}

                <div className="
                    w-full
                    h-3
                    rounded-full
                    bg-white/10
                    overflow-hidden
                    mb-8
                ">

                    <div

                        style={{
                            width: `${(
                                (
                                    currentQuestion + 1
                                )
                                / questions.length
                            ) * 100}%`
                        }}

                        className="
                            h-full
                            bg-gradient-to-r
                            from-cyan-400
                            to-purple-500
                        "
                    />

                </div>

                {/* MAIN CARD */}

                <div className="
                    backdrop-blur-2xl
                    bg-white/[0.04]
                    border
                    border-white/10
                    rounded-[36px]
                    p-8
                ">

                    {/* LOCK MESSAGE */}

                    {
                        isLocked && (

                            <div className="
                                mb-6
                                p-4
                                rounded-2xl
                                bg-red-500/10
                                border
                                border-red-500/30
                                text-red-300
                                font-semibold
                            ">

                                Time is up for this question.
                                Answer editing has been locked.

                            </div>
                        )
                    }

                    {/* QUESTION TYPE */}

                    <div className="
                        flex
                        items-center
                        gap-3
                        mb-6
                    ">

                        {
                            isCodingQuestion ? (

                                <div className="
                                    flex
                                    items-center
                                    gap-2
                                    px-4
                                    py-2
                                    rounded-xl
                                    bg-cyan-500/10
                                    border
                                    border-cyan-400/20
                                    text-cyan-300
                                ">

                                    <Code2 size={18} />

                                    Coding Question

                                </div>

                            ) : (

                                <div className="
                                    flex
                                    items-center
                                    gap-2
                                    px-4
                                    py-2
                                    rounded-xl
                                    bg-pink-500/10
                                    border
                                    border-pink-400/20
                                    text-pink-300
                                ">

                                    <Mic size={18} />

                                    Voice Question

                                </div>
                            )
                        }

                    </div>

                    {/* QUESTION */}

                    <h2 className="
                        text-3xl
                        font-bold
                        leading-relaxed
                        mb-8
                    ">

                        {currentQuestion + 1}. {cleanQuestion}

                    </h2>

                    {/* REPLAY */}

                    <button

                        onClick={replayQuestion}

                        className="
                            flex
                            items-center
                            gap-2
                            px-4
                            py-2
                            rounded-xl
                            bg-cyan-500/10
                            border
                            border-cyan-400/20
                            text-cyan-300
                            mb-6
                        "
                    >

                        <Volume2 size={18} />

                        Replay Question

                    </button>

                    {
                        isCodingQuestion ? (

                            <div>

                                {/* LANGUAGE */}

                                <div className="
                                    flex
                                    justify-between
                                    items-center
                                    mb-5
                                ">

                                    <div className="
                                        text-cyan-300
                                        font-semibold
                                    ">

                                        Select Coding Language

                                    </div>

                                    <select

                                        value={
                                            selectedLanguage
                                        }

                                        onChange={(e) => {

                                            const lang =
                                                e.target.value

                                            setSelectedLanguage(
                                                lang
                                            )

                                            setAnswer(
                                                boilerplates[lang]
                                            )
                                        }}

                                        disabled={isLocked}

                                        className="
                                            bg-black/40
                                            border
                                            border-cyan-400/20
                                            text-white
                                            px-4
                                            py-2
                                            rounded-xl
                                            outline-none
                                        "
                                    >

                                        <option value="python">
                                            Python
                                        </option>

                                        <option value="javascript">
                                            JavaScript
                                        </option>

                                        <option value="cpp">
                                            C++
                                        </option>

                                        <option value="java">
                                            Java
                                        </option>

                                    </select>

                                </div>

                                {/* EDITOR */}

                                <Editor

                                    height="420px"

                                    language={
                                        selectedLanguage
                                    }

                                    theme="vs-dark"

                                    value={answer}

                                    onChange={(value) =>
                                        setAnswer(value || "")
                                    }

                                    options={{
                                        readOnly: isLocked
                                    }}
                                />

                            </div>

                        ) : (

                            <div>

                                {/* VOICE MODE */}

                                <div className="
                                    flex
                                    gap-3
                                    mb-5
                                ">

                                    <button

                                        onClick={() =>
                                            setVoiceMode("replace")
                                        }

                                        className={`
                                            px-4
                                            py-2
                                            rounded-xl
                                            font-semibold

                                            ${voiceMode === "replace"

                                                ? `
                                                    bg-gradient-to-r
                                                    from-pink-500
                                                    to-red-500
                                                    text-white
                                                  `

                                                : `
                                                    bg-black/40
                                                    border
                                                    border-pink-500/30
                                                    text-gray-300
                                                  `
                                            }
                                        `}
                                    >

                                        🔄 Replace

                                    </button>

                                    <button

                                        onClick={() =>
                                            setVoiceMode("extend")
                                        }

                                        className={`
                                            px-4
                                            py-2
                                            rounded-xl
                                            font-semibold

                                            ${voiceMode === "extend"

                                                ? `
                                                    bg-gradient-to-r
                                                    from-cyan-400
                                                    to-purple-500
                                                    text-white
                                                  `

                                                : `
                                                    bg-black/40
                                                    border
                                                    border-cyan-400/30
                                                    text-gray-300
                                                  `
                                            }
                                        `}
                                    >

                                        ➕ Extend

                                    </button>

                                </div>

                                {/* RECORD */}

                                <div className="
                                    flex
                                    gap-4
                                    mb-6
                                ">

                                    {
                                        !recording ? (

                                            <button

                                                onClick={
                                                    startRecording
                                                }

                                                disabled={isLocked}

                                                className={`
                                                    flex
                                                    items-center
                                                    gap-2
                                                    px-6
                                                    py-3
                                                    rounded-2xl
                                                    bg-gradient-to-r
                                                    from-pink-500
                                                    to-red-500

                                                    ${isLocked
                                                        ? `
                                                                opacity-50
                                                                cursor-not-allowed
                                                              `
                                                        : ""
                                                    }
                                                `}
                                            >

                                                <Mic size={20} />

                                                Start Recording

                                            </button>

                                        ) : (

                                            <button

                                                onClick={
                                                    stopRecording
                                                }

                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    px-6
                                                    py-3
                                                    rounded-2xl
                                                    bg-red-600
                                                "
                                            >

                                                <Square size={20} />

                                                Stop Recording

                                            </button>
                                        )
                                    }

                                    {
                                        transcribing && (

                                            <div className="
                                                flex
                                                items-center
                                                text-cyan-300
                                            ">

                                                Transcribing...

                                            </div>
                                        )
                                    }

                                </div>

                                {/* TEXTAREA */}

                                <textarea

                                    value={answer}

                                    onChange={(e) =>
                                        setAnswer(
                                            e.target.value
                                        )
                                    }

                                    disabled={isLocked}

                                    placeholder="Speak or type your answer here..."

                                    className="
                                        w-full
                                        h-72
                                        p-6
                                        rounded-3xl
                                        bg-black/40
                                        border
                                        border-white/10
                                        outline-none
                                        resize-none
                                    "
                                />

                            </div>
                        )
                    }

                    {/* NAVIGATION */}

                    <div className="
                        flex
                        justify-between
                        items-center
                        mt-10
                    ">

                        <button

                            onClick={
                                previousQuestion
                            }

                            disabled={
                                currentQuestion === 0
                            }

                            className="
                                flex
                                items-center
                                gap-2
                                px-6
                                py-3
                                rounded-2xl
                                bg-black/40
                                border
                                border-white/10
                            "
                        >

                            <ChevronLeft size={20} />

                            Previous

                        </button>

                        {
                            currentQuestion ===
                                questions.length - 1 ? (

                                <button

                                    onClick={
                                        submitInterview
                                    }

                                    className="
                                        px-8
                                        py-3
                                        rounded-2xl
                                        font-bold
                                        bg-gradient-to-r
                                        from-cyan-400
                                        to-purple-500
                                    "
                                >

                                    {
                                        submitting
                                            ? "Evaluating..."
                                            : "Submit Interview"
                                    }

                                </button>

                            ) : (

                                <button

                                    onClick={
                                        nextQuestion
                                    }

                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        px-6
                                        py-3
                                        rounded-2xl
                                        font-bold
                                        bg-gradient-to-r
                                        from-cyan-400
                                        to-purple-500
                                    "
                                >

                                    Next

                                    <ChevronRight size={20} />

                                </button>
                            )
                        }

                    </div>

                </div>

            </motion.div>

        </div>
    )
}

export default Interview