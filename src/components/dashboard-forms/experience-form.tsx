"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useSession } from "@/provider/session-provider";
import { useCreateExperienceMutation } from "@/redux/features/experience/experienceApi";
import { ErrorResponse } from "@/types";
import { formatDate } from "@/utils/date-format";
import { SerializedError } from "@reduxjs/toolkit";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Textarea } from "../ui/textarea";

type ExperienceFormValues = {
    companyName: string;
    position: string;
    description: string;
    icon?: string;
    startDate: string;
    endDate?: string;
    achievements: { value: string }[];
    technologies: { value: string }[];
};

export default function ExperienceForm() {
    const form = useForm<ExperienceFormValues>({
        defaultValues: {
            companyName: "",
            position: "",
            description: "",
            icon: "",
            startDate: "",
            endDate: "",
            achievements: [{ value: "" }],
            technologies: [{ value: "" }],
        },
    });
    const { session } = useSession();
    const { reset, control, handleSubmit } = form;

    const {
        fields: achievementFields,
        append: appendAchievement,
        remove: removeAchievement,
    } = useFieldArray({
        control,
        name: "achievements",
    });

    const {
        fields: technologyFields,
        append: appendTechnology,
        remove: removeTechnology,
    } = useFieldArray({
        control,
        name: "technologies",
    });

    const [addExperience, { isSuccess, isLoading, isError, error }] =
        useCreateExperienceMutation();

    useEffect(() => {
        if (isError) {
            const errorResponse = error as ErrorResponse | SerializedError;
            const errorMessage =
                (errorResponse as ErrorResponse)?.data?.message ||
                "Something Went Wrong";
            toast.error(errorMessage);
        } else if (isSuccess) {
            toast.success("Experience Successfully Added");
            reset();
        }
    }, [isError, isSuccess, error, reset]);

    const onSubmit = async (data: ExperienceFormValues) => {
        const loadingToast = toast.loading("Experience is Creating...");
        const experienceData = {
            companyName: data.companyName,
            position: data.position,
            description: data.description,
            icon: data.icon,
            startDate: data.startDate,
            userId: session?.user,
            endDate: data.endDate || null,
            achievements: data.achievements.map(a => a.value).filter(val => val.trim() !== ""),
            technologies: data.technologies.map(t => t.value).filter(val => val.trim() !== ""),
        };
        await addExperience(experienceData);
        toast.dismiss(loadingToast);
    };

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Basic Information */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={control}
                        name="companyName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Company Name" {...field} required />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="position"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Position</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Position" {...field} required />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 py-5">
                    <FormField
                        control={control}
                        name="icon"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Icon (Lucide Icon Name)</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Briefcase, Code" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </section>

                {/* Description and Dates */}
                <section className="grid grid-cols-1 gap-6 py-5">
                    <FormField
                        control={control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Enter Job Description" {...field} required />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </section>

                {/* Achievements */}
                <section className="py-5">
                    <div className="flex justify-between items-center mb-4">
                        <FormLabel>Achievements</FormLabel>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendAchievement({ value: "" })}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Achievement
                        </Button>
                    </div>
                    <div className="space-y-3">
                        {achievementFields.map((field, index) => (
                            <div key={field.id} className="flex gap-2">
                                <FormField
                                    control={control}
                                    name={`achievements.${index}.value`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input placeholder="Enter achievement" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive"
                                    onClick={() => removeAchievement(index)}
                                    disabled={achievementFields.length === 1}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Technologies */}
                <section className="py-5">
                    <div className="flex justify-between items-center mb-4">
                        <FormLabel>Technologies</FormLabel>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendTechnology({ value: "" })}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Technology
                        </Button>
                    </div>
                    <div className="space-y-3">
                        {technologyFields.map((field, index) => (
                            <div key={field.id} className="flex gap-2">
                                <FormField
                                    control={control}
                                    name={`technologies.${index}.value`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input placeholder="Enter technology" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive"
                                    onClick={() => removeTechnology(index)}
                                    disabled={technologyFields.length === 1}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 py-5 gap-6">
                    <FormField
                        control={control}
                        name="startDate"
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
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? formatDate(field.value) : <span>Pick a date</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            onSelect={field.onChange}
                                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="endDate"
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
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? formatDate(field.value) : <span>Pick a date</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            onSelect={field.onChange}
                                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </section>

                {/* Submit Button */}
                <div className="py-5">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Creating Experience..." : "Create Experience"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
