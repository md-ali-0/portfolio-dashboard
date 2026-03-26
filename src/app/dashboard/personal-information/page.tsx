import PersonalInformationForm from "@/components/dashboard-forms/personal-information";
import Breadcrumb from "@/components/shared/breadcrumb";

export default async function CreateReview () {
    
    return (
        <div>
            <Breadcrumb />
            <div className="rounded-xl border border-border bg-card mt-5 shadow-sm overflow-hidden">
                <div className="flex justify-between items-center border-b border-border px-7 py-4">
                    <h3 className="font-semibold text-foreground">
                        Personal Information
                    </h3>
                </div>
                <div className="p-7">
                    <PersonalInformationForm />
                </div>
            </div>
        </div>
    );
}
