import "@/styles/globals.css";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
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
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
                <meta name="theme-color" content="#000000" />
            </Head>
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
