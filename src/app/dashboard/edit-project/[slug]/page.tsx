import EditProjectForm from "@/components/dashboard-forms/project-edit-form";
import Breadcrumb from "@/components/shared/breadcrumb";
import { Button } from "@/components/ui/button";
import config from "@/config";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditProjectPage( { params : {slug}} : {params: {slug: string}}) {

    const result = await fetch(`${config.host}/api/project/${slug}`, {
        cache: "no-store"
    })
    const project = await result.json()

    if (!project?.data) {
        return notFound()
    }

    return (
        <div>
            <Breadcrumb />
            <div className="rounded-xl border border-border bg-card mt-5 shadow-sm overflow-hidden">
                <div className="flex justify-between items-center border-b border-border px-7 py-4">
                    <h3 className="font-semibold text-foreground">
                        Edit Project
                    </h3>
                    <Button asChild variant={"default"} size={"sm"}>
                        <Link href={"/dashboard/projects"}>Manage Projects</Link>
                    </Button>
                </div>
                <div className="p-7">
                    <EditProjectForm project={project?.data} />
                </div>
            </div>
        </div>
    );
}
