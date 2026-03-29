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
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import TagInput from "../ui/tag-input";

type SectionType = "educations" | "courses" | "certifications";

type EducationItem = {
    institution: string;
    degree: string;
    field: string;
    period: string;
    description: string;
    achievements: string[];
};

type CourseItem = {
    title: string;
    platform: string;
    instructor: string;
    duration: string;
    completionDate: string;
    skills: string[];
    description: string;
};

type CertificationItem = {
    title: string;
    organization: string;
    date: string;
    credentialId: string;
    verificationUrl: string;
    description: string;
    skills: string[];
};

type FormValues = {
    items: Array<EducationItem | CourseItem | CertificationItem>;
};

const getEmptyItem = (sectionType: SectionType) => {
    if (sectionType === "educations") {
        return {
            institution: "",
            degree: "",
            field: "",
            period: "",
            description: "",
            achievements: [],
        };
    }

    if (sectionType === "courses") {
        return {
            title: "",
            platform: "",
            instructor: "",
            duration: "",
            completionDate: "",
            skills: [],
            description: "",
        };
    }

    return {
        title: "",
        organization: "",
        date: "",
        credentialId: "",
        verificationUrl: "",
        description: "",
        skills: [],
    };
};

interface AboutSectionFormProps {
    sectionType: SectionType;
    title: string;
    description: string;
}

export default function AboutSectionForm({
    sectionType,
    title,
    description,
}: AboutSectionFormProps) {
    const form = useForm<FormValues>({
        defaultValues: {
            items: [],
        },
    });

    const { data: aboutMeData } = useGetAboutMeQuery(undefined);
    const [updateAboutMe, { isLoading, isSuccess, isError }] =
        useUpdateAboutMeMutation();

    const { control, handleSubmit, reset } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    useEffect(() => {
        const items = aboutMeData?.data?.[sectionType];
        reset({
            items: Array.isArray(items) ? items : [],
        });
    }, [aboutMeData?.data, reset, sectionType]);

    useEffect(() => {
        if (isSuccess) {
            toast.success(`${title} updated successfully`);
        } else if (isError) {
            toast.error(`Failed to update ${title.toLowerCase()}`);
        }
    }, [isError, isSuccess, title]);

    const onSubmit = async (data: FormValues) => {
        const loadingToast = toast.loading(`Saving ${title.toLowerCase()}...`);
        await updateAboutMe({
            [sectionType]: data.items,
        });
        toast.dismiss(loadingToast);
    };

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>

                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="rounded-xl border border-border bg-card/50 p-5 space-y-5"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <h4 className="font-medium text-foreground">
                                {title} #{index + 1}
                            </h4>
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => remove(index)}
                            >
                                Remove
                            </Button>
                        </div>

                        {sectionType === "educations" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField control={control} name={`items.${index}.institution`} render={({ field }) => (
                                    <FormItem><FormLabel>Institution</FormLabel><FormControl><Input {...field} value={field.value as string} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={control} name={`items.${index}.degree`} render={({ field }) => (
                                    <FormItem><FormLabel>Degree</FormLabel><FormControl><Input {...field} value={field.value as string} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={control} name={`items.${index}.field`} render={({ field }) => (
                                    <FormItem><FormLabel>Field</FormLabel><FormControl><Input {...field} value={field.value as string} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={control} name={`items.${index}.period`} render={({ field }) => (
                                    <FormItem><FormLabel>Period</FormLabel><FormControl><Input {...field} value={field.value as string} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={control} name={`items.${index}.description`} render={({ field }) => (
                                    <FormItem className="md:col-span-2"><FormLabel>Description</FormLabel><FormControl><Textarea {...field} value={field.value as string} rows={4} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={control} name={`items.${index}.achievements`} render={({ field }) => (
                                    <FormItem className="md:col-span-2"><FormLabel>Achievements</FormLabel><FormControl><TagInput value={(field.value as string[]) || []} onChange={field.onChange} placeholder="Add achievements" /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                        )}

                        {sectionType === "courses" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField control={control} name={`items.${index}.title`} render={({ field }) => (
                                    <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} value={field.value as string} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={control} name={`items.${index}.platform`} render={({ field }) => (
                                    <FormItem><FormLabel>Platform</FormLabel><FormControl><Input {...field} value={field.value as string} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={control} name={`items.${index}.instructor`} render={({ field }) => (
                                    <FormItem><FormLabel>Instructor</FormLabel><FormControl><Input {...field} value={field.value as string} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={control} name={`items.${index}.duration`} render={({ field }) => (
                                    <FormItem><FormLabel>Duration</FormLabel><FormControl><Input {...field} value={field.value as string} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={control} name={`items.${index}.completionDate`} render={({ field }) => (
                                    <FormItem><FormLabel>Completion Date</FormLabel><FormControl><Input {...field} value={field.value as string} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={control} name={`items.${index}.description`} render={({ field }) => (
                                    <FormItem className="md:col-span-2"><FormLabel>Description</FormLabel><FormControl><Textarea {...field} value={field.value as string} rows={4} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={control} name={`items.${index}.skills`} render={({ field }) => (
                                    <FormItem className="md:col-span-2"><FormLabel>Skills</FormLabel><FormControl><TagInput value={(field.value as string[]) || []} onChange={field.onChange} placeholder="Add skills" /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                        )}

                        {sectionType === "certifications" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField control={control} name={`items.${index}.title`} render={({ field }) => (
                                    <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} value={field.value as string} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={control} name={`items.${index}.organization`} render={({ field }) => (
                                    <FormItem><FormLabel>Organization</FormLabel><FormControl><Input {...field} value={field.value as string} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={control} name={`items.${index}.date`} render={({ field }) => (
                                    <FormItem><FormLabel>Date</FormLabel><FormControl><Input {...field} value={field.value as string} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={control} name={`items.${index}.credentialId`} render={({ field }) => (
                                    <FormItem><FormLabel>Credential ID</FormLabel><FormControl><Input {...field} value={field.value as string} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={control} name={`items.${index}.verificationUrl`} render={({ field }) => (
                                    <FormItem className="md:col-span-2"><FormLabel>Verification URL</FormLabel><FormControl><Input {...field} value={field.value as string} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={control} name={`items.${index}.description`} render={({ field }) => (
                                    <FormItem className="md:col-span-2"><FormLabel>Description</FormLabel><FormControl><Textarea {...field} value={field.value as string} rows={4} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={control} name={`items.${index}.skills`} render={({ field }) => (
                                    <FormItem className="md:col-span-2"><FormLabel>Skills</FormLabel><FormControl><TagInput value={(field.value as string[]) || []} onChange={field.onChange} placeholder="Add skills" /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                        )}
                    </div>
                ))}

                <div className="flex flex-wrap gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => append(getEmptyItem(sectionType))}
                    >
                        Add {title}
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
