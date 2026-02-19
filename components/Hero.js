import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { urlFor } from "@/sanity/lib/image";

const SLIDE_DURATION = 8000;

const textLineVariants = {
    hidden: { clipPath: "inset(0 100% 0 0)" },
    visible: { clipPath: "inset(0 0% 0 0)" },
};

const logoVariants = {
    hidden: { opacity: 0, transition: { duration: 0.2 } },
    visible: { opacity: 1, transition: { duration: 0.3, delay: 0.35 } },
};

export default function Hero({ projects }) {
    const router = useRouter();
    const [current, setCurrent] = useState(0);
    const [hoverZone, setHoverZone] = useState(null);
    const sectionRef = useRef(null);
    const touchStartX = useRef(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"],
    });
    const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

    const total = projects.length;

    const goTo = useCallback(
        (index) => {
            setCurrent(((index % total) + total) % total);
        },
        [total],
    );

    const next = useCallback(() => goTo(current + 1), [current, goTo]);
    const prev = useCallback(() => goTo(current - 1), [current, goTo]);

    useEffect(() => {
        const timer = setTimeout(() => goTo(current + 1), SLIDE_DURATION);
        return () => clearTimeout(timer);
    }, [current, goTo]);

    if (!projects || total === 0) return null;

    const project = projects[current];
    const year = new Date(project.releaseDate).getFullYear();
    const coverUrl = urlFor(project.coverPhoto).width(1920).quality(85).url();
    const mobileCoverUrl = project.mobileCoverPhoto
        ? urlFor(project.mobileCoverPhoto).width(750).quality(85).url()
        : coverUrl;
    const hotspot = project.coverPhoto?.hotspot;
    const coverBgPosition = hotspot
        ? `${hotspot.x * 100}% ${hotspot.y * 100}%`
        : "center";

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
            diff > 0 ? next() : prev();
        }
        touchStartX.current = null;
    };

    const handleClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const pct = x / rect.width;
        if (pct <= 0.1) prev();
        else if (pct >= 0.9) next();
        else router.push(`/projects/${project.slug?.current}`);
    };

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const pct = x / rect.width;
        if (pct <= 0.1) setHoverZone("prev");
        else if (pct >= 0.9) setHoverZone("next");
        else setHoverZone(null);
    };

    return (
        <section
            ref={sectionRef}
            className="relative w-full h-screen overflow-hidden cursor-default select-none"
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverZone(null)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Crossfade image — desktop */}
            <AnimatePresence>
                <motion.div
                    key={current}
                    className="absolute inset-0 bg-cover scale-110 hidden md:block"
                    style={{ backgroundImage: `url(${coverUrl})`, backgroundPosition: coverBgPosition, y: parallaxY }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                />
            </AnimatePresence>
            {/* Crossfade image — mobile (portrait crop) */}
            <AnimatePresence>
                <motion.div
                    key={current}
                    className="absolute inset-0 bg-cover bg-center scale-110 md:hidden"
                    style={{ backgroundImage: `url(${mobileCoverUrl})`, y: parallaxY }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                />
            </AnimatePresence>

            {/* Nav hover overlays */}
            <div
                className={`absolute top-0 bottom-0 w-[20%] z-10 items-center cursor-pointer transition-opacity duration-200 left-0 justify-center hidden md:flex ${hoverZone === "prev" ? "opacity-100" : "opacity-0"}`}
                style={{
                    background:
                        "linear-gradient(to right, rgba(255, 104, 220, 0.8), transparent)",
                }}
            >
                <span className="font-prov text-[24px] text-white uppercase">
                    Prev
                </span>
            </div>
            <div
                className={`absolute top-0 bottom-0 w-[20%] z-10 items-center cursor-pointer transition-opacity duration-200 right-0 justify-center hidden md:flex ${hoverZone === "next" ? "opacity-100" : "opacity-0"}`}
                style={{
                    background:
                        "linear-gradient(to left, rgba(255, 104, 220, 0.8), transparent)",
                }}
            >
                <span className="font-prov text-[24px] text-white uppercase">
                    Next
                </span>
            </div>

            {/* Overlay Container */}
            <div className="overlay-container w-full h-full z-10 flex justify-between flex-col px-4 py-8 md:p-10">
                {/* Slide counter */}
                <span className="relative font-prov text-md text-white uppercase z-[5]">
                    {current + 1}/{total}
                </span>

                {/* Bottom info */}
                <div className="relative z-[5]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            className="flex flex-col gap-[2px]"
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={{
                                hidden: {
                                    transition: {
                                        staggerChildren: 0.06,
                                        staggerDirection: -1,
                                    },
                                },
                                visible: {
                                    transition: {
                                        staggerChildren: 0.1,
                                        delayChildren: 0.1,
                                    },
                                },
                            }}
                        >
                            <Link
                                href={`/projects/${project.slug?.current}`}
                                className="no-underline"
                                onClick={(e) => e.stopPropagation()}
                            >
                            <motion.div
                                className="flex items-baseline gap-[8px] bg-black leading-none w-fit"
                                variants={textLineVariants}
                                transition={{
                                    duration: 0.45,
                                    ease: [0.76, 0, 0.24, 1],
                                }}
                            >
                                <span className="font-cool text-4xl md:text-7xl lg:text-8xl leading-[0.67] text-white uppercase">
                                    {project.artist}
                                </span>
                            </motion.div>
                            <motion.div
                                className="flex items-start gap-[8px] bg-black leading-none w-fit"
                                variants={textLineVariants}
                                transition={{
                                    duration: 0.45,
                                    ease: [0.76, 0, 0.24, 1],
                                }}
                            >
                                <span className="font-cool text-5xl md:text-7xl lg:text-8xl leading-[0.67] text-white uppercase w-fit">
                                    &ldquo;{project.title}&rdquo;
                                </span>
                                <span className="font-prov text-sm md:text-lg text-white">
                                    [{year}]
                                </span>
                            </motion.div>
                            </Link>
                            {project.networks &&
                                project.networks.length > 0 && (
                                    <motion.div
                                        className="flex gap-[12px] mb-[12px] order-first"
                                        variants={logoVariants}
                                    >
                                        {project.networks.map((network, i) => (
                                            <img
                                                key={i}
                                                src={urlFor(network)
                                                    .height(32)
                                                    .url()}
                                                alt=""
                                                className="h-[12px] md:h-[16px] w-auto cursor-pointer"
                                            />
                                        ))}
                                    </motion.div>
                                )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 w-full h-[4px] bg-white/20 z-[5]">
                <div
                    key={current}
                    className="h-full bg-pink origin-left animate-progress-bar"
                />
            </div>
        </section>
    );
}
