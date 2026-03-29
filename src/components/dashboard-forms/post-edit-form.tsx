/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useGetAllCategoriesQuery } from "@/redux/features/category/categoryApi";
import { useUpdatePostMutation } from "@/redux/features/post/postApi";
import { ErrorResponse, Post } from "@/types";
import { generateSlug } from "@/utils/genereateSlug";
import { SerializedError } from "@reduxjs/toolkit";
import { Editor } from "@tinymce/tinymce-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

interface EditPostProps {
    post: Post | null;
}

type PostEditFormValues = {
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    thumbnail: File | null;
    categoryId: string;
    content: string;
    metaTitle: string;
    metaKey: string;
    metaDesc: string;
};

const normalizeOptionalString = (value?: string | null) => {
    const normalizedValue = value?.trim();
    return normalizedValue ? normalizedValue : undefined;
};

const getDefaultValues = (post?: Post | null): PostEditFormValues => ({
    id: post?.id,
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    thumbnail: null,
    categoryId: post?.categoryId ?? "",
    content: post?.content ?? "",
    metaTitle: post?.metaTitle ?? "",
    metaKey: post?.metaKey ?? "",
    metaDesc: post?.metaDesc ?? "",
});

const getPostThumbnailPreview = (post?: Post | null) => {
    if (typeof post?.featuredImage === "string" && post.featuredImage) {
        return post.featuredImage;
    }

    if (typeof post?.thumbnail === "string" && post.thumbnail) {
        return post.thumbnail;
    }

    return null;
};

export default function EditPostForm({post}: EditPostProps) {
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
        getPostThumbnailPreview(post)
    );
    const form = useForm<PostEditFormValues>({
        defaultValues: getDefaultValues(post),
    });

    const { data: categories, isLoading: isCategoryLoading } = useGetAllCategoriesQuery([
        {
            name: "limit",
            value: 999,
        },
    ]);

    const { watch, setValue, reset } = form;
    const name = watch("title");

    useEffect(() => {
        const slug = generateSlug(name);
        setValue("slug", slug);
    }, [name, setValue]);

    const [updatePost, { isSuccess, isError, isLoading, error }] =
        useUpdatePostMutation();

    useEffect(() => {
        if (isError) {
            const errorResponse = error as ErrorResponse | SerializedError;

            const errorMessage =
                (errorResponse as ErrorResponse)?.data?.message ||
                "Something Went Wrong";

            toast.error(errorMessage);
        } else if (isSuccess) {
            toast.success("Post Successfully Updated");
            reset(getDefaultValues(post));
        }
    }, [isError, isSuccess, error, post, reset]);

    useEffect(
        () => {
            setThumbnailPreview(getPostThumbnailPreview(post));
            reset(getDefaultValues(post));
        },
        [post, reset]
    );

    const updateThumbnailPreview = (file?: File | null) => {
        setThumbnailPreview((currentPreview) => {
            if (currentPreview?.startsWith("blob:")) {
                URL.revokeObjectURL(currentPreview);
            }

            return file ? URL.createObjectURL(file) : getPostThumbnailPreview(post);
        });
    };

    const onSubmit = async (data: PostEditFormValues) => {
        const loadingToast = toast.loading("Post is Updating...");

        const formData = new FormData();

        const postData = {
            title: data.title,
            slug: data.slug,
            content: data.content,
            excerpt: normalizeOptionalString(data.excerpt),
            categoryId: data.categoryId,
            metaTitle: normalizeOptionalString(data.metaTitle),
            metaKey: normalizeOptionalString(data.metaKey),
            metaDesc: normalizeOptionalString(data.metaDesc),
        };

        if (data.thumbnail instanceof File) {
            formData.append("thumbnail", data.thumbnail);
        }

        formData.append("data", JSON.stringify(postData));
        if (post) {
            await updatePost({formData, id: post?.id});
        }
        toast.dismiss(loadingToast);
    };

    return (
        <div className="max-w-5xl mx-auto">
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                >
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
                                        <div className="relative h-40 w-full">
                                            <Image
                                            src={thumbnailPreview}
                                            alt="Post thumbnail preview"
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className="rounded-md object-cover"
                                            unoptimized
                                            />
                                        </div>
                                    </div>
                                )}
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
                        name="excerpt"
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
                                            branding: false,
                                            skin: "oxide-dark",
                                            content_css: "dark",
                                            content_style:
                                                "body { font-family:Inter,Helvetica,Arial,sans-serif; font-size:14px; background-color: #1c1c1e; color: #eeeeee; }",
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
                                    <Input {...field} value={field.value ?? ""} />
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
                                    <Input {...field} value={field.value ?? ""} />
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
                                        value={field.value ?? ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </section>

                <div className="py-5">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Updating Post..." : "Update Post"}
                    </Button>
                </div>
                </form>
            </Form>
        </div>
    );
}
