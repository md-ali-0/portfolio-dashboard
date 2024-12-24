"use client";

import { useForgetPasswordMutation } from "@/redux/features/auth/authApi";
import { forgotPasswordSchema } from "@/schema/forgot-password.schema";
import { ErrorResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SerializedError } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
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
    const [forgotPassword, { isSuccess, isError, error }] = useForgetPasswordMutation();

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
        await forgotPassword(data)
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-y-4">
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-bold ml-1 mb-2 dark:text-white"
                    >
                        Email address
                    </label>
                    <div className="relative">
                        <Input
                            type="email"
                            placeholder="Enter your Email"
                            className="w-full border h-auto py-3 px-6 text-base text-muted-foreground outline-none focus-visible:shadow-none focus:border-primary transition"
                            {...register("email")}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.email.message}
                        </p>
                    )}
                </div>
                <button
                    disabled={loading}
                    className="w-full bg-primary text-white py-4 rounded-sm"
                >
                    {loading ? "Sending Verification Email.." : "Send Verification Email"}
                </button>
            </div>
        </form>
    );
}
