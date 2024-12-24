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
import { useSession } from "@/provider/session-provider";
import { useGetAllCategoriesQuery } from "@/redux/features/category/categoryApi";
import { useCreatePostMutation } from "@/redux/features/post/postApi";
import { ErrorResponse } from "@/types";
import { generateSlug } from "@/utils/genereateSlug";
import { SerializedError } from "@reduxjs/toolkit";
import { Editor } from "@tinymce/tinymce-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

type PostFormValues = {
    title: string;
    slug: string;
    shortDescription: string;
    content: string;
    thumbnail: File | null;
    categoryId: string;
    metaTitle: string;
    metaKey: string;
    metaDesc: string;
};

export default function PostForm() {
    const { session } = useSession();
    const form = useForm<PostFormValues>({
        defaultValues: {
            title: "",
            slug: "",
            shortDescription: "",
            content: "",
            thumbnail: null,
            categoryId: "",
            metaTitle: "",
            metaKey: "",
            metaDesc: "",
        },
    });

    const { data: categories, isLoading: isCategoryLoading } = useGetAllCategoriesQuery([
        {
            name: "limit",
            value: 999,
        },
    ]);

    const { watch, setValue, reset } = form;
    const title = watch("title");

    useEffect(() => {
        const slug = generateSlug(title);
        setValue("slug", slug);
    }, [title, setValue]);

    const [createPost, { isSuccess, isLoading, isError, error }] =
        useCreatePostMutation();

    useEffect(() => {
        if (isError) {
            const errorResponse = error as ErrorResponse | SerializedError;
            const errorMessage =
                (errorResponse as ErrorResponse)?.data?.message ||
                "Something Went Wrong";
            toast.error(errorMessage);
        } else if (isSuccess) {
            toast.success("Post Successfully Added");
            reset();
        }
    }, [isError, isSuccess, error, reset]);

    const onSubmit = async (data: PostFormValues) => {
        const reviewData = {
            title: data.title,
            slug: data.slug,
            shortDescription: data.shortDescription,
            categoryId: data.categoryId,
            authorId: session?.user,
            content: data.content,
            metaTitle: data.metaTitle,
            metaKey: data.metaKey,
            metaDesc: data.metaDesc,
        };
        const formData = new FormData();
        if (data.thumbnail) {
            formData.append("thumbnail", data.thumbnail);
        }
        formData.append("data", JSON.stringify(reviewData));

        // Handle form submission here
        const loadingToast = toast.loading("Post is Creating...");
        await createPost(formData);
        toast.dismiss(loadingToast);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel htmlFor="title">Title</FormLabel>
                                <FormControl>
                                    <Input
                                        id="title"
                                        placeholder="Enter Post Title"
                                        {...field}
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
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel htmlFor="slug">Slug</FormLabel>
                                <FormControl>
                                    <Input id="slug" {...field} readOnly />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel htmlFor="categoryId">
                                    Select Category
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={(values) => {
                                            field.onChange(values);
                                        }}
                                        value={
                                            field.value
                                                ? String(field.value)
                                                : undefined
                                        }
                                        disabled={isCategoryLoading}
                                    >
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={
                                                    isCategoryLoading
                                                        ? "Loading.."
                                                        : "Select categories"
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories?.data?.map((item) => (
                                                <SelectItem
                                                    value={String(item?.id)}
                                                    key={item?.id}
                                                >
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="shortDescription"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>Short Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter short description"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel htmlFor="content">Content</FormLabel>
                                <FormControl>
                                    <Editor
                                        apiKey="lqre26087xr8qx73ci2q2p5xufo4o5b5zm0vcrt203awvvnx"
                                        value={field.value || ""}
                                        init={{
                                            height: 500,
                                            plugins: [
                                                "anchor",
                                                "autolink",
                                                "charmap",
                                                "codesample",
                                                "image",
                                                "code",
                                                "link",
                                                "lists",
                                                "media",
                                                "searchreplace",
                                                "table",
                                                "visualblocks",
                                                "wordcount",
                                            ],
                                            toolbar:
                                                "undo redo | bold italic underline strikethrough | image | link | code table mergetags | addcomment showcomments |  typography | align lineheight | checklist numlist bullist indent outdent | charmap | removeformat",
                                            images_upload_url: "/api/upload",
                                            content_style:
                                                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                                            branding: false,
                                            skin_url: "/tinymce/skins/ui/oxide",
                                            content_css:
                                                "/tinymce/skins/content/default/content.min.css",
                                        }}
                                        onEditorChange={(content) =>
                                            field.onChange(content)
                                        }
                                        onBlur={() => field.onBlur()}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="metaTitle"
                        render={({ field }) => (
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Meta Title</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="metaKey"
                        render={({ field }) => (
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Meta Keywords</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="metaDesc"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>Meta Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter meta description"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </section>

                <div className="py-5">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Creating Post..." : "Create Post"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
