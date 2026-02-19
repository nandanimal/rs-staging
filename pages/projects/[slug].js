import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import {
    projectBySlugQuery,
    allProjectSlugsQuery,
    adjacentProjectsQuery,
} from "@/sanity/lib/queries";

// ── WCAG contrast helpers ──────────────────────────────────────────────────
function toLinear(c) {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function luminance(r, g, b) {
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(l1, l2) {
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

// Pink: #ff68dc
const PINK_LUMINANCE = luminance(255, 104, 220);

// ── Component ──────────────────────────────────────────────────────────────
export default function ProjectPage({ project, prevProject, nextProject }) {
    const heroRef = useRef(null);

    // Default to brownblack until client-side color extraction runs
    const [sectionBg, setSectionBg] = useState("#231f20");
    const [sectionText, setSectionText] = useState("#ffffff");

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });
    const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

    // Draw a 50×50 thumbnail to canvas, average all pixels, then pick text color
    useEffect(() => {
        if (!project.coverPhoto) return;

        const url = urlFor(project.coverPhoto)
            .width(50)
            .height(50)
            .quality(80)
            .url();
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = url;

        img.onload = () => {
            try {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                const { data } = ctx.getImageData(0, 0, img.width, img.height);

                let r = 0,
                    g = 0,
                    b = 0;
                const count = data.length / 4;
                for (let i = 0; i < data.length; i += 4) {
                    r += data[i];
                    g += data[i + 1];
                    b += data[i + 2];
                }
                r = Math.round(r / count);
                g = Math.round(g / count);
                b = Math.round(b / count);

                const bgL = luminance(r, g, b);

                // Prefer pink if it clears 4.5:1, otherwise pick white vs. black by contrast
                let text;
                if (contrastRatio(bgL, PINK_LUMINANCE) >= 4.5) {
                    text = "#ff68dc";
                } else if (contrastRatio(bgL, 1.0) >= contrastRatio(bgL, 0.0)) {
                    text = "#ffffff";
                } else {
                    text = "#000000";
                }

                setSectionBg(`rgb(${r},${g},${b})`);
                setSectionText(text);
            } catch {
                // Tainted canvas or other error — keep defaults
            }
        };
    }, [project.coverPhoto]);

    const year = new Date(project.releaseDate).getFullYear();
    const releaseDate = new Date(project.releaseDate)
        .toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        })
        .toUpperCase();

    const coverUrl = project.coverPhoto
        ? urlFor(project.coverPhoto).width(1920).quality(85).url()
        : null;

    const mobileCoverUrl = project.mobileCoverPhoto
        ? urlFor(project.mobileCoverPhoto).width(750).quality(85).url()
        : coverUrl;

    const hotspot = project.coverPhoto?.hotspot;
    const coverBgPosition = hotspot
        ? `${hotspot.x * 100}% ${hotspot.y * 100}%`
        : "center";

    // Derived color tokens (hex alpha notation)
    const t = sectionText;
    const muted = t + "80"; // 50% — labels
    const body = t + "cc"; // 80% — description text
    const border = t + "33"; //+33 20% — divider lines
    const thumb = t + "1a"; // 10% — placeholder bg for thumbnails

    const sectionStyle = {
        backgroundColor: sectionBg,
        color: sectionText,
        transition: "background-color 0.5s ease, color 0.5s ease",
    };

    const iconFilter = t !== "#000000" ? "invert(1)" : "none";

    return (
        <>
            {/* ── Hero ── */}
            <section
                ref={heroRef}
                className="relative w-full h-[80vh] overflow-hidden select-none"
            >
                {/* Desktop hero */}
                {coverUrl && (
                    <motion.div
                        className="absolute inset-0 bg-cover scale-110 hidden md:block"
                        style={{
                            backgroundImage: `url(${coverUrl})`,
                            backgroundPosition: coverBgPosition,
                            y: parallaxY,
                        }}
                    />
                )}
                {/* Mobile hero — uses mobileCoverPhoto if set, otherwise falls back to coverUrl */}
                {mobileCoverUrl && (
                    <motion.div
                        className="absolute inset-0 bg-cover bg-center scale-110 md:hidden"
                        style={{
                            backgroundImage: `url(${mobileCoverUrl})`,
                            y: parallaxY,
                        }}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end px-4 pb-8 md:px-10 md:pb-10 z-10">
                    {project.networks?.length > 0 && (
                        <div className="flex gap-3 mb-2">
                            {project.networks.map((n, i) => (
                                <img
                                    key={i}
                                    src={urlFor(n).height(24).url()}
                                    alt=""
                                    className="h-[12px] md:h-[16px] w-auto"
                                />
                            ))}
                        </div>
                    )}
                    <div className="bg-black w-fit leading-none">
                        <span className="font-cool text-4xl md:text-7xl lg:text-8xl text-white uppercase leading-[0.67]">
                            {project.artist}
                        </span>
                    </div>
                    <div className="bg-black w-fit flex items-start gap-2 mt-[2px] leading-none">
                        <span className="font-cool text-5xl md:text-7xl lg:text-8xl text-white uppercase leading-[0.67]">
                            &ldquo;{project.title}&rdquo;
                        </span>
                        <span className="font-prov text-sm md:text-lg text-white">
                            [{year}]
                        </span>
                    </div>
                </div>
            </section>

            {/* ── Info section ── */}
            <section
                className="modern-padding py-10 md:py-16"
                style={sectionStyle}
            >
                {/* Desktop */}
                <div className="hidden md:flex gap-[52px] items-start">
                    <div className="flex flex-col w-[580px] shrink-0">
                        <div
                            className="flex gap-[52px] pb-8"
                            style={{ borderBottom: `1px solid ${border}` }}
                        >
                            {project.directedBy && (
                                <div className="flex flex-col gap-2 flex-1">
                                    <span
                                        className="font-prov text-xs uppercase tracking-widest"
                                        style={{ color: muted }}
                                    >
                                        Directed by
                                    </span>
                                    <span className="font-cool text-3xl uppercase leading-none">
                                        {project.directedBy}
                                    </span>
                                </div>
                            )}
                            {project.starring?.length > 0 && (
                                <div className="flex flex-col gap-2 flex-1">
                                    <span
                                        className="font-prov text-xs uppercase tracking-widest"
                                        style={{ color: muted }}
                                    >
                                        Starring
                                    </span>
                                    <span className="font-cool text-3xl uppercase leading-none">
                                        {project.starring.join(", ")}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 pt-8">
                            <span
                                className="font-prov text-xs uppercase tracking-widest"
                                style={{ color: muted }}
                            >
                                Released
                            </span>
                            <span className="font-cool text-3xl uppercase leading-none">
                                {releaseDate}
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-8">
                        <p
                            className="font-new leading-[1.7]"
                            style={{ color: body }}
                        >
                            {project.description}
                        </p>
                        {project.url && (
                            <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 font-cool text-2xl uppercase no-underline self-end opacity-90 hover:opacity-100 transition-opacity"
                                style={{ color: sectionText }}
                            >
                                watch
                                <Image
                                    src="/images/arrow-up-right.svg"
                                    alt=""
                                    width={24}
                                    height={24}
                                    style={{ filter: iconFilter }}
                                />
                            </a>
                        )}
                    </div>
                </div>

                {/* Mobile */}
                <div className="md:hidden flex flex-col">
                    {project.directedBy && (
                        <div
                            className="py-4"
                            style={{ borderBottom: `1px solid ${border}` }}
                        >
                            <span
                                className="font-prov uppercase tracking-widest"
                                style={{ color: muted }}
                            >
                                Directed by
                            </span>
                            <p className="font-cool text-2xl uppercase leading-none mt-1">
                                {project.directedBy}
                            </p>
                        </div>
                    )}
                    {project.starring?.length > 0 && (
                        <div
                            className="py-4"
                            style={{ borderBottom: `1px solid ${border}` }}
                        >
                            <span
                                className="font-prov text-xs uppercase tracking-widest"
                                style={{ color: muted }}
                            >
                                Starring
                            </span>
                            <p className="font-cool text-2xl uppercase leading-none mt-1">
                                {project.starring.join(", ")}
                            </p>
                        </div>
                    )}
                    <div
                        className="py-4"
                        style={{ borderBottom: `1px solid ${border}` }}
                    >
                        <span
                            className="font-prov text-xs uppercase tracking-widest"
                            style={{ color: muted }}
                        >
                            Released
                        </span>
                        <p className="font-cool text-2xl uppercase leading-none mt-1">
                            {releaseDate}
                        </p>
                    </div>
                    <p
                        className="font-new text-sm leading-[1.7] mt-6"
                        style={{ color: body }}
                    >
                        {project.description}
                    </p>
                    {project.url && (
                        <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 font-cool text-2xl uppercase no-underline mt-6"
                            style={{ color: sectionText }}
                        >
                            watch
                            <Image
                                src="/images/arrow-up-right.svg"
                                alt=""
                                width={20}
                                height={20}
                                style={{ filter: iconFilter }}
                            />
                        </a>
                    )}
                </div>
            </section>

            {/* ── Merch ── */}
            {project.merch?.length > 0 && (
                <section
                    className="modern-padding pb-10 md:pb-16"
                    style={{
                        ...sectionStyle,
                        borderTop: `1px solid ${border}`,
                    }}
                >
                    <span
                        className="font-prov text-xs uppercase tracking-widest block mb-6"
                        style={{ color: muted }}
                    >
                        Merch
                    </span>

                    {/* Desktop: table rows */}
                    <div className="hidden md:block">
                        {project.merch.map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-8 py-6"
                                style={{ borderTop: `1px solid ${border}` }}
                            >
                                <div
                                    className="w-[280px] h-[98px] shrink-0 overflow-hidden rounded-sm"
                                    style={{ backgroundColor: thumb }}
                                >
                                    {item.photo && (
                                        <img
                                            src={urlFor(item.photo)
                                                .width(560)
                                                .height(196)
                                                .quality(85)
                                                .url()}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <span className="font-cool text-2xl uppercase w-[380px] shrink-0 leading-tight">
                                    {item.title}
                                </span>
                                <p
                                    className="font-new text-sm leading-[1.7] flex-1"
                                    style={{ color: body }}
                                >
                                    {item.desc}
                                </p>
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 font-prov text-sm uppercase no-underline shrink-0 opacity-80 hover:opacity-100 transition-opacity"
                                    style={{ color: sectionText }}
                                >
                                    Shop now <span>→</span>
                                </a>
                            </div>
                        ))}
                    </div>

                    {/* Mobile: cards */}
                    <div className="md:hidden flex flex-col gap-8">
                        {project.merch.map((item, i) => (
                            <div key={i} className="flex flex-col">
                                <div
                                    className="w-full overflow-hidden rounded-sm"
                                    style={{
                                        aspectRatio: "376/227",
                                        backgroundColor: thumb,
                                    }}
                                >
                                    {item.photo && (
                                        <img
                                            src={urlFor(item.photo)
                                                .width(390)
                                                .quality(85)
                                                .url()}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 pt-4">
                                    <span className="font-cool text-2xl uppercase leading-tight">
                                        {item.title}
                                    </span>
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 font-prov text-sm uppercase no-underline mt-1"
                                        style={{ color: sectionText }}
                                    >
                                        Shop now <span>→</span>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ── Project Navigation ── */}
            <nav
                className="flex min-h-[79px]"
                style={{ ...sectionStyle, borderTop: `1px solid ${border}` }}
            >
                <div
                    className="flex-1"
                    style={{ borderRight: `1px solid ${border}` }}
                >
                    {prevProject ? (
                        <Link
                            href={`/projects/${prevProject.slug.current}`}
                            className="flex flex-col gap-1 modern-padding py-6 h-full no-underline opacity-70 hover:opacity-100 transition-opacity"
                        >
                            <span
                                className="font-prov text-xs uppercase tracking-widest"
                                style={{ color: muted }}
                            >
                                Previous
                            </span>
                            <span className="font-cool text-lg md:text-2xl uppercase leading-tight">
                                &ldquo;{prevProject.title}&rdquo;
                            </span>
                        </Link>
                    ) : (
                        <div className="h-full" />
                    )}
                </div>
                <div className="flex-1">
                    {nextProject ? (
                        <Link
                            href={`/projects/${nextProject.slug.current}`}
                            className="flex flex-col gap-1 items-end modern-padding py-6 h-full no-underline text-right opacity-70 hover:opacity-100 transition-opacity"
                        >
                            <span
                                className="font-prov text-xs uppercase tracking-widest"
                                style={{ color: muted }}
                            >
                                Next
                            </span>
                            <span className="font-cool text-lg md:text-2xl uppercase leading-tight">
                                &ldquo;{nextProject.title}&rdquo;
                            </span>
                        </Link>
                    ) : (
                        <div className="h-full" />
                    )}
                </div>
            </nav>
        </>
    );
}

export async function getStaticPaths() {
    const slugs = await client.fetch(allProjectSlugsQuery);
    return {
        paths: slugs
            .filter((s) => s.slug)
            .map((s) => ({ params: { slug: s.slug } })),
        fallback: "blocking",
    };
}

export async function getStaticProps({ params }) {
    const project = await client.fetch(projectBySlugQuery, {
        slug: params.slug,
    });

    if (!project) {
        return { notFound: true };
    }

    const adjacent = await client.fetch(adjacentProjectsQuery, {
        releaseDate: project.releaseDate,
        id: project._id,
    });

    // Wrap around: if no prev, use last; if no next, use first.
    // Guard against single-project edge case (don't link a project to itself).
    const rawPrev = adjacent?.prev ?? adjacent?.last ?? null;
    const rawNext = adjacent?.next ?? adjacent?.first ?? null;

    return {
        props: {
            project,
            prevProject: rawPrev?._id !== project._id ? rawPrev : null,
            nextProject: rawNext?._id !== project._id ? rawNext : null,
        },
        revalidate: 60,
    };
}
