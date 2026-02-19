import Link from "next/link";
import Image from "next/image";
import TextHoverLink from "./TextHoverLink";

const navLinks = [
    { label: "PROJECTS", href: "/projects" },
    { label: "SHOP", href: "/shop", disabled: true },
    { label: "EVENTS", href: "/events" },
    { label: "PRESS", href: "/press" },
];

const socialLinks = [
    { label: "INSTAGRAM", href: "https://instagram.com" },
    { label: "TIKTOK", href: "https://tiktok.com" },
    { label: "FACEBOOK", href: "https://facebook.com" },
    { label: "YOUTUBE", href: "https://youtube.com" },
];

export default function Footer() {
    return (
        <footer className="bg-black flex flex-col gap-[40px] md:gap-8 items-center w-full modern-padding">
            {/* Wordmark Banner */}
            <div className="w-full overflow-hidden">
                <div
                    className="bg-cream w-full h-[120px] md:h-[224px]"
                    style={{
                        maskImage: "url('/images/rotten-science-wordmark.png')",
                        WebkitMaskImage:
                            "url('/images/rotten-science-wordmark.png')",
                        maskSize: "100% auto",
                        WebkitMaskSize: "100% auto",
                        maskRepeat: "no-repeat",
                        WebkitMaskRepeat: "no-repeat",
                        maskPosition: "center",
                        WebkitMaskPosition: "center",
                    }}
                />
            </div>

            {/* Middle Section */}
            <div className="flex flex-col md:flex-row items-start justify-between w-full gap-[40px] md:gap-0">
                {/* Tagline */}
                <div className="relative">
                    <p className="font-cool text-[36px] md:text-[64px] text-white uppercase leading-[0.8] max-w-[736px]">
                        COMEDY, DEPRAVITY, AND ALL THINGS ROTTEN.
                    </p>
                </div>

                {/* Links */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 items-start">
                    {/* Nav Links */}
                    <div className="flex flex-col gap-[24px] md:gap-[48px]">
                        {navLinks.map((link) =>
                            link.disabled ? (
                                <div key={link.label} className="flex items-center gap-[8px] cursor-default">
                                    <span className="font-cool text-[24px] md:text-[32px] text-white/40 uppercase leading-none">
                                        {link.label}
                                    </span>
                                    <span className="font-cool text-[10px] md:text-[12px] text-pink uppercase leading-none">
                                        COMING SOON
                                    </span>
                                </div>
                            ) : (
                                <TextHoverLink
                                    key={link.label}
                                    href={link.href}
                                    className="font-cool text-[24px] md:text-[32px] text-white uppercase leading-none"
                                >
                                    {link.label}
                                </TextHoverLink>
                            )
                        )}
                    </div>

                    {/* Social Links */}
                    <div className="flex flex-col gap-[24px] md:gap-[48px]">
                        {socialLinks.map((social) => (
                            <TextHoverLink
                                key={social.label}
                                href={social.href}
                                external
                                className="font-cool text-[24px] md:text-[32px] text-white uppercase leading-none"
                            >
                                {social.label}
                            </TextHoverLink>
                        ))}
                    </div>

                    {/* Get In Touch */}
                    <TextHoverLink
                        href="/contact"
                        className="inline-flex items-center gap-[6px] whitespace-nowrap font-cool text-[24px] md:text-[32px] text-white uppercase leading-none"
                    >
                        {"contact\u00a0"}
                        {/* <Image
                            src="/images/arrow-up-right.svg"
                            alt=""
                            width={22}
                            height={21}
                        /> */}
                    </TextHoverLink>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="flex flex-col mt-8 md:flex-row items-center justify-between w-full gap-[16px] md:gap-0">
                {/* Logo + Copyright */}
                <div className="flex gap-[16px] items-center">
                    <Image
                        src="/images/fly-white.png"
                        alt="Rotten Science"
                        width={52}
                        height={41}
                    />
                    <div className="flex gap-[8px] items-center">
                        <Image
                            src="/images/copyright.svg"
                            alt=""
                            width={23}
                            height={22}
                        />
                        <span className="font-cool text-[18px] text-cream uppercase leading-none">
                            2026
                        </span>
                    </div>
                </div>

                <span className="font-cool text-[14px] md:text-[18px] text-cream uppercase leading-none">
                    full-service film and TV production
                </span>

                <span className="font-cool text-[14px] md:text-[18px] text-cream uppercase leading-none flex gap-[8px]">
                    <TextHoverLink
                        href="/privacy"
                        className="font-cool text-[14px] md:text-[18px] text-cream uppercase leading-none"
                    >
                        privacy policy
                    </TextHoverLink>
                    /
                    <TextHoverLink
                        href="/terms"
                        className="font-cool text-[14px] md:text-[18px] text-cream uppercase leading-none"
                    >
                        terms of service
                    </TextHoverLink>
                </span>
            </div>
        </footer>
    );
}
