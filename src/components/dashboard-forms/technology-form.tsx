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
import { useCreateTechnologyMutation } from "@/redux/features/technology/technologyApi";
import { ErrorResponse } from "@/types";
import { SerializedError } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type TechnologyFormValues = {
    name: string;
};

export default function TechnologyForm() {
    const form = useForm<TechnologyFormValues>({
        defaultValues: {
            name: "",
        },
    });

    const { reset } = form;

    const [addTechnology, { isSuccess, isLoading, isError, error }] =
        useCreateTechnologyMutation();

    useEffect(() => {
        if (isError) {
            const errorResponse = error as ErrorResponse | SerializedError;

            const errorMessage =
                (errorResponse as ErrorResponse)?.data?.message ||
                "Something Went Wrong";

            toast.error(errorMessage);
        } else if (isSuccess) {
            toast.success("Technology Successfully Added");
            reset();
        }
    }, [isError, isSuccess, error, reset]);

    const onSubmit = async (data: TechnologyFormValues) => {
        const loadingToast = toast.loading("Technology is Creating...");
        await addTechnology(data);
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
                                    Technology Name
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        id="name"
                                        placeholder="Enter Technology name"
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
                        {isLoading
                            ? "Creating Technology..."
                            : "Create Technology"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
