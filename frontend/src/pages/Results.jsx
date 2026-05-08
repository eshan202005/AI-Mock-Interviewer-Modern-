import { useEffect, useState } from "react"
import { motion } from "framer-motion"

import {
    Trophy,
    Brain,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Sparkles,
} from "lucide-react"

import Background from "../components/Background"

function Results() {

    const [evaluation, setEvaluation] =
        useState(null)

    useEffect(() => {

        const storedEvaluation =
            JSON.parse(
                localStorage.getItem("evaluation")
            )

        console.log(storedEvaluation)

        setEvaluation(storedEvaluation)

    }, [])

    if (!evaluation) {

        return (

            <div className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-black
                text-white
            ">

                Loading Results...

            </div>
        )
    }

    const score =
        evaluation.score || 0

    const summary =
        evaluation.summary || ""

    const strengths =
        evaluation.strengths || []

    const weaknesses =
        evaluation.weaknesses || []

    const feedback =
        evaluation.feedback || []

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

                transition={{
                    duration: 0.8
                }}

                className="
                    relative
                    z-10
                    max-w-7xl
                    mx-auto
                "
            >

                {/* Header */}

                <div className="mb-10">

                    <h1 className="
                        text-5xl
                        font-black
                        bg-gradient-to-r
                        from-cyan-300
                        via-blue-400
                        to-purple-500
                        bg-clip-text
                        text-transparent
                        mb-4
                    ">

                        AI Interview Results

                    </h1>

                    <p className="
                        text-gray-400
                        text-lg
                    ">

                        AI-powered interview performance analysis

                    </p>

                </div>

                {/* Score */}

                <div className="
                    backdrop-blur-2xl
                    bg-white/[0.04]
                    border
                    border-white/10
                    rounded-[36px]
                    p-8
                    mb-8
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                        mb-6
                    ">

                        <Trophy
                            className="
                                text-yellow-300
                            "
                        />

                        <h2 className="
                            text-3xl
                            font-bold
                        ">

                            Final Score

                        </h2>

                    </div>

                    <div className="
                        text-7xl
                        font-black
                        text-cyan-300
                    ">

                        {score}

                        <span className="
                            text-3xl
                            text-gray-400
                        ">

                            /100

                        </span>

                    </div>

                </div>

                {/* Summary */}

                <div className="
                    backdrop-blur-2xl
                    bg-white/[0.04]
                    border
                    border-white/10
                    rounded-[36px]
                    p-8
                    mb-8
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                        mb-4
                    ">

                        <Brain
                            className="
                                text-purple-300
                            "
                        />

                        <h2 className="
                            text-2xl
                            font-bold
                        ">

                            AI Summary

                        </h2>

                    </div>

                    <p className="
                        text-gray-300
                        leading-relaxed
                        text-lg
                    ">

                        {summary}

                    </p>

                </div>

                {/* Strengths */}

                <div className="
                    grid
                    grid-cols-1
                    lg:grid-cols-2
                    gap-6
                    mb-8
                ">

                    <div className="
                        backdrop-blur-2xl
                        bg-white/[0.04]
                        border
                        border-white/10
                        rounded-[36px]
                        p-8
                    ">

                        <div className="
                            flex
                            items-center
                            gap-3
                            mb-6
                        ">

                            <CheckCircle2
                                className="
                                    text-green-400
                                "
                            />

                            <h2 className="
                                text-2xl
                                font-bold
                            ">

                                Strengths

                            </h2>

                        </div>

                        <div className="
                            space-y-4
                        ">

                            {
                                strengths.map((item, index) => (

                                    <div

                                        key={index}

                                        className="
                                            p-4
                                            rounded-2xl
                                            bg-green-500/10
                                            border
                                            border-green-400/20
                                        "
                                    >

                                        {item}

                                    </div>
                                ))
                            }

                        </div>

                    </div>

                    {/* Weaknesses */}

                    <div className="
                        backdrop-blur-2xl
                        bg-white/[0.04]
                        border
                        border-white/10
                        rounded-[36px]
                        p-8
                    ">

                        <div className="
                            flex
                            items-center
                            gap-3
                            mb-6
                        ">

                            <AlertTriangle
                                className="
                                    text-red-400
                                "
                            />

                            <h2 className="
                                text-2xl
                                font-bold
                            ">

                                Weaknesses

                            </h2>

                        </div>

                        <div className="
                            space-y-4
                        ">

                            {
                                weaknesses.map((item, index) => (

                                    <div

                                        key={index}

                                        className="
                                            p-4
                                            rounded-2xl
                                            bg-red-500/10
                                            border
                                            border-red-400/20
                                        "
                                    >

                                        {item}

                                    </div>
                                ))
                            }

                        </div>

                    </div>

                </div>

                {/* Question Analysis */}

                <div className="
                    backdrop-blur-2xl
                    bg-white/[0.04]
                    border
                    border-white/10
                    rounded-[36px]
                    p-8
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                        mb-8
                    ">

                        <Sparkles
                            className="
                                text-cyan-300
                            "
                        />

                        <h2 className="
                            text-2xl
                            font-bold
                        ">

                            Complete Interview Analysis

                        </h2>

                    </div>

                    <div className="
                        space-y-8
                    ">

                        {
                            feedback.map((item, index) => {

                                const noAnswer =
                                    item.answer ===
                                    "No answer provided"

                                return (

                                    <div

                                        key={index}

                                        className="
                                            p-6
                                            rounded-3xl
                                            bg-black/30
                                            border
                                            border-white/10
                                        "
                                    >

                                        <div className="
                                            flex
                                            justify-between
                                            items-center
                                            mb-6
                                        ">

                                            <h3 className="
                                                text-2xl
                                                font-bold
                                                text-cyan-300
                                            ">

                                                Question {index + 1}

                                            </h3>

                                            <div className="
                                                px-4
                                                py-2
                                                rounded-xl
                                                bg-cyan-500/10
                                                border
                                                border-cyan-400/20
                                                text-cyan-300
                                                font-semibold
                                            ">

                                                {
                                                    noAnswer
                                                        ? "Not Answered"
                                                        : `${item.score}/10`
                                                }

                                            </div>

                                        </div>

                                        {/* Question */}

                                        <div className="
                                            mb-5
                                        ">

                                            <div className="
                                                text-gray-400
                                                mb-2
                                            ">

                                                Question

                                            </div>

                                            <div className="
                                                text-gray-200
                                            ">

                                                {item.question}

                                            </div>

                                        </div>

                                        {/* Answer */}

                                        <div className="
                                            mb-5
                                        ">

                                            <div className="
                                                text-gray-400
                                                mb-2
                                            ">

                                                Your Answer

                                            </div>

                                            <div className={`
                                                p-4
                                                rounded-2xl
                                                border
                                                whitespace-pre-wrap

                                                ${noAnswer

                                                    ? "bg-red-500/5 border-red-400/10 text-red-300"

                                                    : "bg-black/40 border-white/10 text-gray-200"
                                                }
                                            `}>

                                                {
                                                    noAnswer

                                                        ? "No answer submitted."

                                                        : item.answer
                                                }

                                            </div>

                                        </div>

                                        {/* Evaluation */}

                                        <div>

                                            <div className="
                                                text-gray-400
                                                mb-2
                                            ">

                                                AI Evaluation

                                            </div>

                                            <div className="
                                                p-4
                                                rounded-2xl
                                                bg-cyan-500/5
                                                border
                                                border-cyan-400/10
                                                text-gray-300
                                                whitespace-pre-wrap
                                            ">

                                                {item.feedback}

                                            </div>

                                        </div>

                                    </div>
                                )
                            })
                        }

                    </div>

                </div>

            </motion.div>

        </div>
    )
}

export default Results