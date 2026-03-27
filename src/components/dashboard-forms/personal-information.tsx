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
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type AboutMeFormValues = {
    resume: string;
    title: string;
    description: string;
    email: string;
    phone: string;
    location: string;
    github: string;
    linkedin: string;
    facebook: string;
    twitter: string;
    youtube: string;
    instagram: string;
};

export default function AboutMeForm() {
    const form = useForm<AboutMeFormValues>({
        defaultValues: {
            resume: "",
            title: "",
            description: "",
            email: "",
            phone: "",
            location: "",
            github: "",
            linkedin: "",
            facebook: "",
            twitter: "",
            youtube: "",
            instagram: "",
        },
    });

    const { data: aboutMeData, isLoading: isFetching } = useGetAboutMeQuery(undefined);
    const [updateAboutMe, { isLoading: isUpdating, isError, isSuccess }] =
        useUpdateAboutMeMutation();

    const { reset } = form;

    useEffect(() => {
        if (aboutMeData?.data) {
            // We only need resume, title, description
            const { resume, title, description, email, phone, location, github, linkedin, facebook, twitter, youtube, instagram } = aboutMeData.data;
            reset({
                resume: resume || "",
                title: title || "",
                description: description || "",
                email: email || "",
                phone: phone || "",
                location: location || "",
                github: github || "",
                linkedin: linkedin || "",
                facebook: facebook || "",
                twitter: twitter || "",
                youtube: youtube || "",
                instagram: instagram || "",
            });
        }
    }, [aboutMeData?.data, reset]);

    useEffect(() => {
        if (isSuccess) {
            toast.success("About Me updated successfully!");
        } else if (isError) {
            toast.error("Failed to update About Me. Try again!");
        }
    }, [isSuccess, isError]);

    const onSubmit = async (data: AboutMeFormValues) => {
        const loadingToast = toast.loading("Updating About Me...");
        await updateAboutMe(data);
        toast.dismiss(loadingToast);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <section className="grid grid-cols-1 gap-6">
                    {/* CV URL (mapped to Resume) */}
                    <FormField
                        control={form.control}
                        name="resume"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="resume">CV URL (Resume)</FormLabel>
                                <FormControl>
                                    <Input
                                        id="resume"
                                        placeholder="Enter CV URL"
                                        {...field}
                                        required
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Short Description (mapped to title) */}
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="title">
                                    Short Description (Title)
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        id="title"
                                        placeholder="Enter a short description"
                                        {...field}
                                        required
                                        rows={5}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    {/* About Me (mapped to description) */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="description">About Me (Description)</FormLabel>
                                <FormControl>
                                    <Textarea
                                        id="description"
                                        placeholder="Write about yourself"
                                        {...field}
                                        required
                                        rows={6}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Contact & Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="email">Email</FormLabel>
                                    <FormControl>
                                        <Input id="email" placeholder="Email Address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="phone">Phone</FormLabel>
                                    <FormControl>
                                        <Input id="phone" placeholder="Phone Number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="location">Location</FormLabel>
                                    <FormControl>
                                        <Input id="location" placeholder="City, Country" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Social Links */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="github" render={({ field }) => (
                            <FormItem><FormLabel>GitHub</FormLabel><FormControl><Input placeholder="GitHub Profile URL" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="linkedin" render={({ field }) => (
                            <FormItem><FormLabel>LinkedIn</FormLabel><FormControl><Input placeholder="LinkedIn Profile URL" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="facebook" render={({ field }) => (
                            <FormItem><FormLabel>Facebook</FormLabel><FormControl><Input placeholder="Facebook Profile URL" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="twitter" render={({ field }) => (
                            <FormItem><FormLabel>Twitter / X</FormLabel><FormControl><Input placeholder="Twitter Profile URL" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="youtube" render={({ field }) => (
                            <FormItem><FormLabel>YouTube</FormLabel><FormControl><Input placeholder="YouTube Channel URL" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="instagram" render={({ field }) => (
                            <FormItem><FormLabel>Instagram</FormLabel><FormControl><Input placeholder="Instagram Profile URL" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                </section>

                {/* Submit Button */}
                <div className="py-5">
                    <Button type="submit">
                        {isFetching || isUpdating
                            ? "Saving..."
                            : "Save Changes"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
