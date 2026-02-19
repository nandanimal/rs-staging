import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
    {
        label: "PROJECTS",
        href: "/projects",
        activeBg: "bg-cream",
        activeText: "text-black",
        hoverBg: "hover:bg-cream",
        hoverText: "hover:text-black",
    },
    {
        label: "SHOP",
        href: "/shop",
        activeBg: "bg-white",
        activeText: "text-black",
        hoverBg: "hover:bg-white",
        hoverText: "hover:text-black",
        disabled: true,
    },
    {
        label: "EVENTS",
        href: "/events",
        activeBg: "bg-yellow",
        activeText: "text-black",
        hoverBg: "hover:bg-yellow",
        hoverText: "hover:text-black",
    },
    {
        label: "PRESS",
        href: "/press",
        activeBg: "bg-blue",
        activeText: "text-black",
        hoverBg: "hover:bg-blue",
        hoverText: "hover:text-black",
    },
];

const socialLinks = [
    {
        label: "Instagram",
        href: "https://instagram.com",
        icon: (
            <svg
                width="16"
                height="16"
                viewBox="0 0 16.371 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M0.043 8.171c.013-.463-.003-.892.01-1.361.067-.585.083-1.156.082-1.741-.005-.65-.028-1.283.009-1.932.046-.401.186-.827.334-1.193.189-.396.398-.79.703-1.1.434-.343.982-.506 1.52-.602.186-.029.39-.068.573-.075.342.001.683.028 1.028 0 .396-.033.8-.057 1.192-.064.533-.047 1.072-.054 1.61-.025.503.037.982-.048 1.48-.06.394.022.769-.04 1.155.007.48.032.964-.002 1.444-.002.343-.004.685-.047 1.029.006.781.075 1.56.138 2.292.447.75.364 1.037 1.245 1.264 2.005.105.332.218.662.293 1.003.08.4.221.796.266 1.197.053.678.055 1.375.037 2.056-.039.535-.034 1.086-.071 1.618-.071.549-.035 1.1-.029 1.65.01 1.097-.037 2.194-.208 3.276-.037.222-.05.455-.092.676-.03.244-.058.479-.18.691-.221.465-.818.515-1.251.66-.578.162-1.181.235-1.779.262-.373.039-.743.006-1.108.064-.391.072-.812.112-1.205.19-.239.045-.481.059-.721.097-.447.072-.918.073-1.37.074-.146.001-.273.02-.412.016-.248-.008-.521-.012-.766-.032-.334-.029-.653.001-1.003-.01-.319.004-.618-.055-.932-.072-.317-.023-.601-.09-.901-.176-.275-.07-.544-.087-.821-.146-.295-.061-.564-.198-.836-.325-.297-.144-.635-.21-.924-.371-.237-.127-.41-.327-.615-.497-.218-.175-.435-.367-.539-.64-.137-.359-.22-.757-.288-1.128-.045-.348-.086-.694-.17-1.04-.087-.465-.052-.936-.112-1.406-.074-.662.012-1.317.013-1.983m8.628-7.036c-.695-.015-1.368.095-2.061.14-.707.101-1.388.077-2.074.209-.353.068-.92.138-1.235.312-.68.276-1.039.53-1.28 1.219-.318.74-.163 1.707-.134 2.502-.025.55-.045 1.115-.043 1.668-.009.376-.057.75-.079 1.117-.059.829-.031 1.664-.006 2.496.058.823.067 1.688.5 2.414.192.337.483.592.808.785.234.106.485.161.719.236.517.284 1.166.27 1.737.286.59.077 1.178-.006 1.772-.024.695-.02 1.386-.006 2.077-.08.523-.052 1.054-.048 1.571-.138.493-.061 1.007-.035 1.496-.15.507-.113 1.041-.283 1.468-.587.536-.404.546-1.146.584-1.763.076-.729.104-1.468.1-2.197-.02-.974.107-1.965.087-2.94-.047-.739-.026-1.446-.108-2.185.003-.335.004-.642-.065-.965-.144-.987-.775-1.934-1.784-2.119-.255-.041-.518-.009-.778-.023-.55-.026-1.084-.118-1.634-.142-.305-.016-.635-.065-.928-.073-.236-.001-.465.007-.702.001m5.925 7.624l-.454-6.382h-.004"
                    fill="white"
                />
                <path
                    d="M8.174 4.112c.651-.008 1.295.118 1.903.393.594.268 1.085.688 1.528 1.149.376.39.715.848.941 1.34.162.353.36.732.417 1.118.072.488.066.978.001 1.465-.028.209-.093.397-.137.603-.145.674-.435 1.302-.865 1.842-.334.419-.703.81-1.126 1.134-.323.248-.727.389-1.097.544-.458.192-.972.242-1.463.225-.437-.014-.875-.088-1.292-.224-.422-.138-.811-.365-1.173-.609-.442-.298-.858-.658-1.14-1.118-.273-.444-.41-.959-.499-1.471-.036-.208-.077-.424-.076-.636-.006-.35.034-.698.093-1.043.049-.285.11-.582.222-.85.091-.22.141-.449.28-.647.226-.322.433-.664.72-.935.234-.221.455-.456.734-.623.347-.208.72-.385 1.107-.497.308-.092.623-.136.94-.158l.086-.002z"
                    fill="black"
                />
                <path
                    d="M8.209 5.68c-.268.005-.495.063-.744.158-.263.1-.472.275-.693.437-.216.158-.404.384-.549.614-.118.188-.227.358-.303.571-.082.23-.119.442-.14.686-.018.212.003.436.049.645.04.182.058.368.131.541.13.31.312.607.538.86.253.283.564.49.899.647.213.1.478.18.71.196.273.019.562.032.829-.024.36-.075.708-.232 1.008-.449.247-.178.455-.402.638-.648.124-.168.215-.375.304-.565.089-.19.126-.368.162-.575.057-.328.055-.676-.014-1.001-.064-.3-.132-.541-.283-.81-.187-.334-.447-.597-.75-.82-.236-.174-.523-.29-.809-.37-.215-.065-.456-.106-.683-.1l-.25.007z"
                    fill="white"
                />
                <path
                    d="M12.77 3.205c.295-.003.574.163.618.474.054.378-.211.707-.583.741-.366.033-.675-.274-.678-.629-.003-.336.302-.59.643-.586z"
                    fill="white"
                />
            </svg>
        ),
    },
    {
        label: "Facebook",
        href: "https://facebook.com",
        icon: (
            <svg
                width="14"
                height="16"
                viewBox="0 0 13.955 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M7.954.211c.233-.025.449-.134.683-.148.127-.008.255.004.38-.012.257-.07.53-.107.68.158.086.162.084.35.136.522.08.182.066.382.089.573.114.472.234.949.475 1.377.38.58.872 1.14 1.531 1.4.197.097.433.099.648.154.318.09.647-.006.973.042.481.023.467.26.314.614-.18.413-.406.808-.571 1.226-.036.106-.112.207-.221.238-.195.058-.413.003-.61-.005-.236-.032-.479-.036-.707-.109-.466-.17-.904-.458-1.397-.539-.346.051-.268.802-.225 1.055.026.428.052.858.051 1.286.032.198.109.39.089.593-.017.167.037.331.009.496-.114.718-.131 1.446-.342 2.146-.042.141-.068.287-.093.432-.02.191-.112.358-.185.531-.081.299-.245.559-.393.826-.127.374-.42.636-.677.921-.149.17-.287.348-.459.495-1.061 1.088-2.652 1.772-4.172 1.41-.273-.07-.558-.078-.832-.133-.393-.146-.815-.219-1.169-.451-.396-.22-.707-.566-1.005-.903-.262-.322-.422-.71-.55-1.1-.159-.343-.275-.713-.308-1.091-.01-.195-.065-.381-.092-.573-.007-.101.006-.202.006-.304-.032-1.008.142-2.074.752-2.901.337-.382.664-.78 1.058-1.106.139-.116.307-.189.461-.279.466-.322.994-.53 1.538-.681.14-.04.272-.103.415-.127.229-.042.463-.038.696-.047.514-.002 1.778-.033 2.086.404.036.244-.143.475-.228.689-.079.144-.1.302-.147.455-.104.223-.196.503-.409.633-.157.088-.329-.012-.49-.038-.09-.014-.183-.015-.274-.019-.276.001-.554-.022-.83-.01-.91.115-1.636.762-2.134 1.5-.105.201-.192.415-.278.626-.046.228-.069.462-.118.691-.097.273-.058.554.004.83.031.276.118.529.256.77.203.336.52.574.806.823.57.349 1.237.6 1.915.562.224-.022.426-.026.732-.079.342-.061.47-.131.855-.399.168-.118.423-.329.521-.507.097-.16.192-.35.276-.516.121-.265.213-.403.288-.703.051-.206.031-.557.064-.76.053-.316.105-.625.14-.941.041-.186.103-.448.122-.639.028-.273-.039-.542-.003-.848.019-.156-.008-.676 0-.836.012-.256-.01-.409-.009-.632-.014-.225-.019-1.028 0-1.255-.036-.649-.181-.894-.206-1.142-.015-.151-.078-.293-.102-.44-.038-.275-.026-.69-.054-1.01-.033-.325-.094-.503-.124-.825-.01-.121-.011-.366-.027-.486-.023-.193-.038-.258-.05-.452-.03-.296-.075-.59-.053-.886-.034-.306.153-.594.491-.58"
                    fill="white"
                />
            </svg>
        ),
    },
];

export default function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();
    const [activePath, setActivePath] = useState(router.pathname);

    useEffect(() => {
        const timeout = setTimeout(() => setActivePath(router.pathname), 300);
        return () => clearTimeout(timeout);
    }, [router.pathname]);

    const isActive = (href) =>
        activePath === href || activePath.startsWith(href + "/");

    return (
        <>
            {/* Desktop Nav */}
            <nav className="items-center gap-px w-full h-[16px] fixed top-0 left-0 z-50 hidden nav:flex">
                <Link
                    href="/"
                    className="flex items-center bg-pink w-[105px] h-[16px] px-[10px] shrink-0"
                >
                    <Image
                        src="/images/logo.png"
                        alt="Logo"
                        width={85}
                        height={15}
                        priority
                    />
                </Link>
                <div className="descriptor flex items-center font-cool text-[24px] leading-[16px] uppercase no-underline whitespace-nowrap h-[16px] p-0 shrink-0 text-[#03F333] bg-[#869A77]">
                    full service film and tv production
                </div>
                {navLinks.map((link) =>
                    link.disabled ? (
                        <div
                            key={link.label}
                            className="relative nav-item flex items-center font-cool text-[24px] leading-[16px] uppercase whitespace-nowrap h-[16px] p-0 shrink-0 bg-black text-white/40 cursor-default"
                        >
                            {link.label}
                            <span className="absolute top-full left-0 font-cool -mt-1 text-xs leading-none uppercase text-black bg-pink whitespace-nowrap -rotate-3">
                                COMING SOON
                            </span>
                        </div>
                    ) : (
                        <Link
                            key={link.label}
                            href={link.href}
                            className={`nav-item flex items-center font-cool text-[24px] leading-[16px] uppercase no-underline whitespace-nowrap h-[16px] p-0 shrink-0 transition-colors duration-200 ${
                                isActive(link.href)
                                    ? `${link.activeBg} ${link.activeText}`
                                    : `bg-black text-white ${link.hoverBg} ${link.hoverText}`
                            }`}
                        >
                            {link.label}
                        </Link>
                    )
                )}
                {socialLinks.map((social) => (
                    <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center bg-black h-[16px] w-[36px] shrink-0 [&_svg]:block"
                        aria-label={social.label}
                    >
                        {social.icon}
                    </a>
                ))}
                <Link
                    href="/contact"
                    className={`flex items-center font-cool text-[24px] leading-[16px] uppercase no-underline whitespace-nowrap h-[16px] p-0 flex-1 justify-end min-w-0 transition-colors duration-200 ${
                        isActive("/contact")
                            ? "bg-brown text-yellow"
                            : "bg-black text-white hover:bg-brown hover:text-yellow"
                    }`}
                >
                    GET IN TOUCH
                </Link>
            </nav>

            {/* Mobile Nav */}
            <nav className="items-center gap-px w-full h-[16px] fixed top-0 left-0 z-50 flex nav:hidden">
                <Link
                    href="/"
                    className="flex items-center bg-pink w-[105px] h-[16px] px-[10px] shrink-0"
                >
                    <Image
                        src="/images/logo.png"
                        alt="Logo"
                        width={85}
                        height={15}
                        priority
                    />
                </Link>
                <button
                    className="flex items-center justify-end gap-[8px] flex-1 bg-black border-none cursor-pointer h-[16px] p-0"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                >
                    {menuOpen ? (
                        <span className="font-cool text-[24px] leading-[16px] text-white uppercase">
                            Hide
                        </span>
                    ) : (
                        <>
                            <Image
                                src="/images/menu-hamburger.svg"
                                alt=""
                                width={31}
                                height={9}
                            />
                            <span className="font-cool text-[24px] leading-[16px] text-white uppercase">
                                Menu
                            </span>
                        </>
                    )}
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        className="fixed top-[17px] left-0 right-0 bottom-0 bg-black z-40 flex flex-col gap-px"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.06,
                                    delayChildren: 0.1,
                                },
                            },
                        }}
                    >
                        <div className="flex flex-col gap-px">
                            {navLinks.map((link) => (
                                <motion.div
                                    key={link.label}
                                    variants={{
                                        hidden: { opacity: 0, y: 12 },
                                        visible: { opacity: 1, y: 0 },
                                    }}
                                    transition={{
                                        duration: 0.3,
                                        ease: [0.25, 0.1, 0.25, 1],
                                    }}
                                >
                                    {link.disabled ? (
                                        <div className="flex items-center gap-[12px] bg-black text-white/40 font-cool text-[48px] leading-none uppercase cursor-default">
                                            {link.label}
                                            <span className="font-cool text-[16px] leading-none uppercase text-pink">
                                                COMING SOON
                                            </span>
                                        </div>
                                    ) : (
                                        <Link
                                            href={link.href}
                                            className={`flex items-center font-cool text-[48px] leading-none uppercase no-underline transition-colors duration-200 ${
                                                isActive(link.href)
                                                    ? `${link.activeBg} ${link.activeText}`
                                                    : `bg-black text-white ${link.hoverBg} ${link.hoverText}`
                                            }`}
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                        <div className="flex flex-col gap-px">
                            {[
                                {
                                    label: "Instagram",
                                    href: "https://instagram.com",
                                },
                                {
                                    label: "Facebook",
                                    href: "https://facebook.com",
                                },
                                {
                                    label: "YouTube",
                                    href: "https://youtube.com",
                                },
                            ].map((social) => (
                                <motion.div
                                    key={social.label}
                                    variants={{
                                        hidden: { opacity: 0, y: 12 },
                                        visible: { opacity: 1, y: 0 },
                                    }}
                                    transition={{
                                        duration: 0.3,
                                        ease: [0.25, 0.1, 0.25, 1],
                                    }}
                                >
                                    <a
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center bg-black text-white font-cool text-[48px] leading-none uppercase no-underline"
                                    >
                                        {social.label}
                                    </a>
                                </motion.div>
                            ))}
                        </div>
                        <motion.div
                            className="mt-auto"
                            variants={{
                                hidden: { opacity: 0, y: 12 },
                                visible: { opacity: 1, y: 0 },
                            }}
                            transition={{
                                duration: 0.3,
                                ease: [0.25, 0.1, 0.25, 1],
                            }}
                        >
                            <Link
                                href="/contact"
                                className={`flex items-center justify-end font-cool text-[48px] leading-none uppercase no-underline transition-colors duration-200 ${
                                    isActive("/contact")
                                        ? "bg-brown text-yellow"
                                        : "bg-black text-white hover:bg-brown hover:text-yellow"
                                }`}
                                onClick={() => setMenuOpen(false)}
                            >
                                GET IN TOUCH
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
