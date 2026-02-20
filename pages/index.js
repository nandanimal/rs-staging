import Hero from "@/components/Hero";
import AboutUs from "@/components/AboutUs";
import ProjectsGrid from "@/components/ProjectsGrid";
import { client } from "@/sanity/lib/client";
import { allProjectsQuery } from "@/sanity/lib/queries";

export async function getStaticProps() {
    const projects = await client.fetch(allProjectsQuery);
    const featuredProjects = projects.filter((p) => p.featured);
    return {
        props: { projects, featuredProjects },
        revalidate: 60,
    };
}

export default function Home({ projects, featuredProjects }) {
    return (
        <>
            <div className="">
                <Hero projects={featuredProjects} />
            </div>
            <div id="projects" className="bg-[#fdf9f1] relative text-black modern-padding pt-[86px] md:pt-[147px]">
                <h2 className="font-cool text-[72px] md:text-[144px] leading-[0.79] uppercase text-black pb-0 mb-[40px] md:mb-[73px] font-normal page-header">
                    Projects
                </h2>
                <ProjectsGrid projects={projects} />
            </div>
            <AboutUs />
        </>
    );
}
