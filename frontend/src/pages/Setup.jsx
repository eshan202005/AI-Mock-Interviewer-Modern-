import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

import {
    Upload,
    User,
    Briefcase,
    FileText,
    Sparkles,
} from "lucide-react"

import API from "../services/api"
import Background from "../components/Background"

function Setup() {

    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [role, setRole] = useState("")
    const [resume, setResume] = useState(null)

    const [loading, setLoading] =
        useState(false)

    // Parsed Resume Data

    const [skills, setSkills] =
        useState([])

    const [projects, setProjects] =
        useState([])

    const [experience, setExperience] =
        useState([])

    const [resumeProcessed,
        setResumeProcessed] =
        useState(false)

    // -----------------------------
    // Process Resume
    // -----------------------------

    const handleResumeProcessing =
        async () => {

            if (!name || !role || !resume) {

                alert(
                    "Please fill all fields"
                )

                return
            }

            try {

                setLoading(true)

                const formData =
                    new FormData()

                formData.append(
                    "file",
                    resume
                )

                const response =
                    await API.post(
                        "/resume/upload",
                        formData,
                        {
                            headers: {
                                "Content-Type":
                                    "multipart/form-data",
                            },
                        }
                    )

                // Save Parsed Data

                setSkills(
                    response.data.skills
                )

                setProjects(
                    response.data.projects
                )

                setExperience(
                    response.data.experience
                )

                setResumeProcessed(true)

            } catch (error) {

                console.log(error)

                alert(
                    "Resume processing failed"
                )

            } finally {

                setLoading(false)
            }
        }

    // -----------------------------
    // Start Interview
    // -----------------------------

    const startInterview =
        async () => {

            try {

                setLoading(true)

                const questionResponse =
                    await API.post(
                        "/questions/generate",
                        {
                            role,
                            skills,
                            projects,
                            experience,
                        }
                    )

                // Save Session

                localStorage.setItem(
                    "session_id",
                    questionResponse
                        .data
                        .session_id
                )

                localStorage.setItem(
                    "questions",
                    JSON.stringify(
                        questionResponse
                            .data
                            .questions
                    )
                )

                localStorage.setItem(
                    "candidate_name",
                    name
                )

                localStorage.setItem(
                    "role",
                    role
                )

                navigate("/interview")

            } catch (error) {

                console.log(error)

                alert(
                    "Failed to generate questions"
                )

            } finally {

                setLoading(false)
            }
        }

    return (

        <div className="
            relative
            min-h-screen
            overflow-hidden
            text-white
            px-6
            py-12
        ">

            <Background />

            {/* Main Content */}

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
                    duration: 0.8
                }}

                className="
                    relative
                    z-10
                    max-w-4xl
                    mx-auto
                    backdrop-blur-2xl
                    bg-white/[0.04]
                    border
                    border-white/10
                    rounded-[36px]
                    p-10
                    shadow-[0_0_80px_rgba(0,0,0,0.7)]
                "
            >

                {/* Heading */}

                <div className="
                    text-center
                    mb-10
                ">

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
                        Interview Setup
                    </h1>

                    <p className="
                        text-gray-400
                        mt-4
                        text-lg
                    ">
                        Configure your AI-powered
                        interview experience
                    </p>

                </div>

                {/* Name */}

                <div className="mb-7">

                    <label className="
                        flex
                        items-center
                        gap-2
                        mb-3
                        text-gray-300
                    ">

                        <User size={18} />

                        Full Name

                    </label>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                            setName(
                                e.target.value
                            )
                        }
                        placeholder="
Enter your full name
                        "
                        className="
                            w-full
                            p-4
                            rounded-2xl
                            bg-black/40
                            border
                            border-white/10
                            outline-none
                            focus:border-cyan-400
                        "
                    />

                </div>

                {/* Role */}

                <div className="mb-7">

                    <label className="
                        flex
                        items-center
                        gap-2
                        mb-3
                        text-gray-300
                    ">

                        <Briefcase size={18} />

                        Interview Role

                    </label>

                    <select
                        value={role}
                        onChange={(e) =>
                            setRole(
                                e.target.value
                            )
                        }
                        className="
                            w-full
                            p-4
                            rounded-2xl
                            bg-black/40
                            border
                            border-white/10
                            outline-none
                            focus:border-cyan-400
                            text-white
                        "
                    >

                        <option
                            value=""
                            className="bg-black"
                        >
                            Select Interview Role
                        </option>

                        <option
                            value="Frontend Developer"
                            className="bg-black"
                        >
                            Frontend Developer
                        </option>

                        <option
                            value="Backend Developer"
                            className="bg-black"
                        >
                            Backend Developer
                        </option>

                        <option
                            value="Full Stack Developer"
                            className="bg-black"
                        >
                            Full Stack Developer
                        </option>

                        <option
                            value="Software Engineer"
                            className="bg-black"
                        >
                            Software Engineer
                        </option>

                        <option
                            value="Python Developer"
                            className="bg-black"
                        >
                            Python Developer
                        </option>

                        <option
                            value="Data Scientist"
                            className="bg-black"
                        >
                            Data Scientist
                        </option>

                    </select>

                    <p className="
                        text-sm
                        text-gray-400
                        mt-3
                    ">

                        Selected role will be used
                        by the AI to generate
                        personalized coding,
                        technical, project, and
                        HR interview questions.

                    </p>

                </div>

                {/* Resume Upload */}

                <div className="mb-10">

                    <label className="
                        flex
                        items-center
                        gap-2
                        mb-3
                        text-gray-300
                    ">

                        <FileText size={18} />

                        Upload Resume

                    </label>

                    <div className="
                        border
                        border-dashed
                        border-white/10
                        rounded-2xl
                        p-6
                        bg-black/30
                    ">

                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) =>
                                setResume(
                                    e.target.files[0]
                                )
                            }
                            className="
                                w-full
                                cursor-pointer
                            "
                        />

                        <p className="
                            text-sm
                            text-gray-400
                            mt-4
                        ">

                            Upload your PDF resume
                            for AI-powered interview
                            generation.

                        </p>

                    </div>

                </div>

                {/* Process Resume */}

                {
                    !resumeProcessed && (

                        <button

                            onClick={
                                handleResumeProcessing
                            }

                            disabled={loading}

                            className="
                                w-full
                                py-4
                                rounded-2xl
                                font-bold
                                text-lg
                                flex
                                items-center
                                justify-center
                                gap-3
                                bg-gradient-to-r
                                from-cyan-400
                                via-blue-500
                                to-purple-500
                                hover:scale-[1.02]
                                transition-all
                                duration-300
                                shadow-[0_0_30px_rgba(34,211,238,0.4)]
                            "
                        >

                            <Upload size={20} />

                            {
                                loading
                                    ? "Processing Resume..."
                                    : "Process Resume"
                            }

                        </button>
                    )
                }

                {/* Parsed Resume Data */}

                {
                    resumeProcessed && (

                        <div className="mt-10">

                            {/* Resume Analysis */}

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
                                    text-3xl
                                    font-bold
                                ">
                                    Resume Analysis
                                </h2>

                            </div>

                            {/* Skills */}

                            <div className="mb-8">

                                <h3 className="
                                    text-xl
                                    font-semibold
                                    mb-4
                                    text-cyan-300
                                ">
                                    Detected Skills
                                </h3>

                                <div className="
                                    flex
                                    flex-wrap
                                    gap-3
                                ">

                                    {
                                        skills.map(
                                            (
                                                skill,
                                                index
                                            ) => (

                                                <div
                                                    key={index}
                                                    className="
                                                        px-4
                                                        py-2
                                                        rounded-full
                                                        bg-cyan-500/10
                                                        border
                                                        border-cyan-400/20
                                                        text-cyan-200
                                                    "
                                                >

                                                    {skill}

                                                </div>
                                            )
                                        )
                                    }

                                </div>

                            </div>

                            {/* Projects */}

                            <div className="mb-8">

                                <h3 className="
                                    text-xl
                                    font-semibold
                                    mb-4
                                    text-blue-300
                                ">
                                    Detected Projects
                                </h3>

                                <div className="
                                    space-y-3
                                ">

                                    {
                                        projects.map(
                                            (
                                                project,
                                                index
                                            ) => (

                                                <div
                                                    key={index}
                                                    className="
                                                        p-4
                                                        rounded-2xl
                                                        bg-blue-500/10
                                                        border
                                                        border-blue-400/20
                                                    "
                                                >

                                                    {project}

                                                </div>
                                            )
                                        )
                                    }

                                </div>

                            </div>

                            {/* Experience */}

                            <div className="mb-10">

                                <h3 className="
                                    text-xl
                                    font-semibold
                                    mb-4
                                    text-purple-300
                                ">
                                    Detected Experience
                                </h3>

                                <div className="
                                    space-y-3
                                ">

                                    {
                                        experience
                                            .length > 0

                                            ? (

                                                experience.map(
                                                    (
                                                        exp,
                                                        index
                                                    ) => (

                                                        <div
                                                            key={index}
                                                            className="
                                                                p-4
                                                                rounded-2xl
                                                                bg-purple-500/10
                                                                border
                                                                border-purple-400/20
                                                            "
                                                        >

                                                            {exp}

                                                        </div>
                                                    )
                                                )
                                            )

                                            : (

                                                <div className="
                                                    text-gray-400
                                                ">
                                                    No experience
                                                    detected
                                                </div>
                                            )
                                    }

                                </div>

                            </div>

                            {/* Start Interview */}

                            <button

                                onClick={
                                    startInterview
                                }

                                disabled={loading}

                                className="
                                    w-full
                                    py-4
                                    rounded-2xl
                                    font-bold
                                    text-lg
                                    bg-gradient-to-r
                                    from-green-400
                                    via-cyan-500
                                    to-blue-500
                                    hover:scale-[1.02]
                                    transition-all
                                    duration-300
                                    shadow-[0_0_30px_rgba(34,211,238,0.4)]
                                "
                            >

                                {
                                    loading
                                        ? "Generating Questions..."
                                        : "Start Interview"
                                }

                            </button>

                        </div>
                    )
                }

            </motion.div>

        </div>
    )
}

export default Setup