import { client } from "@/sanity/lib/client";
import { allProjectsQuery } from "@/sanity/lib/queries";
import ProjectsGrid from "@/components/ProjectsGrid";

export default function ProjectsPage({ projects }) {
    return (
        <div className="bg-[#fdf9f1] min-h-screen relative text-black modern-padding pt-[86px] md:pt-[147px]">
            <h1 className="font-cool text-[72px] md:text-[144px] leading-[0.79] uppercase text-black pb-0 mb-[40px] md:mb-[73px] font-normal page-header">
                Projects
            </h1>
            <ProjectsGrid projects={projects} />
        </div>
    );
}

export async function getStaticProps() {
    const projects = await client.fetch(allProjectsQuery);
    return {
        props: { projects },
        revalidate: 60,
    };
}
