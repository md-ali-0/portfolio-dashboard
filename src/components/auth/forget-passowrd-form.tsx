"use client";

import { useForgetPasswordMutation } from "@/redux/features/auth/authApi";
import { forgotPasswordSchema } from "@/schema/forgot-password.schema";
import { ErrorResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SerializedError } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface FormValues {
    email: string;
    password: string;
    rememberMe: boolean;
}
export default function ForgetPassowrdForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });
    const [forgotPassword, { isSuccess, isError, error }] =
        useForgetPasswordMutation();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isError) {
            const errorResponse = error as ErrorResponse | SerializedError;

            const errorMessage =
                (errorResponse as ErrorResponse)?.data?.message ||
                "Something Went Wrong";

            toast.error(errorMessage);
        }
        if (isSuccess) {
            toast.success("Check your email to reset password.");
        }
    }, [error, isError, isSuccess]);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setLoading(true);
        await forgotPassword(data);
        setLoading(false);
    };

    return (
        <div className="p-8 rounded-2xl bg-white border">
            <h2 className="text-gray-800 text-center text-2xl font-bold">
                Forgot your password?
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
                <div>
                    <label className="text-gray-800 text-sm mb-2 block">
                        Email address
                    </label>
                    <div>
                        <Input
                            {...register("email")}
                            type="email"
                            placeholder="Enter your email"
                            className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && (
                            <span className="text-red-500 text-sm">
                                {errors.email.message}
                            </span>
                        )}
                    </div>
                </div>

                <div className="!mt-8">
                    <Button type="submit" disabled={loading} className="w-full">
                        {loading
                            ? "Sending Verification Email.."
                            : "Send Verification Email"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
