"use client";
import React, { useEffect, useRef, useState } from "react";
import {
    motion,
    useSpring,
    useMotionValue,
    useTransform,
    animate,
} from "framer-motion";

const Fly = () => {
    // Desktop cursor-follow values
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const scale = useMotionValue(1);
    const tracking = useRef(true);
    const mousePos = useRef({ x: 0, y: 0 });

    // Scroll lag (used on both desktop & mobile)
    const scrollLagY = useMotionValue(0);
    const lastScrollY = useRef(0);
    const scrollTimeoutRef = useRef(null);

    // Mobile serpentine X position
    const mobileX = useMotionValue(0);
    const mobileBaseY = useMotionValue(0);

    const [isMobile, setIsMobile] = useState(false);

    // Spring configs
    const springConfig = { damping: 20, stiffness: 80 };
    const lagSpringConfig = { damping: 12, stiffness: 30 };
    const mobileSpringConfig = { damping: 20, stiffness: 50 };

    // Desktop springs
    const xSpring = useSpring(x, springConfig);
    const ySpring = useSpring(y, springConfig);
    const scaleSpring = useSpring(scale, springConfig);

    // Scroll lag spring (slow recovery creates the "left behind" feel)
    const scrollLagSpring = useSpring(scrollLagY, lagSpringConfig);

    // Mobile springs
    const mobileXSpring = useSpring(mobileX, mobileSpringConfig);
    const mobileBaseYSpring = useSpring(mobileBaseY, mobileSpringConfig);

    // Desktop: cursor Y + scroll lag
    const desktopY = useTransform(
        [ySpring, scrollLagSpring],
        ([yVal, lagVal]) => yVal + lagVal,
    );

    // Mobile: base Y + scroll lag
    const mobileY = useTransform(
        [mobileBaseYSpring, scrollLagSpring],
        ([baseVal, lagVal]) => baseVal + lagVal,
    );

    useEffect(() => {
        const checkMobile = () => {
            const mobile =
                "ontouchstart" in window ||
                window.matchMedia("(pointer: coarse)").matches;
            setIsMobile(mobile);
        };
        checkMobile();

        lastScrollY.current = window.scrollY;

        // Initialize mobile position (center-ish of viewport)
        mobileX.set(window.innerWidth / 2 - 25);
        mobileBaseY.set(window.innerHeight * 0.35);

        const handleMouseMove = (event) => {
            mousePos.current = { x: event.clientX, y: event.clientY };
            if (!tracking.current) return;

            const offsetX = Math.sin(event.clientX / 100) * 50;
            const offsetY = Math.cos(event.clientY / 100) * 50;
            x.set(event.clientX + offsetX);
            y.set(event.clientY + offsetY);
        };

        const handleClick = () => {
            const bounceDistance = 200;
            const originalX = x.get();
            const originalY = y.get();

            const dx = originalX - mousePos.current.x;
            const dy = originalY - mousePos.current.y;
            const dirX = dx >= 0 ? 1 : -1;
            const dirY = dy >= 0 ? 1 : -1;

            tracking.current = false;

            Promise.all([
                animate(x, originalX + dirX * bounceDistance, { duration: 0.2 })
                    .finished,
                animate(y, originalY + dirY * bounceDistance, { duration: 0.2 })
                    .finished,
                animate(scale, 1.4, { duration: 0.2 }).finished,
            ])
                .then(() =>
                    Promise.all([
                        animate(x, originalX, { duration: 0.2 }).finished,
                        animate(y, originalY, { duration: 0.2 }).finished,
                        animate(scale, 1, { duration: 0.2 }).finished,
                    ]),
                )
                .then(() => {
                    tracking.current = true;
                })
                .catch(() => {
                    tracking.current = true;
                });
        };

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const delta = currentScrollY - lastScrollY.current;
            lastScrollY.current = currentScrollY;

            // Accumulate vertical lag (scrolling down → fly drifts up)
            scrollLagY.set(scrollLagY.get() - delta);

            // Mobile serpentine: X oscillates with scroll position
            const amplitude = window.innerWidth * 0.25;
            const wavelength = 250;
            const serpentineX =
                window.innerWidth / 2 -
                25 +
                Math.sin(currentScrollY / wavelength) * amplitude;
            mobileX.set(serpentineX);

            // After scroll stops, spring the lag back to zero
            clearTimeout(scrollTimeoutRef.current);
            scrollTimeoutRef.current = setTimeout(() => {
                scrollLagY.set(0);
            }, 80);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("click", handleClick, { capture: true });
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", checkMobile);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("click", handleClick, { capture: true });
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", checkMobile);
            clearTimeout(scrollTimeoutRef.current);
        };
    }, [x, y, scale, scrollLagY, mobileX, mobileBaseY]);

    return (
        <div className="parent fixed inset-0 z-[100] pointer-events-none">
            {/* Outer wrapper: position + click bounce */}
            <motion.div
                style={{
                    position: "absolute",
                    width: 50,
                    height: 50,
                    x: isMobile ? mobileXSpring : xSpring,
                    y: isMobile ? mobileY : desktopY,
                    scale: scaleSpring,
                    pointerEvents: "none",
                }}
            >
                {/* Inner element: perpetual bob */}
                <motion.img
                    src="/images/fly-white.png"
                    alt=""
                    className="w-full h-full z-100"
                    style={{
                        display: "block",
                        borderRadius: "50%",
                        pointerEvents: "none",
                    }}
                    animate={{
                        y: [-6, 6, -6],
                    }}
                    transition={{
                        duration: 2.0,
                        ease: "easeInOut",
                        repeat: Infinity,
                    }}
                />
            </motion.div>
        </div>
    );
};

export default Fly;
