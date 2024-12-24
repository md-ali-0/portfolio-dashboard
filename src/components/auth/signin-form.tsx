'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/provider/session-provider";
import { signin } from "@/service/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
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
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();

    const router = useRouter();


    const { setIsLoading } = useSession()
    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        const response = await signin(data);
        setIsLoading(true)

        if (response.success) {
            toast.success("User Logged In Successfully");
            router.push("/dashboard");
            localStorage.setItem('accessToken', response.data)
        } else {
            toast.error(response?.message);
        }
    };

    return (
        <div className="p-8 rounded-2xl bg-white border">
            <h2 className="text-gray-800 text-center text-2xl font-bold">
                Sign in
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
                <div>
                    <label className="text-gray-800 text-sm mb-2 block">Email</label>
                    <div>
                        <Input
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Invalid email address",
                                },
                            })}
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
                <div>
                    <label className="text-gray-800 text-sm mb-2 block">Password</label>
                    <div>
                        <Input
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters",
                                },
                            })}
                            type="password"
                            placeholder="Enter your password"
                            className={errors.password ? "border-red-500" : ""}
                        />
                        {errors.password && (
                            <span className="text-red-500 text-sm">
                                {errors.password.message}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                    <Checkbox id="remember-me" {...register("rememberMe")} />
                    <Label htmlFor="remember-me" className="ml-2 block text-sm">
                        Keep me signed in
                    </Label>
                </div>
                    <div className="text-sm">
                        <Link href="/auth/forgot-password" className="text-primary hover:underline font-semibold">
                            Forgot your password?
                        </Link>
                    </div>
                </div>

                <div className="!mt-8">
                    <Button type="submit" className="w-full">
                        Sign in
                    </Button>
                </div>

                <p className="text-gray-800 text-sm !mt-8 text-center">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/auth/signup"
                        className="text-primary hover:underline ml-1 whitespace-nowrap font-semibold"
                    >
                        Register here
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default SignInForm;
