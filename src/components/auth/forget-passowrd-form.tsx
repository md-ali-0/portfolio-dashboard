"use client";

import { useForgetPasswordMutation } from "@/redux/features/auth/authApi";
import { forgotPasswordSchema } from "@/schema/forgot-password.schema";
import { ErrorResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SerializedError } from "@reduxjs/toolkit";
import { ArrowLeft, Mail, SendHorizonal } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";

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
        defaultValues: { email: "", password: "", rememberMe: false },
    });

    const [forgotPassword, { isSuccess, isError, error }] = useForgetPasswordMutation();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isError) {
            const errorResponse = error as ErrorResponse | SerializedError;
            const errorMessage = (errorResponse as ErrorResponse)?.data?.message || "Something Went Wrong";
            toast.error(errorMessage);
        }
        if (isSuccess) toast.success("Check your email to reset password.");
    }, [error, isError, isSuccess]);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setLoading(true);
        await forgotPassword(data);
        setLoading(false);
    };

    return (
        <div
            className="w-full rounded-2xl p-8 shadow-2xl"
            style={{ background: '#1c1c1e', border: '1px solid rgba(255,255,255,0.08)' }}
        >
            {/* Header */}
            <div className="flex flex-col items-center mb-6">
                <div
                    className="flex items-center justify-center w-16 h-16 rounded-full mb-5"
                    style={{ background: '#2c2c2e', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                    <Mail className="w-7 h-7 text-gray-300" />
                </div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Forgot password?</h2>
                <p className="text-sm mt-1 text-center" style={{ color: '#8e8e93' }}>
                    We&apos;ll send a reset link to your email
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium" style={{ color: '#aeaeb2' }}>Email Address</label>
                    <input
                        {...register("email")}
                        type="email"
                        placeholder="Enter your email..."
                        className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-all"
                        style={{
                            background: '#2c2c2e',
                            border: errors.email ? '1px solid #ff453a' : '1px solid rgba(255,255,255,0.1)',
                            color: 'white',
                        }}
                        onFocus={(e) => { if (!errors.email) e.currentTarget.style.border = '1px solid rgba(255,255,255,0.3)'; }}
                        onBlur={(e) => { if (!errors.email) e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'; }}
                    />
                    {errors.email && <p className="text-xs" style={{ color: '#ff453a' }}>{errors.email.message}</p>}
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-lg text-sm font-semibold text-white border-0 transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2"
                    style={{ background: '#3a3a3c' }}
                >
                    <SendHorizonal className="w-4 h-4" />
                    {loading ? "Sending..." : "Send Reset Link"}
                </Button>

                <div className="text-center">
                    <Link href="/auth/signin" className="inline-flex items-center gap-1.5 text-sm transition-colors hover:text-white" style={{ color: '#8e8e93' }}>
                        <ArrowLeft className="w-4 h-4" />
                        Back to sign in
                    </Link>
                </div>
            </form>
        </div>
    );
}
