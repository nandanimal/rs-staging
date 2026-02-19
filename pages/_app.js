import "@/styles/globals.css";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Fly from "@/components/Fly";

export default function App({ Component, pageProps }) {
    const router = useRouter();
    const lenisRef = useRef(null);

    useEffect(() => {
        const initLenis = async () => {
            const Lenis = (await import("lenis")).default;
            const lenis = new Lenis();
            lenisRef.current = lenis;

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }

            requestAnimationFrame(raf);

            return lenis;
        };

        initLenis();

        const handleRouteChange = () => {
            lenisRef.current?.scrollTo(0, { immediate: true });
        };

        router.events.on("routeChangeComplete", handleRouteChange);

        return () => {
            router.events.off("routeChangeComplete", handleRouteChange);
            lenisRef.current?.destroy();
            lenisRef.current = null;
        };
    }, []);

    return (
        <>
            <NavBar />
            <AnimatePresence mode="wait">
                <motion.main
                    key={router.asPath}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <Component {...pageProps} />
                </motion.main>
            </AnimatePresence>
            <Footer />
            <Fly />
        </>
    );
}
