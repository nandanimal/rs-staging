import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

const CATEGORIES = ["standup", "film", "documentary", "misc"];

const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
    },
};

const gridVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

function ProjectCard({ project }) {
    const imageUrl = project.titleCard
        ? urlFor(project.titleCard).width(610).height(904).quality(85).url()
        : null;

    return (
        <motion.div variants={cardVariants}>
            <Link
                href={`/projects/${project.slug?.current}`}
                className="flex flex-col no-underline group"
            >
                <div
                    className="relative w-full overflow-hidden"
                    style={{ aspectRatio: "2 / 3" }}
                >
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={`${project.artist} - ${project.title}`}
                            className="w-full h-full object-cover block"
                        />
                    ) : (
                        <div className="w-full h-full bg-black/10" />
                    )}
                    <div className="absolute inset-0 bg-pink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
            </Link>
        </motion.div>
    );
}

function FilterSidebar({ categories, counts, active, onSelect }) {
    return (
        <div className="flex flex-col gap-[16px] w-[203px] shrink-0">
            {categories.map((cat) => (
                <motion.button
                    key={cat}
                    onClick={() => onSelect(active === cat ? null : cat)}
                    className={`flex items-center justify-between pr-[4px] border-none cursor-pointer font-cool text-[24px] leading-none uppercase p-0 ${
                        active === cat
                            ? "bg-black text-white"
                            : "bg-transparent text-black"
                    }`}
                    initial="idle"
                    whileHover="hover"
                >
                    <span className="relative inline-block overflow-hidden">
                        <motion.span
                            className="absolute inset-0 bg-pink origin-left"
                            variants={{
                                idle: { scaleX: 0 },
                                hover: { scaleX: 1 },
                            }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            aria-hidden="true"
                        />
                        <span className="relative flex gap-[2px] items-start">
                            <span>{cat}</span>
                            <span className="font-prov text-xs">
                                [{counts[cat] || 0}]
                            </span>
                        </span>
                    </span>
                    {active === cat && (
                        <svg
                            width="13"
                            height="1"
                            viewBox="0 0 13 1"
                            fill="none"
                        >
                            <line
                                x1="0"
                                y1="0.5"
                                x2="13"
                                y2="0.5"
                                stroke="white"
                                strokeWidth="1"
                            />
                        </svg>
                    )}
                </motion.button>
            ))}
        </div>
    );
}

function MobileFilters({ categories, counts, active, onSelect }) {
    const [open, setOpen] = useState(false);

    return (
        <motion.div
            layout
            className="flex flex-col gap-[6px] mb-[16px] overflow-hidden"
        >
            <motion.button
                layout
                onClick={() => setOpen(!open)}
                className="font-cool text-[24px] leading-none uppercase text-black bg-transparent border-none cursor-pointer p-0 text-left"
                initial="idle"
                whileHover="hover"
            >
                <span className="relative inline-block overflow-hidden">
                    <motion.span
                        className="absolute inset-0 bg-pink origin-left"
                        variants={{ idle: { scaleX: 0 }, hover: { scaleX: 1 } }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        aria-hidden="true"
                    />
                    <span className="relative">{open ? "hide" : "filter"}</span>
                </span>
            </motion.button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        className="flex flex-col gap-px overflow-hidden"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                            height: "auto",
                            opacity: 1,
                            transition: {
                                height: {
                                    duration: 0.3,
                                    ease: [0.25, 0.1, 0.25, 1],
                                },
                                opacity: { duration: 0.2, delay: 0.1 },
                                staggerChildren: 0.06,
                                delayChildren: 0.1,
                            },
                        }}
                        exit={{
                            height: 0,
                            opacity: 0,
                            transition: {
                                height: {
                                    duration: 0.3,
                                    ease: [0.25, 0.1, 0.25, 1],
                                    delay: 0.1,
                                },
                                opacity: { duration: 0.2 },
                            },
                        }}
                    >
                        {categories.map((cat) => (
                            <motion.button
                                key={cat}
                                onClick={() =>
                                    onSelect(active === cat ? null : cat)
                                }
                                className="flex gap-[2px] items-start bg-black text-white border-none cursor-pointer font-cool text-[24px] leading-none uppercase p-0 w-full"
                                variants={{
                                    hidden: { opacity: 0, y: 12 },
                                    visible: { opacity: 1, y: 0 },
                                }}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                whileHover="hover"
                                transition={{
                                    duration: 0.3,
                                    ease: [0.25, 0.1, 0.25, 1],
                                }}
                            >
                                <span className="relative inline-block overflow-hidden">
                                    <motion.span
                                        className="absolute inset-0 bg-pink origin-left"
                                        variants={{
                                            hidden: { scaleX: 0 },
                                            visible: { scaleX: 0 },
                                            hover: { scaleX: 1 },
                                        }}
                                        transition={{
                                            duration: 0.3,
                                            ease: "easeOut",
                                        }}
                                        aria-hidden="true"
                                    />
                                    <span className="relative flex gap-[2px] items-start">
                                        <span>{cat}</span>
                                        <span className="font-prov text-md">
                                            [{counts[cat] || 0}]
                                        </span>
                                    </span>
                                </span>
                            </motion.button>
                        ))}
                        <motion.button
                            onClick={() => onSelect(null)}
                            className="flex gap-[2px] items-start bg-black text-white border-none cursor-pointer font-cool text-[24px] leading-none uppercase p-0 w-full"
                            variants={{
                                hidden: { opacity: 0, y: 12 },
                                visible: { opacity: 1, y: 0 },
                            }}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            whileHover="hover"
                            transition={{
                                duration: 0.3,
                                ease: [0.25, 0.1, 0.25, 1],
                            }}
                        >
                            <span className="relative inline-block overflow-hidden">
                                <motion.span
                                    className="absolute inset-0 bg-pink origin-left"
                                    variants={{
                                        hidden: { scaleX: 0 },
                                        visible: { scaleX: 0 },
                                        hover: { scaleX: 1 },
                                    }}
                                    transition={{
                                        duration: 0.3,
                                        ease: "easeOut",
                                    }}
                                    aria-hidden="true"
                                />
                                <span className="relative flex gap-[2px] items-start">
                                    <span>view all</span>
                                    <span className="font-prov text-[8px]">
                                        [{counts.total || 0}]
                                    </span>
                                </span>
                            </span>
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function ProjectsGrid({ projects }) {
    const [activeCategory, setActiveCategory] = useState(null);

    const counts = useMemo(() => {
        const c = { total: projects.length };
        CATEGORIES.forEach((cat) => {
            c[cat] = projects.filter((p) => p.category === cat).length;
        });
        return c;
    }, [projects]);

    const filtered = activeCategory
        ? projects.filter((p) => p.category === activeCategory)
        : projects;

    return (
        <div className="mb-24">
            {/* Mobile filters */}
            <div className="md:hidden">
                <MobileFilters
                    categories={CATEGORIES}
                    counts={counts}
                    active={activeCategory}
                    onSelect={setActiveCategory}
                />
            </div>

            {/* Desktop layout */}
            <div className="hidden relative md:flex gap-[52px]">
                <div className="sticky top-[3rem] self-start">
                    <FilterSidebar
                        categories={CATEGORIES}
                        counts={counts}
                        active={activeCategory}
                        onSelect={setActiveCategory}
                    />
                </div>
                <motion.div
                    key={activeCategory}
                    className="flex-1 grid grid-cols-5 gap-x-[58px] gap-y-[58px]"
                    variants={gridVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {filtered.map((project) => (
                        <ProjectCard key={project._id} project={project} />
                    ))}
                </motion.div>
            </div>

            {/* Mobile grid */}
            <motion.div
                key={activeCategory}
                className="md:hidden grid grid-cols-3 gap-[8px]"
                variants={gridVariants}
                initial="hidden"
                animate="visible"
            >
                {filtered.map((project) => (
                    <motion.div key={project._id} variants={cardVariants}>
                        <Link
                            href={`/projects/${project.slug?.current}`}
                            className="no-underline group"
                        >
                            <div
                                className="relative w-full overflow-hidden"
                                style={{ aspectRatio: "2 / 3" }}
                            >
                                {project.titleCard ? (
                                    <img
                                        src={urlFor(project.titleCard)
                                            .width(240)
                                            .height(360)
                                            .quality(80)
                                            .url()}
                                        alt={`${project.artist} - ${project.title}`}
                                        className="w-full h-full object-cover block"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-black/10" />
                                )}
                                <div className="absolute inset-0 bg-pink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
