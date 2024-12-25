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

interface EditPostProps {
    post: Post | null;
}

export default function EditPostForm({post}: EditPostProps) {

    const form = useForm<Post>({
        defaultValues: post || {
            title: "",
            slug: "",
            shortDescription: "",
            thumbnail: "",
            categoryId: "",
            authorId: "",
            metaTitle: "",
            metaKey: "",
            metaDesc: "",
        },
        values: post || undefined,
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
        }
    }, [isError, isSuccess, error]);

    useEffect(
        () =>
            reset(
                post || {
                    title: "",
                    slug: "",
                    shortDescription: "",
                    thumbnail: "",
                    categoryId: "",
                    authorId: "",
                    metaTitle: "",
                    metaDesc: "",
                }
            ),
        [post, reset]
    );

    const onSubmit = async (data: Post) => {
        const loadingToast = toast.loading("Post is Updating...");

        const formData = new FormData();

        const productData = {
            title: data.title,
            slug: data.slug,
            content:  data.content,
            shortDescription: data.shortDescription,
            categoryId: data.categoryId,
            metaTitle: data.metaTitle,
            metaDesc: data.metaDesc,
        };

        if ((data.thumbnail as any) instanceof File) {
            formData.append("thumbnail", data.thumbnail);
        }

        formData.append("data", JSON.stringify(productData));
        if (post) {
            await updatePost({formData, id: post?.id});
        }
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
    );
}
