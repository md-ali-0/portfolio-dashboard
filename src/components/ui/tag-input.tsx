import { useState } from "react";

interface TagInputProps {
    value: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
}

export default function TagInput({ value, onChange, placeholder }: TagInputProps) {
    const [inputValue, setInputValue] = useState("");

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            e.preventDefault();
            if (!value.includes(inputValue.trim())) {
                onChange([...value, inputValue.trim()]);
            }
            setInputValue("");
        }
    };

    const handleRemoveTag = (tag: string) => {
        onChange(value.filter((t) => t !== tag));
    };

    return (
        <div className="flex flex-wrap items-center border rounded-md p-2 gap-2">
            {value.map((tag, index) => (
                <span
                    key={index}
                    className="flex items-center bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-sm"
                >
                    {tag}
                    <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-red-500"
                    >
                        &times;
                    </button>
                </span>
            ))}
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder={placeholder || "Add a tag..."}
                className="flex-grow outline-none border-none text-sm"
            />
        </div>
    );
}
