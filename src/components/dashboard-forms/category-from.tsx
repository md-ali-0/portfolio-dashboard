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
import { useCreateCategoryMutation } from "@/redux/features/category/categoryApi";
import { ErrorResponse } from "@/types";
import { generateSlug } from "@/utils/genereateSlug";
import { SerializedError } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type CategoryFormValues = {
    name: string;
    slug: string;
};

export default function CategoryForm() {
    const form = useForm<CategoryFormValues>({
        defaultValues: {
            name: "",
            slug: "",
        },
    });

    const { watch, setValue, reset } = form;
    const name = watch("name");

    useEffect(() => {
        const slug = generateSlug(name);
        setValue("slug", slug);
    }, [name, setValue]);

    const [addCategory, { isSuccess, isLoading, isError, error }] =
        useCreateCategoryMutation();

    useEffect(() => {
        if (isError) {
            const errorResponse = error as ErrorResponse | SerializedError;

            const errorMessage =
                (errorResponse as ErrorResponse)?.data?.message ||
                "Something Went Wrong";

            toast.error(errorMessage);
        } else if (isSuccess) {
            toast.success("Category Successfully Added");
            reset();
        }
    }, [isError, isSuccess, error, reset]);

    const onSubmit = async (data: CategoryFormValues) => {
        const loadingToast = toast.loading("Category is Creating...");
        await addCategory(data);
        toast.dismiss(loadingToast);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* Basic Information */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="name">
                                    Category Name
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        id="name"
                                        placeholder="Enter Category name"
                                        {...field}
                                        required
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem className="col-span-1">
                                <FormLabel htmlFor="slug">Slug</FormLabel>
                                <FormControl>
                                    <Input
                                        id="slug"
                                        placeholder="Enter Category slug"
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
                        {isLoading ? "Creating Category..." : "Create Category"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
