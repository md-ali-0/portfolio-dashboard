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
import { Textarea } from "@/components/ui/textarea";
import {
    useGetAboutMeQuery,
    useUpdateAboutMeMutation,
} from "@/redux/features/aboutMe/aboutMeApi";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type AboutMeFormValues = {
    resume: string;
    title: string;
    description: string;
};

export default function AboutMeForm() {
    const form = useForm<AboutMeFormValues>({
        defaultValues: {
            resume: "",
            title: "",
            description: "",
        },
    });

    const { data: aboutMeData, isLoading: isFetching } = useGetAboutMeQuery(undefined);
    const [updateAboutMe, { isLoading: isUpdating, isError, isSuccess }] =
        useUpdateAboutMeMutation();

    const { reset } = form;

    useEffect(() => {
        if (aboutMeData?.data) {
            // We only need resume, title, description
            const { resume, title, description } = aboutMeData.data;
            reset({
                resume: resume || "",
                title: title || "",
                description: description || ""
            });
        }
    }, [aboutMeData?.data, reset]);

    useEffect(() => {
        if (isSuccess) {
            toast.success("About Me updated successfully!");
        } else if (isError) {
            toast.error("Failed to update About Me. Try again!");
        }
    }, [isSuccess, isError]);

    const onSubmit = async (data: AboutMeFormValues) => {
        const loadingToast = toast.loading("Updating About Me...");
        await updateAboutMe(data);
        toast.dismiss(loadingToast);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <section className="grid grid-cols-1 gap-6">
                    {/* CV URL (mapped to Resume) */}
                    <FormField
                        control={form.control}
                        name="resume"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="resume">CV URL (Resume)</FormLabel>
                                <FormControl>
                                    <Input
                                        id="resume"
                                        placeholder="Enter CV URL"
                                        {...field}
                                        required
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Short Description (mapped to title) */}
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="title">
                                    Short Description (Title)
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        id="title"
                                        placeholder="Enter a short description"
                                        {...field}
                                        required
                                        rows={5}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    {/* About Me (mapped to description) */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="description">About Me (Description)</FormLabel>
                                <FormControl>
                                    <Textarea
                                        id="description"
                                        placeholder="Write about yourself"
                                        {...field}
                                        required
                                        rows={6}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </section>

                {/* Submit Button */}
                <div className="py-5">
                    <Button type="submit">
                        {isFetching || isUpdating
                            ? "Saving..."
                            : "Save Changes"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
