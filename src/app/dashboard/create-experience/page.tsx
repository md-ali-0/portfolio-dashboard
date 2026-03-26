import ExperienceForm from "@/components/dashboard-forms/experience-form";
import Breadcrumb from "@/components/shared/breadcrumb";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function CreateExperiencePage() {
    return (
        <div>
            <Breadcrumb />
            <div className="rounded-xl border border-border bg-card mt-5 shadow-sm overflow-hidden">
                <div className="flex justify-between items-center border-b border-border px-7 py-4">
                    <h3 className="font-semibold text-foreground">
                        Create New Experience
                    </h3>
                    <Button asChild variant={"default"} size={"sm"}>
                        <Link href={"/dashboard/experience"}>Manage Experiences</Link>
                    </Button>
                </div>
                <div className="p-7">
                    <ExperienceForm />
                </div>
            </div>
        </div>
    );
}

