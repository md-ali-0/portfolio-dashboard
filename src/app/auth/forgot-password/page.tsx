import ForgetPassowrdForm from "@/components/auth/forget-passowrd-form";
import { FC } from "react";

const ForgotPassword: FC = () => {
    return (
        <div className="dark min-h-screen flex flex-col items-center justify-center py-5 px-4" style={{ background: '#111113' }}>
            <div className="relative max-w-md w-full">
                <ForgetPassowrdForm />
            </div>
        </div>
    );
};

export default ForgotPassword;
