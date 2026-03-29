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
import { useEffect, useState } from "react";
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
    StartDate: string | Date;
    EndDate?: string | Date;
    metaTitle?: string;
    metaDesc?: string;
    metaKey?: string;
    languages: string[];
    technologies: string[];
};

const toIsoString = (value?: string | Date | null) => {
    if (!value) {
        return undefined;
    }

    return value instanceof Date ? value.toISOString() : value;
};

const normalizeOptionalString = (value?: string) => {
    const normalizedValue = value?.trim();
    return normalizedValue ? normalizedValue : undefined;
};

export default function ProjectForm() {
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
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

    const updateThumbnailPreview = (file?: File | null) => {
        setThumbnailPreview((currentPreview) => {
            if (currentPreview?.startsWith("blob:")) {
                URL.revokeObjectURL(currentPreview);
            }

            return file ? URL.createObjectURL(file) : null;
        });
    };

    const updateImagePreviews = (files?: FileList | null) => {
        setImagePreviews((currentPreviews) => {
            currentPreviews
                .filter((previewUrl) => previewUrl.startsWith("blob:"))
                .forEach((previewUrl) => URL.revokeObjectURL(previewUrl));

            return files ? Array.from(files).map((file) => URL.createObjectURL(file)) : [];
        });
    };

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
        const sanitizedProjectData = {
            ...projectData,
            liveUrl: normalizeOptionalString(projectData.liveUrl),
            SourceFront: normalizeOptionalString(projectData.SourceFront),
            SourceBack: normalizeOptionalString(projectData.SourceBack),
            metaTitle: normalizeOptionalString(projectData.metaTitle),
            metaDesc: normalizeOptionalString(projectData.metaDesc),
            metaKey: normalizeOptionalString(projectData.metaKey),
            StartDate: toIsoString(projectData.StartDate),
            EndDate: toIsoString(projectData.EndDate),
            authorId: session?.user
        };

        formData.append(
            "data",
            JSON.stringify(sanitizedProjectData)
        );
        const loadingToast = toast.loading("Project is Creating...");
        await addProject(formData);
        toast.dismiss(loadingToast);
    };

    return (
        <div className="max-w-5xl mx-auto">
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                >
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
                    {/* ... (rest of the form sections) */}
                    {/* Note: I'm skipping truncated middle lines for brevity in replacement, but I must follow instructions */}
                    {/* I'll use a better approach to replace the whole return block if possible, but the file is large */}
                    {/* Let's try to just replace the header and footer of the return statement */}

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
                                        required
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] || null;
                                            field.onChange(file);
                                            updateThumbnailPreview(file);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                                {thumbnailPreview && (
                                    <div className="mt-3 overflow-hidden rounded-lg border border-border bg-muted/30 p-2">
                                        <img
                                            src={thumbnailPreview}
                                            alt="Thumbnail preview"
                                            className="h-40 w-full rounded-md object-cover"
                                        />
                                    </div>
                                )}
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
                                        accept="image/*"
                                        onChange={(e) => {
                                            const files = e.target.files || null;
                                            field.onChange(files);
                                            updateImagePreviews(files);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                                {imagePreviews.length > 0 && (
                                    <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
                                        {imagePreviews.map((previewUrl, index) => (
                                            <div
                                                key={`${previewUrl}-${index}`}
                                                className="overflow-hidden rounded-lg border border-border bg-muted/30 p-2"
                                            >
                                                <img
                                                    src={previewUrl}
                                                    alt={`Project preview ${index + 1}`}
                                                    className="h-28 w-full rounded-md object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
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
        </div>
    );
}
