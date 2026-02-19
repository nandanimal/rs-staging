"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const MotionLink = motion.create(Link);

export default function TextHoverLink({
    href,
    children,
    external = false,
    className = "",
}) {
    const inner = (
        <span className="relative inline-block overflow-hidden">
            <motion.span
                className="absolute inset-0 bg-pink origin-left"
                initial={{ scaleX: 0 }}
                variants={{
                    idle: { scaleX: 0 },
                    hover: { scaleX: 1 },
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                aria-hidden="true"
            />
            <span className="relative leading-[0.8]">{children}</span>
        </span>
    );

    if (external) {
        return (
            <motion.a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`no-underline ${className}`}
                initial="idle"
                whileHover="hover"
            >
                {inner}
            </motion.a>
        );
    }

    return (
        <MotionLink
            href={href}
            className={`no-underline ${className}`}
            initial="idle"
            whileHover="hover"
        >
            {inner}
        </MotionLink>
    );
}
