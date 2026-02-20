import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function AboutUs() {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });
    const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

    return (
        <section
            ref={sectionRef}
            className="bg-pink modern-padding min-h-screen"
        >
            {/* <div className="logo-img-container">
                <img src="/images/lockup.png" alt="rotten science" />
            </div> */}
            <h2 className="font-cool text-brownblack text-6xl md:text-[144px] uppercase leading-[0.79] mb-6 md:mb-12 page-header">
                about us
            </h2>

            <div className="flex flex-col md:flex-row min-h-scree gap-6 md:gap-[34px] mb-32">
                {/* Photo */}
                <div className="relative w-full overflow-hidden h-[300px] md:h-auto">
                    <motion.div
                        className="absolute inset-[-15%_0] bg-cover bg-center"
                        style={{
                            backgroundImage: "url(/images/about-photo.png)",
                            y: parallaxY,
                        }}
                    />
                </div>

                {/* Bio text */}
                <div className="font-new text-black leading-[1.2] w-full text-body text-justify max-w-[400px]">
                    <p className="mb-6 md:mb-8">
                        <strong>Matthew Vaughan</strong> is the founder and
                        producer of two-time Emmy-winning film and TV production
                        company <strong>Rotten Science.</strong> Prior to
                        starting his own company, he was instrumental in the
                        development of the Comedy Central digital studio.
                        Throughout his career, he has created and produced a
                        diverse slate of projects, with a focus on comedy and
                        offbeat storytelling.
                    </p>

                    <p className="mb-6 md:mb-8">
                        Rotten Science&rsquo;s most notable credits include the
                        Emmy and WGA Award&ndash;winning{" "}
                        <strong>ROTHANIEL BY JERROD CARMICHAEL</strong> (HBO),
                        the International Emmy Award&ndash;winning{" "}
                        <strong>LANDING BY VIR DAS</strong> (Netflix India),
                        Golden Globe Nominated{" "}
                        <strong>
                            BRETT GOLDSTEIN: THE SECOND BEST NIGHT OF YOUR LIFE
                        </strong>{" "}
                        (HBO), and the Critics Choice&ndash;nominated musical{" "}
                        <strong>
                            DEATH, LET ME DO MY SPECIAL BY RACHEL BLOOM
                        </strong>{" "}
                        (Netflix).
                    </p>

                    <p className="">
                        Additional filmography includes{" "}
                        <strong>OPERATION TACO GARY&rsquo;S</strong> (2026),{" "}
                        <strong>ILANA GLAZER: HUMAN MAGIC</strong> (Hulu),{" "}
                        <strong>THE CABIN WITH BERT KREISCHER</strong>{" "}
                        (Netflix), <strong>LIKE &amp; SUBSCRIBE</strong> (Amazon
                        Prime), and <strong>THE DEGENERATES</strong> (Netflix).
                    </p>
                </div>
            </div>
        </section>
    );
}
