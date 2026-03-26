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
import { useUpdateSkillMutation } from "@/redux/features/skill/skillApi";
import { ErrorResponse, Skill, SkillLevel } from "@/types";
import { SerializedError } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./../ui/form";

interface EditSkillDialogProps {
    skill: Skill | null;
    open: boolean;
    onClose: () => void;
}

const EditSkillDialog = ({ skill, open, onClose }: EditSkillDialogProps) => {
    const form = useForm<Skill>({
        defaultValues: skill || {
            name: "",
            level: "" as unknown as SkillLevel
        },
        values: skill || undefined,
    });
    const { reset } = form;

    const [updateSkill, { isSuccess, isError, error }] =
        useUpdateSkillMutation();

    useEffect(() => {
        if (isError) {
            const errorResponse = error as ErrorResponse | SerializedError;

            const errorMessage =
                (errorResponse as ErrorResponse)?.data?.message ||
                "Something Went Wrong";

            toast.error(errorMessage);
        } else if (isSuccess) {
            toast.success("Skill Successfully Updated");
        }
    }, [isError, isSuccess, error]);

    useEffect(
        () =>
            reset(
                skill || {
                    name: "",
                    level: "" as unknown as SkillLevel
                }
            ),
        [skill, reset]
    );

    const onSubmit = async (data: Skill) => {
        const loadingToast = toast.loading("Skill is Updating...");

        if (skill) {
            await updateSkill({ data, id: skill?.id });
        }
        onClose();
        toast.dismiss(loadingToast);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                aria-describedby={undefined}
                className="sm:max-w-[525px]"
            >
                <DialogHeader>
                    <DialogTitle>Edit Skill</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="name">
                                        Skill Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            id="name"
                                            placeholder="Enter Skill Name"
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
                        <DialogFooter className="col-span-2">
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EditSkillDialog;
