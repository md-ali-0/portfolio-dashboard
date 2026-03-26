import ProjectForm from "@/components/dashboard-forms/project-form";
import Breadcrumb from "@/components/shared/breadcrumb";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FC } from "react";

const CreateReview: FC = () => {
    return (
        <div>
            <Breadcrumb />
            <div className="rounded-sm border bg-white dark:bg-gray-900 mt-5">
                <div className="flex justify-between items-center border-b px-7 py-4">
                    <h3 className="font-medium text-black dark:text-white">
                        Create New Project
                    </h3>
                    <Button asChild variant={'default'} size={'sm'}>
                        <Link href={"/dashboard/projects"}>Manage Projects</Link>
                    </Button>
                </div>
                <div className="p-7">
                    <ProjectForm />
                </div>
            </div>
        </div>
    );
}

export default CreateReview;