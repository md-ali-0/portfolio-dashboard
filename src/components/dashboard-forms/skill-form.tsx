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
import { useSession } from "@/provider/session-provider";
import { useCreateSkillMutation } from "@/redux/features/skill/skillApi";
import { ErrorResponse } from "@/types";
import { SerializedError } from "@reduxjs/toolkit";
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

type SkillFormValues = {
    name: string;
    level: string;
};

export default function SkillForm() {
    const form = useForm<SkillFormValues>({
        defaultValues: {
            name: "",
            level: "BEGINNER",
        },
    });

    const { session } = useSession()

    const { reset } = form;

    const [addSkill, { isSuccess, isLoading, isError, error }] =
        useCreateSkillMutation();

    useEffect(() => {
        if (isError) {
            const errorResponse = error as ErrorResponse | SerializedError;

            const errorMessage =
                (errorResponse as ErrorResponse)?.data?.message ||
                "Something Went Wrong";

            toast.error(errorMessage);
        } else if (isSuccess) {
            toast.success("Skill Successfully Added");
            reset();
        }
    }, [isError, isSuccess, error, reset]);

    const onSubmit = async (data: SkillFormValues) => {
        const loadingToast = toast.loading("Skill is Creating...");
        await addSkill({...data, userId: session?.user});
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
                                <FormLabel htmlFor="name">Skill Name</FormLabel>
                                <FormControl>
                                    <Input
                                        id="name"
                                        placeholder="Enter Skill name"
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
                        name="level"
                        render={({ field }) => (
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel htmlFor="level">
                                    Select Skill Lavel
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={(values) => {
                                            field.onChange(values);
                                        }}
                                        value={
                                            field.value
                                                ? String(field.value)
                                                : "BEGINNER"
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Skill Level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="BEGINNER">
                                                BEGINNER
                                            </SelectItem>
                                            <SelectItem value="INTERMEDIATE">
                                                INTERMEDIATE
                                            </SelectItem>
                                            <SelectItem value="ADVANCED">
                                                ADVANCED
                                            </SelectItem>
                                            <SelectItem value="EXPERT">
                                                EXPERT
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </section>

                {/* Submit Button */}
                <div className="col-span-2 py-5">
                    <Button type="submit">
                        {isLoading ? "Creating Skill..." : "Create Skill"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
