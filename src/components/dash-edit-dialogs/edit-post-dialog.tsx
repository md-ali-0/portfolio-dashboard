/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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
import { Textarea } from "../ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./../ui/form";

interface EditPostDialogProps {
    post: Post | null;
    open: boolean;
    onClose: () => void;
}

const EditPostDialog = ({ post, open, onClose }: EditPostDialogProps) => {

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

    const [updateSpecification, { isSuccess, isError, isLoading, error }] =
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
            formData.append("id", post?.id);
            await updateSpecification(formData);
        }
        onClose();
        toast.dismiss(loadingToast);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                aria-describedby={undefined}
                className="sm:max-w-[750px]"
            >
                <DialogHeader>
                    <DialogTitle>Edit Post</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="col-span-2 md:col-span-1">
                                        <FormLabel htmlFor="title">
                                            Title
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="title"
                                                placeholder="Enter Review Title"
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
                                        <FormLabel htmlFor="slug">
                                            Slug
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="slug"
                                                {...field}
                                                readOnly
                                            />
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
                                                    field.onChange(
                                                        e.target.files?.[0]
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
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem className="col-span-2 md:col-span-1">
                                        <FormLabel htmlFor="categoryId">
                                            Select Brand
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
                                                    {categories?.data?.map(
                                                        (item) => (
                                                            <SelectItem
                                                                value={String(
                                                                    item?.id
                                                                )}
                                                                key={item?.id}
                                                            >
                                                                {item.name}
                                                            </SelectItem>
                                                        )
                                                    )}
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
                                                value={field.value ?? ""}
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
                                        <FormLabel htmlFor="content">
                                            Content
                                        </FormLabel>
                                        <FormControl>
                                            <Editor
                                                apiKey="lqre26087xr8qx73ci2q2p5xufo4o5b5zm0vcrt203awvvnx"
                                                value={field.value || ""} // Controlled value
                                                init={{
                                                    height: 500,
                                                    // menubar: false,
                                                    plugins: [
                                                        // Core editing features
                                                        "anchor",
                                                        "autolink",
                                                        "charmap",
                                                        "codesample",
                                                        "emoticons",
                                                        "image",
                                                        "link",
                                                        "lists",
                                                        "media",
                                                        "searchreplace",
                                                        "table",
                                                        "visualblocks",
                                                        "wordcount",
                                                    ],
                                                    toolbar:
                                                        "undo redo | bold italic underline strikethrough | image | link | table mergetags | addcomment showcomments |  typography | align lineheight | checklist numlist bullist indent outdent | charmap | removeformat",
                                                    content_style:
                                                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                                                    images_upload_url:
                                                        "/api/upload",
                                                    branding: false,
                                                    skin_url:
                                                        "/tinymce/skins/ui/oxide",
                                                    content_css:
                                                        "/tinymce/skins/content/default/content.min.css",
                                                }}
                                                onEditorChange={(content) =>
                                                    field.onChange(content)
                                                } // Update the value on change
                                                onBlur={() => field.onBlur()} // Trigger blur validation
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
                                            <Input
                                                {...field}
                                                value={field.value ?? ""}
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
                                    <FormItem className="col-span-2 md:col-span-1">
                                        <FormLabel>Meta Keywords</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                value={field.value ?? ""}
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
                                {isLoading
                                    ? "Review Upading..."
                                    : "Update Review"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EditPostDialog;
