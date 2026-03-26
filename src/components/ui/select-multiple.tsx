"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

interface Option {
    value: string;
    label: string;
}

interface SelectMultipleProps {
    options: Option[];
    selectedOptions: string[]; // Keep it as string[]
    onChange: (selectedOptions: string[]) => void; // Expecting string[] as onChange input
}

const SelectMultiple: React.FC<SelectMultipleProps> = ({
    options,
    selectedOptions,
    onChange,
}) => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const handleToggle = (value: string) => {
        if (selectedOptions.includes(value)) {
            onChange(selectedOptions.filter((option) => option !== value));
        } else {
            onChange([...selectedOptions, value]);
        }
    };

    // Filter options based on search query
    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SelectPrimitive.Root>
            <SelectTrigger>
                <span>
                    {selectedOptions.length > 0
                        ? selectedOptions.length > 3
                            ? `${selectedOptions
                                  .slice(0, 3) // Show only the first 3 selected options
                                  .map((id) => {
                                      const option = options.find(
                                          (option) => option.value === id
                                      );
                                      return option ? option.label : ""; // Find label for each selected option ID
                                  })
                                  .join(", ")} ++ More..`
                            : selectedOptions
                                  .map((id) => {
                                      const option = options.find(
                                          (option) => option.value === id
                                      );
                                      return option ? option.label : ""; // Find label for each selected option ID
                                  })
                                  .join(", ")
                        : "Select options"}
                </span>
            </SelectTrigger>
            {/* <SelectTrigger>
                <span>
                    {selectedOptions.length > 0
                        ? selectedOptions.length > 3
                            ? `${selectedOptions
                                  .slice(0, 3) // Show only the first 3 selected options
                                  .map((id) => {
                                      const option = options.find(
                                          (option) => option.value === id
                                      );
                                      return option ? option.label : ""; // Find label for each selected option ID
                                  })
                                  .join(", ")} ++ More..`
                            : selectedOptions
                                  .map((id) => {
                                      const option = options.find(
                                          (option) => option.value === id
                                      );
                                      return option ? option.label : ""; // Find label for each selected option ID
                                  })
                                  .join(", ")
                        : "Select options"}
                </span>
            </SelectTrigger> */}
            <SelectContent>
                {/* Search input field */}
                <input
                    type="text"
                    className="w-full p-2 mb-2 border rounded-md"
                    placeholder="Search options..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {filteredOptions.length === 0 ? (
                    <div className="p-2 text-muted-foreground">
                        No options found
                    </div>
                ) : (
                    filteredOptions.map((option) => (
                        <SelectItem
                            key={option.value}
                            selected={selectedOptions.includes(option.value)}
                            onToggle={() => handleToggle(option.value)}
                        >
                            {option.label}
                        </SelectItem>
                    ))
                )}
            </SelectContent>
        </SelectPrimitive.Root>
    );
};

const SelectTrigger = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Trigger
        ref={ref}
        className={cn(
            "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
            className
        )}
        {...props}
    >
        {children}
        <SelectPrimitive.Icon asChild>
            <ChevronDown className="h-4 w-4 opacity-50" />
        </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
    <SelectPrimitive.Portal>
        <SelectPrimitive.Content
            ref={ref}
            className={cn(
                "relative z-50 max-h-44 min-w-[8rem] overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                position === "popper" &&
                    "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
                className
            )}
            position={position}
            {...props}
        >
            {children}
        </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectItem: React.FC<{
    children: React.ReactNode;
    selected: boolean;
    onToggle: () => void;
}> = ({ children, selected, onToggle }) => {
    return (
        <div
            className={cn(
                "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground"
            )}
            onClick={onToggle}
        >
            <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                {selected && <Check className="h-4 w-4" />}
            </span>
            {children}
        </div>
    );
};

export default SelectMultiple;
