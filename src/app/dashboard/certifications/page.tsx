import AboutSectionForm from "@/components/dashboard-forms/about-section-form";
import Breadcrumb from "@/components/shared/breadcrumb";

export default function CertificationsPage() {
    return (
        <div>
            <Breadcrumb />
            <div className="rounded-xl border border-border bg-card mt-5 shadow-sm overflow-hidden">
                <div className="border-b border-border px-7 py-4">
                    <h3 className="font-semibold text-foreground">
                        Manage Certifications
                    </h3>
                </div>
                <div className="p-7">
                    <AboutSectionForm
                        sectionType="certifications"
                        title="Certification"
                        description="Manage the professional certifications shown on the about page."
                    />
                </div>
            </div>
        </div>
    );
}
