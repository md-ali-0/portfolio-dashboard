'use client'

import { Button } from "@/components/ui/button";
import { useSession } from "@/provider/session-provider";
import { signin } from "@/service/auth";
import { Eye, EyeOff, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

interface FormValues {
    email: string;
    password: string;
    rememberMe: boolean;
}

const SignInForm: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>();

    const router = useRouter();
    const { setIsLoading } = useSession();

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        const response = await signin(data);
        setIsLoading(true);
        if (response.success) {
            toast.success("Logged in successfully");
            router.push("/dashboard");
            localStorage.setItem('accessToken', response.data);
        } else {
            toast.error(response?.message);
        }
    };

    return (
        <div
            className="w-full rounded-2xl p-8 shadow-2xl"
            style={{ background: '#1c1c1e', border: '1px solid rgba(255,255,255,0.08)' }}
        >
            {/* Avatar icon */}
            <div className="flex flex-col items-center mb-6">
                <div
                    className="flex items-center justify-center w-16 h-16 rounded-full mb-5"
                    style={{ background: '#2c2c2e', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                    <UserCircle2 className="w-8 h-8 text-gray-300" />
                </div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">Welcome back</h2>
                <p className="text-sm mt-1" style={{ color: '#8e8e93' }}>
                    Please enter your information to sign in
                </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium" style={{ color: '#aeaeb2' }}>Email Address</label>
                    <input
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Invalid email address",
                            },
                        })}
                        type="email"
                        placeholder="Enter your email..."
                        className="w-full rounded-lg px-4 py-2.5 text-sm text-white outline-none transition-all"
                        style={{
                            background: '#2c2c2e',
                            border: errors.email ? '1px solid #ff453a' : '1px solid rgba(255,255,255,0.1)',
                            color: 'white',
                        }}
                        onFocus={(e) => { if (!errors.email) e.currentTarget.style.border = '1px solid rgba(255,255,255,0.3)'; }}
                        onBlur={(e) => { if (!errors.email) e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'; }}
                    />
                    {errors.email && (
                        <p className="text-xs" style={{ color: '#ff453a' }}>{errors.email.message}</p>
                    )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium" style={{ color: '#aeaeb2' }}>Password</label>
                    <div className="relative">
                        <input
                            {...register("password", {
                                required: "Password is required",
                                minLength: { value: 6, message: "Must be at least 6 characters" },
                            })}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••••"
                            className="w-full rounded-lg px-4 py-2.5 pr-10 text-sm text-white outline-none transition-all"
                            style={{
                                background: '#2c2c2e',
                                border: errors.password ? '1px solid #ff453a' : '1px solid rgba(255,255,255,0.1)',
                                color: 'white',
                            }}
                            onFocus={(e) => { if (!errors.password) e.currentTarget.style.border = '1px solid rgba(255,255,255,0.3)'; }}
                            onBlur={(e) => { if (!errors.password) e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'; }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                            style={{ color: '#636366' }}
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-xs" style={{ color: '#ff453a' }}>{errors.password.message}</p>
                    )}
                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Checkbox id="remember-me" {...register("rememberMe")} />
                        <Label htmlFor="remember-me" className="text-sm cursor-pointer" style={{ color: '#8e8e93' }}>
                            Keep me signed in
                        </Label>
                    </div>
                    <Link href="/auth/forgot-password" className="text-sm underline underline-offset-2 transition-colors hover:text-white" style={{ color: '#8e8e93' }}>
                        Forgot Password?
                    </Link>
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-lg text-sm font-semibold text-white border-0 transition-all hover:opacity-90 active:scale-[0.98]"
                    style={{ background: '#3a3a3c' }}
                >
                    {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
            </form>
        </div>
    );
};

export default SignInForm;
