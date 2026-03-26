import ForgetPassowrdForm from "@/components/auth/forget-passowrd-form";
import { FC } from "react";

const ForgotPassword: FC = () => {
    return (
        <div className="bg-gray-50">
            <div className="min-h-screen flex flex-col items-center justify-center py-5 px-4">
                <div className="max-w-md w-full">
                    <ForgetPassowrdForm />
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
