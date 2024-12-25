"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateLanguageMutation } from "@/redux/features/language/languageApi";
import { ErrorResponse } from "@/types";
import { SerializedError } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type LanguageFormValues = {
    name: string;
};

export default function LanguageForm() {
    const form = useForm<LanguageFormValues>({
        defaultValues: {
            name: "",
        },
    });

    const { reset } = form;

    const [addLanguage, { isSuccess, isLoading, isError, error }] =
        useCreateLanguageMutation();

    useEffect(() => {
        if (isError) {
            const errorResponse = error as ErrorResponse | SerializedError;

            const errorMessage =
                (errorResponse as ErrorResponse)?.data?.message ||
                "Something Went Wrong";

            toast.error(errorMessage);
        } else if (isSuccess) {
            toast.success("Language Successfully Added");
            reset();
        }
    }, [isError, isSuccess, error, reset]);

    const onSubmit = async (data: LanguageFormValues) => {
        const loadingToast = toast.loading("Language is Creating...");
        await addLanguage(data);
        toast.dismiss(loadingToast);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* Basic Information */}
                <section className="grid grid-cols-1 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="name">
                                    Language Name
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        id="name"
                                        placeholder="Enter Language name"
                                        {...field}
                                        required
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </section>

                {/* Submit Button */}
                <div className="col-span-2 py-5">
                    <Button type="submit">
                        {isLoading ? "Creating Language..." : "Create Language"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
