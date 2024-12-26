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
    cvUrl: string;
    shortDescription: string;
    aboutMe: string;
};

export default function AboutMeForm() {
    const form = useForm<AboutMeFormValues>({
        defaultValues: {
            cvUrl: "",
            shortDescription: "",
            aboutMe: "",
        },
    });

    const { data: aboutMeData, isLoading: isFetching } = useGetAboutMeQuery(undefined);
    const [updateAboutMe, { isLoading: isUpdating, isError, isSuccess }] =
        useUpdateAboutMeMutation();

    const { reset } = form;

    useEffect(() => {
        if (aboutMeData?.data) {
            reset(aboutMeData?.data);
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
                    {/* CV URL */}
                    <FormField
                        control={form.control}
                        name="cvUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="cvUrl">CV URL</FormLabel>
                                <FormControl>
                                    <Input
                                        id="cvUrl"
                                        placeholder="Enter CV URL"
                                        {...field}
                                        required
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Short Description */}
                    <FormField
                        control={form.control}
                        name="shortDescription"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="shortDescription">
                                    Short Description
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        id="shortDescription"
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
                    
                    <FormField
                        control={form.control}
                        name="aboutMe"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="aboutMe">About Me</FormLabel>
                                <FormControl>
                                    <Textarea
                                        id="aboutMe"
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
