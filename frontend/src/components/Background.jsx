import bgVideo from "../assets/bg.mp4"

function Background() {

    return (

        <>

            {/* Video */}

            <video
                autoPlay
                muted
                loop
                playsInline
                className="
                    fixed
                    inset-0
                    w-full
                    h-full
                    object-cover
                    opacity-35
                    scale-110
                    -z-20
                "
            >

                <source
                    src={bgVideo}
                    type="video/mp4"
                />

            </video>

            {/* Dark Overlay */}

            <div className="
                fixed
                inset-0
                bg-black/70
                -z-10
            " />

            {/* Grid Overlay */}

            <div className="
                fixed
                inset-0
                opacity-[0.06]
                bg-[linear-gradient(to_right,#ffffff22_1px,transparent_1px),linear-gradient(to_bottom,#ffffff22_1px,transparent_1px)]
                bg-[size:80px_80px]
                -z-10
            " />

            {/* Glow Top */}

            <div className="
                fixed
                top-0
                left-0
                w-[500px]
                h-[500px]
                bg-cyan-500/10
                blur-[120px]
                rounded-full
                -z-10
            " />

            {/* Glow Bottom */}

            <div className="
                fixed
                bottom-0
                right-0
                w-[500px]
                h-[500px]
                bg-purple-500/10
                blur-[120px]
                rounded-full
                -z-10
            " />

        </>
    )
}

export default Background