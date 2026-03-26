/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useUpdateExperienceMutation } from "@/redux/features/experience/experienceApi";
import { ErrorResponse, Experience } from "@/types";
import { formatDate } from "@/utils/date-format";
import { SerializedError } from "@reduxjs/toolkit";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./../ui/form";

interface EditExperienceDialogProps {
    experience: Experience | null;
    open: boolean;
    onClose: () => void;
}

type EditExperienceFormValues = Omit<Experience, "achievements" | "technologies"> & {
    achievements: { value: string }[];
    technologies: { value: string }[];
};

const EditExperienceDialog = ({
    experience,
    open,
    onClose,
}: EditExperienceDialogProps) => {
    const form = useForm<EditExperienceFormValues>({
        defaultValues: {
            companyName: "",
            position: "",
            description: "",
            icon: "",
            startDate: new Date(),
            endDate: null,
            achievements: [{ value: "" }],
            technologies: [{ value: "" }],
        },
    });
    
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

    const [updateExperience, { isSuccess, isError, error }] =
        useUpdateExperienceMutation();

    useEffect(() => {
        if (isError) {
            const errorResponse = error as ErrorResponse | SerializedError;
            const errorMessage =
                (errorResponse as ErrorResponse)?.data?.message ||
                "Something Went Wrong";
            toast.error(errorMessage);
        } else if (isSuccess) {
            toast.success("Experience Successfully Updated");
            onClose();
        }
    }, [isError, isSuccess, error, onClose]);

    useEffect(() => {
        if (experience) {
            reset({
                ...experience,
                startDate: new Date(experience.startDate),
                endDate: experience.endDate ? new Date(experience.endDate) : null,
                achievements: experience.achievements?.length 
                    ? experience.achievements.map(val => ({ value: val })) 
                    : [{ value: "" }],
                technologies: experience.technologies?.length 
                    ? experience.technologies.map(val => ({ value: val })) 
                    : [{ value: "" }],
            }, { keepDefaultValues: true });
        }
    }, [experience, reset]);

    const onSubmit = async (data: EditExperienceFormValues) => {
        const loadingToast = toast.loading("Experience is Updating...");
        const formattedData = {
            ...data,
            startDate: data.startDate instanceof Date ? data.startDate.toISOString() : data.startDate,
            endDate: data.endDate instanceof Date ? data.endDate.toISOString() : (data.endDate || null),
            achievements: data.achievements.map(a => a.value).filter(val => val.trim() !== ""),
            technologies: data.technologies.map(t => t.value).filter(val => val.trim() !== ""),
        };

        if (experience) {
            await updateExperience({ data: formattedData, id: experience?.id });
        }
        toast.dismiss(loadingToast);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                aria-describedby={undefined}
                className="sm:max-w-[600px]"
            >
                <DialogHeader>
                    <DialogTitle>Edit Experience</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[80vh] px-1">
                    <Form {...form}>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-4 p-1"
                        >
                            <div className="grid grid-cols-2 gap-4">
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
                            </div>

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

                            <FormField
                                control={control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Enter Job Description" {...field} required rows={4} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Achievements */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <FormLabel>Achievements</FormLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => appendAchievement({ value: "" })}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {achievementFields.map((field, index) => (
                                        <div key={field.id} className="flex gap-2">
                                            <FormField
                                                control={control}
                                                name={`achievements.${index}.value`}
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormControl>
                                                            <Input placeholder="Achievement" {...field} />
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
                            </div>

                            {/* Technologies */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <FormLabel>Technologies</FormLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => appendTechnology({ value: "" })}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {technologyFields.map((field, index) => (
                                        <div key={field.id} className="flex gap-2">
                                            <FormField
                                                control={control}
                                                name={`technologies.${index}.value`}
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormControl>
                                                            <Input placeholder="Technology" {...field} />
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
                            </div>

                            <div className="grid grid-cols-2 gap-4">
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
                                                        selected={field.value as Date}
                                                        onSelect={(date) => field.onChange(date)}
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
                                                        selected={field.value as Date}
                                                        onSelect={(date) => field.onChange(date)}
                                                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <DialogFooter className="pt-4">
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit">Save Changes</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default EditExperienceDialog;
