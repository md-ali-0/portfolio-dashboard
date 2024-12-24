"use client";

import { useResetPasswordMutation } from "@/redux/features/auth/authApi";
import { ErrorResponse } from "@/types";
import { SerializedError } from "@reduxjs/toolkit";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "../ui/input";

interface FormValues {
    newPassword: string;
}

interface ResetPasswordFormProps {
    id: string | null;
    verification_code: string | null;
}

const ResetPasswordForm: FC<ResetPasswordFormProps> = ({ id, verification_code }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();
    const router = useRouter()
    const [resetPassword, { isSuccess, isError, error }] = useResetPasswordMutation();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (isError) {
            const errorResponse = error as ErrorResponse | SerializedError;
            const errorMessage =
                (errorResponse as ErrorResponse)?.data?.message ||
                "Something went wrong";
            toast.error(errorMessage);
        }
        if (isSuccess) {
            toast.success("Password reset successfully.");
            router.push('/auth/signin')
        }
    }, [error, isError, isSuccess, router]);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setLoading(true);
        try {
            if (!id || !verification_code) {
                toast.error("Invalid request. Missing id or token.");
                return;
            }
            await resetPassword({
                id,
                newPassword: data.newPassword,
                verification_code,
            }).unwrap();
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-5">
                <label htmlFor="newPassword" className="block text-sm font-medium mb-3">
                    New Password
                </label>
                <Input
                    type="password"
                    placeholder="Enter your new password"
                    className="w-full border h-auto py-3 px-6 text-base text-muted-foreground outline-none focus-visible:shadow-none focus:border-primary transition"
                    {...register("newPassword", {
                        required: "New password is required",
                        minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                        },
                    })}
                />
                {errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.newPassword.message}
                    </p>
                )}
            </div>
            <div className="mb-5">
                <button className="w-full flex items-center justify-center font-medium text-white bg-primary py-4 px-9 hover:shadow-signUp rounded-sm transition duration-300 ease-in-out">
                    
                    {loading ? "Changing Password..." : "Change Password"}
                </button>
            </div>
        </form>
    );
};

export default ResetPasswordForm;
