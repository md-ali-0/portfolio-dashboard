"use client";
import { useSignUpUserMutation } from "@/redux/features/auth/authApi";
import { SignupSchema } from "@/schema/signup.schema";
import { ErrorResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SerializedError } from "@reduxjs/toolkit";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface FormValues {
    name: string;
    email: string;
    password: string;
}

export default function SignupForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(SignupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const [signupUser, { isSuccess, isError, error }] = useSignUpUserMutation();
    const router = useRouter();

    useEffect(() => {
        if (isError) {
            const errorResponse = error as ErrorResponse | SerializedError;

            const errorMessage =
                (errorResponse as ErrorResponse)?.data?.message ||
                "Something Went Wrong";

            toast.error(errorMessage);
        }
        if (isSuccess) {
            toast.success("User Created Successfully");
            router.push("/auth/signin");
        }
    }, [error, isError, isSuccess, router]);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        await signupUser(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-8">
                <label
                    htmlFor="name"
                    className="mb-3 block text-sm text-dark dark:text-white"
                >
                    Full Name
                </label>
                <Input
                    placeholder="Enter your Name"
                    type="text"
                    className="w-full border h-auto py-3 px-6 text-base text-muted-foreground outline-none focus-visible:shadow-none focus:border-primary transition"
                    {...register("name", {
                        required: "Full Name is required",
                    })}
                />
                {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.name.message}
                    </p>
                )}
            </div>
            <div className="mb-8">
                <label
                    htmlFor="email"
                    className="mb-3 block text-sm text-dark dark:text-white"
                >
                    Your Email
                </label>
                <Input
                    placeholder="Enter your Email"
                    type="email"
                    className="w-full border h-auto py-3 px-6 text-base text-muted-foreground outline-none focus-visible:shadow-none focus:border-primary transition"
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message: "Invalid email address",
                        },
                    })}
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                    </p>
                )}
            </div>
            <div className="mb-8">
                <label
                    htmlFor="password"
                    className="mb-3 block text-sm text-dark dark:text-white"
                >
                    Your Password
                </label>
                <Input
                    placeholder="Enter your Password"
                    type="password"
                    {...register("password", {
                        required: "Password is required",
                    })}
                />
                {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.password.message}
                    </p>
                )}
            </div>
            <div className="flex items-center space-x-2 mb-8">
                <Checkbox id="remember-me" defaultChecked={true} />
                <Label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-muted-foreground"
                >
                    <span>
                        By creating account means you agree to the
                        <Link
                            href={"/page/terms-and-conditions"}
                            target="_blank"
                            className="text-primary hover:underline"
                        >
                            {" "}
                            Terms and Conditions{" "}
                        </Link>
                        , and our
                        <Link
                            href={"/page/privacy-policy"}
                            target="_blank"
                            className="text-primary hover:underline"
                        >
                            {" "}
                            Privacy Policy{" "}
                        </Link>
                    </span>
                </Label>
            </div>
            <div className="mb-6">
                <button className="shadow-submit dark:shadow-submit-dark flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90">
                    Sign Up
                </button>
            </div>
        </form>
    );
}
