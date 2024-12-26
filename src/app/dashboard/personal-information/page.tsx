import PersonalInformationForm from "@/components/dashboard-forms/personal-information";
import Breadcrumb from "@/components/shared/breadcrumb";

export default async function CreateReview () {
    
    return (
        <div>
            <Breadcrumb />
            <div className="rounded-sm border bg-white dark:bg-gray-900 mt-5">
                <div className="flex justify-between items-center border-b px-7 py-4">
                    <h3 className="font-medium text-black dark:text-white">
                        My Personal Information
                    </h3>
                </div>
                <div className="p-7">
                    <PersonalInformationForm />
                </div>
            </div>
        </div>
    );
}