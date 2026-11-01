import type { Metadata } from "next";
import WorkExplorer from "@/components/work/WorkExplorer";
import { getProjects } from "@/lib/data";

export const metadata: Metadata = { title: "Work" };

export default async function WorkPage() {
  const projects = await getProjects();
  return <WorkExplorer projects={projects} />;
}
