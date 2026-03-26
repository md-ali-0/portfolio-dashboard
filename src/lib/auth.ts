/* eslint-disable @typescript-eslint/no-unused-vars */
import config from "@/config";
import { cookies } from "next/headers";
import { LoginFormData } from "./auth-validation";

export async function verifyCredentials(credentials: LoginFormData) {
    try {
        const res = await fetch(`${config.host}/api/v1/auth/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        const result = await res.json();

        console.log(result);
        

        if (!result?.success) {
            return {
                success: false,
                message: result?.message || "Login failed",
            };
        }
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        if (result?.success)
            cookies().set("session", result?.data, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                path: "/",
                sameSite: "strict",
                expires: expiresAt,
            });

        return {
            success: true,
            message: "Login successful",
            data: result.data,
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Something went wrong. Please try again.",
        };
    }
}

export async function sendPasswordResetEmail(
    email: string
): Promise<{ success: boolean; message: string }> {
    try {
        const res = await fetch(`${config.host}/api/v1/auth/forget-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const result = await res.json();

        return {
            success: result.success,
            message: result.message || "Request failed",
        };
    } catch (error) {
        return {
            success: false,
            message: "Something went wrong. Please try again.",
        };
    }
}

export async function resetPassword(
    password: string,
    token: string
): Promise<{ success: boolean; message: string }> {
    try {
        const res = await fetch(`${config.host}/api/v1/auth/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({ password }),
        });

        const result = await res.json();

        return {
            success: result.success,
            message: result.message || "Reset failed",
        };
    } catch (error) {
        return {
            success: false,
            message: "Something went wrong. Please try again.",
        };
    }
}

export async function changePassword(
    payload: { oldPassword: string, newPassword: string }
): Promise<{ success: boolean; message: string }> {
    try {
        const session = cookies().get("session")?.value;
        const res = await fetch(`${config.host}/api/v1/auth/change-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": session || ""
            },
            body: JSON.stringify(payload),
        });

        const result = await res.json();

        return {
            success: result.success,
            message: result.message || "Password change failed",
        };
    } catch (error) {
        return {
            success: false,
            message: "Something went wrong. Please try again.",
        };
    }
}
