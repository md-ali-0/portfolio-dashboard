/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    useGetAllBrandsQuery
} from "@/redux/features/brand/brandApi";
import { useGetAllCategoriesQuery } from "@/redux/features/category/categoryApi";
import { useUpdateProductMutation } from "@/redux/features/product/productApi";
import { ErrorResponse, Product } from "@/types";
import { SerializedError } from "@reduxjs/toolkit";
import Image from "next/image";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./../ui/form";

interface EditProductDialogProps {
    product: Product | null;
    open: boolean;
    onClose: () => void;
}

const EditProductDialog = ({
    product,
    open,
    onClose,
}: EditProductDialogProps) => {
    const form = useForm<Product>({
        defaultValues: product || {
            name: "",
            price: 0,
            description: "",
            categoryId: "",
            brandId: "",
            inventory: 0,
            discount: 0,
            thumbnail: "",
        },
        values: product || undefined,
    });
    const { reset } = form;

    const [updateProduct, { isSuccess, isError, isLoading, error }] =
        useUpdateProductMutation();

    useEffect(() => {
        if (isError) {
            const errorResponse = error as ErrorResponse | SerializedError;

            const errorMessage =
                (errorResponse as ErrorResponse)?.data?.message ||
                "Something Went Wrong";

            toast.error(errorMessage);
        } else if (isSuccess) {
            toast.success("Product Successfully Updated");
        }
    }, [isError, isSuccess, error]);

    const { data: brands, isLoading: isBrandLoading } = useGetAllBrandsQuery([
        {
            name: "limit",
            value: 999,
        },
    ]);

    const { data: categories, isLoading: isCategoryLoading } =
        useGetAllCategoriesQuery([
            {
                name: "limit",
                value: 999,
            },
        ]);

    useEffect(() => {
        reset(
            product || {
                name: "",
                price: 0,
                description: "",
                categoryId: "",
                brandId: "",
                inventory: 0,
                discount: 0,
                thumbnail: "",
            }
        );
    }, [product, reset]);

    const onSubmit = async (data: Product) => {
        const loadingToast = toast.loading("Product is Updating...");
            
        const productData = {
            name: data.name,
            price: Number(data.price),
            description: data.description,
            categoryId: data.categoryId,
            brandId: data.brandId,
            inventory: Number(data.inventory),
            discount: Number(data.discount),
        };

        const formData = new FormData();
        if (data.thumbnail) {
            formData.append("thumbnail", data.thumbnail);
        }
        if (data.images) {
            Array.from(data.images).forEach((image) => {
                formData.append("images", image as unknown as string);
            });
        }
        formData.append("data", JSON.stringify(productData));

        if (product) {
            formData.append("id", product?.id);
            await updateProduct({ formData, id: product?.id });
        }
        onClose();
        toast.dismiss(loadingToast);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                aria-describedby={undefined}
                className="sm:max-w-[725px]"
            >
                <DialogHeader>
                    <DialogTitle>Edit Brand</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Basic Information */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="name">
                                        Product Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            id="name"
                                            placeholder="Enter product name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="price">Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            placeholder="Enter product price"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="description">
                                        Description
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            id="description"
                                            placeholder="Enter product description"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Category and Brand */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="category">
                                            Category
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
                                                                : "Select Category"
                                                        }
                                                        
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories?.data?.map(
                                                        (item) => (
                                                            <SelectItem
                                                                value={String(
                                                                    item?.slug
                                                                )}
                                                                key={item?.slug}
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
                                name="brandId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="brand">
                                            Brand
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
                                                disabled={isBrandLoading}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder={
                                                            isBrandLoading
                                                                ? "Loading.."
                                                                : "Select Brands"
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {brands?.data?.map(
                                                        (item) => (
                                                            <SelectItem
                                                                value={String(
                                                                    item?.slug
                                                                )}
                                                                key={item?.slug}
                                                            >
                                                                <Image
                                                                    src={
                                                                        item.image
                                                                    }
                                                                    alt={
                                                                        item.name
                                                                    }
                                                                    width={50}
                                                                    height={30}
                                                                    className="inline w-6 mr-2"
                                                                />
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
                        </div>

                        {/* Inventory, Discount, and Media */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="inventory"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="inventory">
                                            Inventory
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="inventory"
                                                type="number"
                                                placeholder="Enter inventory count"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="discount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="discount">
                                            Discount (%)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="discount"
                                                type="number"
                                                step="0.01"
                                                placeholder="Enter discount percentage"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="thumbnail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="thumbnail">
                                        Thumbnail
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            id="thumbnail"
                                            type="file"
                                            onChange={(e) =>
                                                field.onChange(
                                                    e.target.files?.[0] || null
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
                            name="images"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="images">
                                        Images
                                    </FormLabel>
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

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full"
                        >
                            {isLoading
                                ? "Upading Product..."
                                : "Update Product"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EditProductDialog;
