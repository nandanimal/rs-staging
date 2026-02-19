import "@/styles/globals.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Fly from "@/components/Fly";

export default function App({ Component, pageProps }) {
    const router = useRouter();

    useEffect(() => {
        const initLenis = async () => {
            const Lenis = (await import("lenis")).default;
            const lenis = new Lenis();

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }

            requestAnimationFrame(raf);

            return lenis;
        };

        let lenisInstance;
        initLenis().then((instance) => {
            lenisInstance = instance;
        });

        return () => {
            lenisInstance?.destroy();
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
