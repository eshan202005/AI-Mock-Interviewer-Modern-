import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

import {
    BrainCircuit,
    Mic,
    Code2,
    Sparkles,
    ArrowRight,
} from "lucide-react"

import Background from "../components/Background"

function Landing() {

    const navigate = useNavigate()

    return (

        <div className="
            relative
            min-h-screen
            overflow-hidden
            text-white
        ">

            <Background />

            <div className="
                relative
                z-10
                min-h-screen
                flex
                items-center
                justify-center
                px-6
                py-12
            ">

                <motion.div

                    initial={{
                        opacity: 0,
                        y: 40
                    }}

                    animate={{
                        opacity: 1,
                        y: 0
                    }}

                    transition={{
                        duration: 1
                    }}

                    className="
                        w-full
                        max-w-6xl
                        backdrop-blur-2xl
                        bg-white/[0.04]
                        border
                        border-white/10
                        rounded-[40px]
                        p-8
                        md:p-14
                        shadow-[0_0_80px_rgba(0,0,0,0.7)]
                    "
                >

                    {/* Badge */}

                    <div className="
                        inline-flex
                        items-center
                        gap-3
                        px-5
                        py-2
                        rounded-full
                        border
                        border-cyan-400/20
                        bg-cyan-400/10
                        text-cyan-300
                        text-sm
                        tracking-widest
                        uppercase
                        mb-10
                    ">

                        <Sparkles size={16} />

                        Next Generation AI Interview Platform

                    </div>

                    {/* Main Section */}

                    <div className="
                        grid
                        md:grid-cols-2
                        gap-14
                        items-center
                    ">

                        {/* Left */}

                        <div>

                            <h1 className="
                                text-5xl
                                md:text-7xl
                                font-black
                                leading-tight
                                tracking-tight
                            ">

                                <span className="text-white">
                                    AI Mock
                                </span>

                                <br />

                                <span className="
                                    bg-gradient-to-r
                                    from-cyan-300
                                    via-blue-400
                                    to-purple-500
                                    bg-clip-text
                                    text-transparent
                                ">
                                    Interviewer
                                </span>

                            </h1>

                            <p className="
                                mt-8
                                text-gray-300
                                text-lg
                                md:text-xl
                                leading-relaxed
                            ">

                                Practice coding interviews,
                                technical rounds, and voice
                                interviews with AI-powered
                                evaluation and personalized
                                feedback.

                            </p>

                            {/* Buttons */}

                            <div className="
                                flex
                                flex-wrap
                                gap-5
                                mt-10
                            ">

                                <button

                                    onClick={() =>
                                        navigate("/setup")
                                    }

                                    className="
                                        group
                                        flex
                                        items-center
                                        gap-3
                                        px-8
                                        py-4
                                        rounded-2xl
                                        font-bold
                                        text-lg
                                        bg-gradient-to-r
                                        from-cyan-400
                                        via-blue-500
                                        to-purple-500
                                        hover:scale-105
                                        transition-all
                                        duration-300
                                        shadow-[0_0_35px_rgba(34,211,238,0.4)]
                                    "
                                >

                                    Start Interview

                                    <ArrowRight
                                        size={22}
                                        className="
                                            transition-transform
                                            duration-300
                                            group-hover:translate-x-1
                                        "
                                    />

                                </button>

                            </div>

                        </div>

                        {/* Right Side */}

                        <div className="
                            grid
                            gap-6
                        ">

                            {/* Card 1 */}

                            <div className="
                                p-6
                                rounded-3xl
                                bg-white/[0.04]
                                border
                                border-white/10
                                backdrop-blur-xl
                            ">

                                <div className="
                                    w-14
                                    h-14
                                    rounded-2xl
                                    bg-cyan-400/10
                                    flex
                                    items-center
                                    justify-center
                                    mb-5
                                ">

                                    <Code2
                                        className="
                                            text-cyan-300
                                        "
                                    />

                                </div>

                                <h3 className="
                                    text-2xl
                                    font-bold
                                    mb-3
                                ">
                                    Coding Interviews
                                </h3>

                                <p className="
                                    text-gray-400
                                    leading-relaxed
                                ">
                                    Solve DSA and coding
                                    questions in a real
                                    interview environment.
                                </p>

                            </div>

                            {/* Card 2 */}

                            <div className="
                                p-6
                                rounded-3xl
                                bg-white/[0.04]
                                border
                                border-white/10
                                backdrop-blur-xl
                            ">

                                <div className="
                                    w-14
                                    h-14
                                    rounded-2xl
                                    bg-purple-400/10
                                    flex
                                    items-center
                                    justify-center
                                    mb-5
                                ">

                                    <Mic
                                        className="
                                            text-purple-300
                                        "
                                    />

                                </div>

                                <h3 className="
                                    text-2xl
                                    font-bold
                                    mb-3
                                ">
                                    Voice AI Interviews
                                </h3>

                                <p className="
                                    text-gray-400
                                    leading-relaxed
                                ">
                                    Practice speaking rounds
                                    with speech-to-text AI
                                    interaction.
                                </p>

                            </div>

                            {/* Card 3 */}

                            <div className="
                                p-6
                                rounded-3xl
                                bg-white/[0.04]
                                border
                                border-white/10
                                backdrop-blur-xl
                            ">

                                <div className="
                                    w-14
                                    h-14
                                    rounded-2xl
                                    bg-blue-400/10
                                    flex
                                    items-center
                                    justify-center
                                    mb-5
                                ">

                                    <BrainCircuit
                                        className="
                                            text-blue-300
                                        "
                                    />

                                </div>

                                <h3 className="
                                    text-2xl
                                    font-bold
                                    mb-3
                                ">
                                    AI Evaluation
                                </h3>

                                <p className="
                                    text-gray-400
                                    leading-relaxed
                                ">
                                    Get intelligent interview
                                    feedback, strengths,
                                    weaknesses, and analysis.
                                </p>

                            </div>

                        </div>

                    </div>

                </motion.div>

            </div>

        </div>
    )
}

export default Landing