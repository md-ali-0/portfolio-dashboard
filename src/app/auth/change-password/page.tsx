import ChangePasswordForm from "@/components/auth/change-password-form";
import { notFound } from "next/navigation";

interface ChangePasswordPageProps {
    token: string;
}

const ChangePasswordPage = async ({
    searchParams,
}: {
    searchParams: ChangePasswordPageProps;
}) => {
    const { token } = searchParams;

    if (!token) {
        notFound();
    }

    return (
        <div className="dark min-h-screen flex flex-col items-center justify-center py-5 px-4" style={{ background: '#111113' }}>
            <div className="relative max-w-md w-full">
                <ChangePasswordForm token={token} />
            </div>
        </div>
    );
};

export default ChangePasswordPage;
