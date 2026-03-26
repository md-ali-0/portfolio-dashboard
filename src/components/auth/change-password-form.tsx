"use client";

import { useResetPasswordMutation } from "@/redux/features/auth/authApi";
import { ErrorResponse } from "@/types";
import { SerializedError } from "@reduxjs/toolkit";
import { Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface FormValues {
    newPassword: string;
    confirmPassword: string;
}

interface ChangePasswordFormProps {
    token: string | null;
}

const ChangePasswordForm: FC<ChangePasswordFormProps> = ({ token }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>();
    const router = useRouter();
    const [resetPassword, { isSuccess, isError, error }] = useResetPasswordMutation();

    useEffect(() => {
        if (isError) {
            const errorResponse = error as ErrorResponse | SerializedError;
            toast.error((errorResponse as ErrorResponse)?.data?.message || "Something went wrong");
        }
        if (isSuccess) {
            toast.success("Password reset successfully.");
            router.push("/auth/signin");
        }
    }, [error, isError, isSuccess, router]);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            if (!token) { toast.error("Invalid request. Missing token."); return; }
            await resetPassword({ password: data.newPassword, token }).unwrap();
        } catch (e) { console.log(e); }
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
                    <KeyRound className="w-7 h-7 text-gray-300" />
                </div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Set new password</h2>
                <p className="text-sm mt-1" style={{ color: '#8e8e93' }}>Choose a strong password</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* New password */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium" style={{ color: '#aeaeb2' }}>New Password</label>
                    <div className="relative">
                        <input
                            {...register("newPassword", {
                                required: "Password is required",
                                minLength: { value: 6, message: "Must be at least 6 characters" },
                            })}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••••"
                            className="w-full rounded-lg px-4 py-2.5 pr-10 text-sm outline-none transition-all"
                            style={{
                                background: '#2c2c2e',
                                border: errors.newPassword ? '1px solid #ff453a' : '1px solid rgba(255,255,255,0.1)',
                                color: 'white',
                            }}
                            onFocus={(e) => { if (!errors.newPassword) e.currentTarget.style.border = '1px solid rgba(255,255,255,0.3)'; }}
                            onBlur={(e) => { if (!errors.newPassword) e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'; }}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#636366' }}>
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.newPassword && <p className="text-xs" style={{ color: '#ff453a' }}>{errors.newPassword.message}</p>}
                </div>

                {/* Confirm password */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium" style={{ color: '#aeaeb2' }}>Confirm Password</label>
                    <div className="relative">
                        <input
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                                validate: (val) => val === watch("newPassword") || "Passwords do not match",
                            })}
                            type={showConfirm ? "text" : "password"}
                            placeholder="••••••••••"
                            className="w-full rounded-lg px-4 py-2.5 pr-10 text-sm outline-none transition-all"
                            style={{
                                background: '#2c2c2e',
                                border: errors.confirmPassword ? '1px solid #ff453a' : '1px solid rgba(255,255,255,0.1)',
                                color: 'white',
                            }}
                            onFocus={(e) => { if (!errors.confirmPassword) e.currentTarget.style.border = '1px solid rgba(255,255,255,0.3)'; }}
                            onBlur={(e) => { if (!errors.confirmPassword) e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'; }}
                        />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#636366' }}>
                            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.confirmPassword && <p className="text-xs" style={{ color: '#ff453a' }}>{errors.confirmPassword.message}</p>}
                </div>

                <Button
                    type="submit"
                    className="w-full py-2.5 rounded-lg text-sm font-semibold text-white border-0 transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2"
                    style={{ background: '#3a3a3c' }}
                >
                    <ShieldCheck className="w-4 h-4" />
                    Reset Password
                </Button>
            </form>
        </div>
    );
};

export default ChangePasswordForm;
