"use client";

import { Input } from "@/components/ui/input";
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";
import { ErrorResponse } from "@/types";
import { SerializedError } from "@reduxjs/toolkit";
import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface FormValues {
    newPassword: string;
}

interface ChangePasswordFormProps {
    token: string | null;
}

const ChangePasswordForm: FC<ChangePasswordFormProps> = ({ token }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();
    const router = useRouter();
    const [resetPassword, { isSuccess, isError, error }] =
        useResetPasswordMutation();

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
            router.push("/auth/signin");
        }
    }, [error, isError, isSuccess, router]);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            if (!token) {
                toast.error("Invalid request. Missing id or token.");
                return;
            }
            await resetPassword({
                password: data.newPassword,
                token,
            }).unwrap();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="p-8 rounded-2xl bg-white border">
            <h2 className="text-gray-800 text-center text-2xl font-bold">
                Change Password
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
                <div>
                    <label className="text-gray-800 text-sm mb-2 block">
                        New Password
                    </label>
                    <div>
                        <Input
                            {...register("newPassword", {
                                required: "New password is required",
                                minLength: {
                                    value: 6,
                                    message:
                                        "Password must be at least 6 characters",
                                },
                            })}
                            type="password"
                            placeholder="Enter your password"
                            className={
                                errors.newPassword ? "border-red-500" : ""
                            }
                        />
                        {errors.newPassword && (
                            <span className="text-red-500 text-sm">
                                {errors.newPassword.message}
                            </span>
                        )}
                    </div>
                </div>

                <div className="!mt-8">
                    <Button type="submit" className="w-full">
                        Change Password
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ChangePasswordForm;
