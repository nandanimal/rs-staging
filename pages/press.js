import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { allArticlesQuery } from "@/sanity/lib/queries";

function FeaturedCard({ article }) {
    const year = new Date(article.date).getFullYear();
    const imageUrl = article.coverPhoto
        ? urlFor(article.coverPhoto).width(1600).height(900).quality(85).url()
        : null;

    return (
        <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-px no-underline group"
        >
            <div className="flex flex-col gap-[4px] uppercase w-full">
                <span className="font-cool text-[18px] md:text-[22px] leading-none text-black">
                    {article.source}
                </span>
                <div className="flex gap-[2px] items-start bg-black w-full">
                    <span className="font-cool text-[18px] md:text-[22px] leading-none text-white truncate min-w-0">
                        {article.title}
                    </span>
                    <span className="font-prov text-xs text-white shrink-0">
                        [{year}]
                    </span>
                </div>
            </div>
            <div
                className="relative w-full overflow-hidden"
                style={{ aspectRatio: "16 / 9" }}
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover block"
                    />
                ) : (
                    <div className="w-full h-full bg-black/10" />
                )}
            </div>
        </a>
    );
}

function SmallCard({ article }) {
    const year = new Date(article.date).getFullYear();
    const imageUrl = article.coverPhoto
        ? urlFor(article.coverPhoto).width(800).height(450).quality(80).url()
        : null;

    return (
        <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-px no-underline group"
        >
            <div className="flex flex-col gap-[4px] uppercase w-full">
                <span className="font-cool text-[22px] leading-none text-black">
                    {article.source}
                </span>
                <div className="flex gap-[2px] items-start bg-black w-full">
                    <span className="font-cool text-[22px] leading-none text-white truncate min-w-0">
                        {article.title}
                    </span>
                    <span className="font-prov text-[8px] text-white shrink-0">
                        [{year}]
                    </span>
                </div>
            </div>
            <div
                className="relative w-full overflow-hidden"
                style={{ aspectRatio: "16 / 9" }}
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover block"
                    />
                ) : (
                    <div className="w-full h-full bg-black/10" />
                )}
            </div>
        </a>
    );
}

function MobileListItem({ article }) {
    const date = new Date(article.date);
    const formatted = `${date.getMonth() + 1}/${date.getDate()}/${String(date.getFullYear()).slice(2)}`;

    return (
        <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-[16px] border-t border-black p-[8px] no-underline uppercase text-black"
        >
            <div className="flex flex-col gap-[16px]">
                <span className="font-prov text-[12px] leading-none">
                    {formatted}
                </span>
                <span className="font-cool text-[18px] leading-[0.96]">
                    {article.source}
                </span>
            </div>
            <p className="font-cool text-[32px] leading-[0.96] m-0">
                &ldquo;{article.title}&rdquo;
            </p>
        </a>
    );
}

export default function PressPage({ articles }) {
    const featured = articles.slice(0, 2);
    const rest = articles.slice(2);

    return (
        <div className="bg-blue min-h-screen text-black modern-padding pt-[86px] md:pt-[147px]">
            <h1 className="page-header font-cool text-[72px] md:text-[144px] leading-[0.79] uppercase text-black pb-0 mb-[40px] md:mb-[48px] font-normal">
                Latest
            </h1>

            {/* Desktop layout */}
            <div className="hidden md:block pb-[80px]">
                {/* Featured 2-col */}
                <div className="grid grid-cols-2 gap-[16px] mb-[48px]">
                    {featured.map((article) => (
                        <FeaturedCard key={article._id} article={article} />
                    ))}
                </div>

                {/* Remaining 3-col */}
                {rest.length > 0 && (
                    <div className="grid grid-cols-3 gap-[16px]">
                        {rest.map((article) => (
                            <SmallCard key={article._id} article={article} />
                        ))}
                    </div>
                )}
            </div>

            {/* Mobile layout */}
            <div className="md:hidden">
                {/* Featured card */}
                <div className="mb-[40px]">
                    {featured[0] && <FeaturedCard article={featured[0]} />}
                </div>

                {/* Text-only list */}
                <div className="flex flex-col">
                    {articles.slice(1).map((article) => (
                        <MobileListItem key={article._id} article={article} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export async function getStaticProps() {
    const articles = await client.fetch(allArticlesQuery);
    return {
        props: { articles },
        revalidate: 60,
    };
}
