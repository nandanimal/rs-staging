import { useState } from "react";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { allEventsQuery } from "@/sanity/lib/queries";

function formatEventDate(dateStr) {
    const d = new Date(dateStr);
    const month = d.toLocaleString("en-US", { month: "short" });
    const day = d.getDate();
    const year = d.getFullYear();
    const ordinal =
        day === 1 || day === 21 || day === 31
            ? "st"
            : day === 2 || day === 22
              ? "nd"
              : day === 3 || day === 23
                ? "rd"
                : "th";
    return { month, day, ordinal, year };
}

function TicketLink({ event }) {
    return (
        <div className="relative inline-block">
            <a
                href={event.soldOut ? undefined : event.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center font-cool text-[21.6px] leading-[0.75] uppercase text-black no-underline ${event.soldOut ? "opacity-40 pointer-events-none" : ""}`}
            >
                <span>tickets</span>
            </a>
            {event.soldOut && (
                <span
                    className="absolute top-[18px] left-[8px] font-cool text-[18px] uppercase text-black bg-pink px-[2px] rotate-[-6.28deg] origin-top-left w-fit"
                    style={{ whiteSpace: "nowrap" }}
                >
                    sold out
                </span>
            )}
        </div>
    );
}

function EventRowDesktop({ event }) {
    const { month, day, ordinal, year } = formatEventDate(event.date);
    const dateDisplay = `${month} ${day}${ordinal}, ${year}`;
    const timeDisplay = event.startTime ? ` | ${event.startTime}` : "";

    const handleClick = () => {
        if (event.ticketUrl) {
            window.open(event.ticketUrl, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <div
            className="grid grid-cols-[3fr_5fr_4fr_auto] border-t border-black hover:bg-pink transition-colors min-h-[258px] cursor-pointer"
            onClick={handleClick}
        >
            <div className="p-px">
                {event.coverPhoto ? (
                    <img
                        className="w-full h-[256px] object-cover block"
                        src={urlFor(event.coverPhoto)
                            .width(560)
                            .height(512)
                            .url()}
                        alt={event.title}
                    />
                ) : (
                    <div className="w-full h-[256px] bg-black/5" />
                )}
            </div>
            <div className="border-l border-black p-px flex flex-col justify-between">
                <div className="flex flex-col gap-[10px]">
                    <p className="font-prov text-lg leading-normal uppercase">
                        {dateDisplay}
                        {timeDisplay}
                    </p>
                    <p className="font-cool text-[32px] leading-[0.96] uppercase">
                        {event.title}
                    </p>
                </div>
                <div className="flex flex-col gap-[10px] text-[18px] leading-none">
                    {event.venue && <p className="m-0">{event.venue}</p>}
                    {event.city && (
                        <div className="flex items-center gap-[6px]">
                            <img
                                src="/images/pin.svg"
                                className="w-[16px] h-[27px] shrink-0"
                                alt=""
                            />
                            <span>{event.city}</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="border-l border-black px-px text-[18px] leading-none text-justify">
                {event.description && <p>{event.description}</p>}
            </div>
            <div className="border-l border-black p-px min-w-[120px]">
                <TicketLink event={event} />
            </div>
        </div>
    );
}

function EventCardMobile({ event }) {
    const [expanded, setExpanded] = useState(false);
    const { month, day, ordinal, year } = formatEventDate(event.date);
    const dateDisplay = `${month} ${day}${ordinal}, ${year}`;
    const timeDisplay = event.startTime ? ` | ${event.startTime}` : "";
    const descPreview =
        event.description && event.description.length > 100
            ? event.description.slice(0, 100) + "..."
            : event.description;

    return (
        <div className="border-t border-black ">
            <div className="">
                {event.coverPhoto ? (
                    <img
                        className="w-full h-[256px] object-cover block"
                        src={urlFor(event.coverPhoto)
                            .width(750)
                            .height(512)
                            .url()}
                        alt={event.title}
                    />
                ) : (
                    <div className="w-full h-[256px] bg-black/5" />
                )}
            </div>
            <div className="border-x border-t border-black p-px flex flex-col gap-[10px]">
                <p className="font-prov text-[21.6px] leading-normal uppercase">
                    {dateDisplay}
                    {timeDisplay}
                </p>
                <p className="font-cool text-[32px] leading-[0.96] uppercase">
                    {event.title}
                </p>
                {event.venue && (
                    <p className="text-[18px] leading-none">{event.venue}</p>
                )}
                <div className="flex items-center gap-[6px] text-[18px] leading-none">
                    <img
                        src="/images/pin.svg"
                        className="w-[16px] h-[27px] shrink-0"
                        alt=""
                    />
                    <span>{event.city}</span>
                </div>
            </div>
            {event.description && (
                <div className="border-x border-t border-black p-px text-[18px] leading-none text-justify">
                    <p>{expanded ? event.description : descPreview}</p>
                    {event.description.length > 100 && (
                        <button
                            className="block mt-[10px] text-[18px] leading-none bg-transparent border-none p-0 cursor-pointer text-black"
                            onClick={() => setExpanded(!expanded)}
                        >
                            {expanded ? "- Show less" : "+ Show more"}
                        </button>
                    )}
                </div>
            )}
            <div className="border border-black p-px">
                <TicketLink event={event} />
            </div>
        </div>
    );
}

function EmptyState() {
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className="pb-[48px] relative min-h-screen">
            <p className="page-header font-prov text-[14px] md:text-[18px] leading-none text-left md:text-justify mb-[16px] md:mb-[22px]">
                No upcoming events currently scheduled.
            </p>
            <h1 className=" font-cool text-[72px] md:text-[144px] leading-[0.79] uppercase text-black m-0 font-normal max-w-[954px]">
                Be the first to know.
            </h1>
            <form
                className="mt-[100px] md:mt-[280px] pl-[3px] md:pl-[28px]"
                onSubmit={handleSubmit}
            >
                <div className="border-l border-black pl-[24px] min-h-[38px] md:min-h-[150px] flex items-end">
                    <input
                        type="email"
                        className="font-cool text-[36px] md:text-[144px] leading-[0.79] uppercase text-black bg-transparent border-0 border-b border-black w-full pb-[6px] md:pb-[12px] outline-none placeholder:text-black placeholder:opacity-10"
                        placeholder="your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="block ml-auto mt-[8px] font-cool text-[24px] uppercase text-white bg-black border-none p-0 cursor-pointer leading-normal"
                >
                    submit
                </button>
            </form>
        </div>
    );
}

export default function EventsPage({ events }) {
    const hasEvents = events && events.length > 0;

    return (
        <div className="bg-yellow min-h-screen relative text-black modern-padding pt-[86px] md:pt-[148px] ">
            {hasEvents ? (
                <>
                    <h1 className="page-header font-cool text-[72px] md:text-[144px] leading-[0.79] uppercase text-black pb-0 mb-[40px] md:mb-[73px] font-normal max-w-[455px] md:max-w-[954px]">
                        upcoming events
                    </h1>

                    {/* Desktop */}
                    <div className="hidden md:flex md:flex-col mb-24">
                        {events.map((event) => (
                            <EventRowDesktop key={event._id} event={event} />
                        ))}
                    </div>

                    {/* Mobile */}
                    <div className="flex flex-col gap-[40px] md:hidden mb-24">
                        {events.map((event) => (
                            <EventCardMobile key={event._id} event={event} />
                        ))}
                    </div>
                </>
            ) : (
                <EmptyState />
            )}
        </div>
    );
}

export async function getStaticProps() {
    const events = await client.fetch(allEventsQuery);
    return {
        props: { events },
        revalidate: 60,
    };
}
