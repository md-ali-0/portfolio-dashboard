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
import { cn } from "@/lib/utils";
import { useSession } from "@/provider/session-provider";
import { useCreateProjectMutation } from "@/redux/features/project/projectApi";
import { ErrorResponse } from "@/types";
import { formatDate } from "@/utils/date-format";
import { generateSlug } from "@/utils/genereateSlug";
import { SerializedError } from "@reduxjs/toolkit";
import { CalendarIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import TagInput from "../ui/tag-input";
import { Textarea } from "../ui/textarea";

type ProjectFormValues = {
    title: string;
    slug: string;
    content: string;
    thumbnail: File | null;
    images: FileList | null;
    liveUrl?: string;
    SourceFront?: string;
    SourceBack?: string;
    StartDate: string;
    EndDate?: string;
    metaTitle?: string;
    metaDesc?: string;
    metaKey?: string;
    languages: string[];
    technologies: string[];
};

export default function ProjectForm() {
    const form = useForm<ProjectFormValues>({
        defaultValues: {
            title: "",
            slug: "",
            content: "",
            thumbnail: null,
            images: null,
            liveUrl: "",
            SourceFront: "",
            SourceBack: "",
            StartDate: "",
            EndDate: "",
            metaTitle: "",
            metaDesc: "",
            metaKey: "",
            languages: [],
            technologies: [],
        },
    });

    const { session } = useSession();
    const { watch, setValue, reset } = form;
    const title = watch("title");

    useEffect(() => {
        const slug = generateSlug(title);
        setValue("slug", slug);
    }, [title, setValue]);

    const [addProject, { isSuccess, isLoading, isError, error }] =
        useCreateProjectMutation();

    useEffect(() => {
        if (isError) {
            const errorResponse = error as ErrorResponse | SerializedError;

            const errorMessage =
                (errorResponse as ErrorResponse)?.data?.message ||
                "Something Went Wrong";

            toast.error(errorMessage);
        } else if (isSuccess) {
            toast.success("Project Successfully Added");
            reset();
        }
    }, [isError, isSuccess, error, reset]);

    const onSubmit = async (data: ProjectFormValues) => {
        const { thumbnail, images, ...projectData } = data;

        const formData = new FormData();
        if (thumbnail) {
            formData.append("thumbnail", thumbnail);
        }
        if (images) {
            Array.from(images).forEach((image) => {
                formData.append("images", image);
            });
        }
        formData.append(
            "data",
            JSON.stringify({ ...projectData, authorId: session?.user })
        );
        const loadingToast = toast.loading("Project is Creating...");
        await addProject(formData);
        toast.dismiss(loadingToast);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* Basic Information */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="title">Title</FormLabel>
                                <FormControl>
                                    <Input
                                        id="title"
                                        placeholder="Enter Project Title"
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
                            <FormItem>
                                <FormLabel htmlFor="slug">Slug</FormLabel>
                                <FormControl>
                                    <Input
                                        id="slug"
                                        placeholder="Enter Project Slug"
                                        {...field}
                                        required
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </section>

                {/* Thumbnail and Live Url*/}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 py-5">
                    <FormField
                        control={form.control}
                        name="thumbnail"
                        render={({ field }) => (
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel htmlFor="thumbnail">
                                    Thumbnail
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        id="thumbnail"
                                        type="file"
                                        onChange={(e) =>
                                            field.onChange(e.target.files?.[0])
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="images">Images</FormLabel>
                                <FormControl>
                                    <Input
                                        id="images"
                                        type="file"
                                        multiple
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.files || null
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="liveUrl"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel htmlFor="liveUrl">
                                    Live URL (Optional)
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        id="liveUrl"
                                        placeholder="Enter Live URL"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="SourceFront"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="SourceFront">
                                    Source Front (Optional)
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        id="SourceFront"
                                        placeholder="Enter Source Front"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="SourceBack"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="SourceBack">
                                    Source Back (Optional)
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        id="SourceBack"
                                        placeholder="Enter Source Back"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="languages"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel htmlFor="languages">
                                    Languages
                                </FormLabel>
                                <FormControl>
                                    <TagInput
                                        value={field.value || []} // Ensure it is always an array
                                        onChange={(tags) =>
                                            field.onChange(tags)
                                        } // Update the form state
                                        placeholder="Add languages (e.g., JavaScript, Python)"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="technologies"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel htmlFor="technologies">
                                    Technologies
                                </FormLabel>
                                <FormControl>
                                    <TagInput
                                        value={field.value || []}
                                        onChange={(tags) =>
                                            field.onChange(tags)
                                        }
                                        placeholder="Add technologies (e.g., React, Node.js)"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </section>
                {/* Content */}
                <section className="grid grid-cols-1 gap-6 py-5">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="content">Content</FormLabel>
                                <FormControl>
                                    <Textarea
                                        id="content"
                                        placeholder="Enter Project Description"
                                        {...field}
                                        required
                                        rows={5}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </section>

                {/* Dates and Optional Fields */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 py-5">
                    <FormField
                        control={form.control}
                        name="StartDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Start Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value &&
                                                        "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    formatDate(field.value)
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                    >
                                        <Calendar
                                            mode="single"
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() ||
                                                date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="EndDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>End Date (Optional)</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value &&
                                                        "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    formatDate(field.value)
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                    >
                                        <Calendar
                                            mode="single"
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() ||
                                                date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </section>

                {/* SEO Meta Information */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-5">
                    <FormField
                        control={form.control}
                        name="metaTitle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="metaTitle">
                                    Meta Title
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        id="metaTitle"
                                        placeholder="Enter Meta Title"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="metaDesc"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="metaDesc">
                                    Meta Description
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        id="metaDesc"
                                        placeholder="Enter Meta Description"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="metaKey"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="metaKey">
                                    Meta Keywords
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        id="metaKey"
                                        placeholder="Enter Meta Keywords"
                                        {...field}
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
                        {isLoading ? "Creating Project..." : "Create Project"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
