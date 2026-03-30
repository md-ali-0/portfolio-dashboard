"use client";

import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useState } from "react";

type RichTextEditorProps = {
    value?: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    height?: number;
};

export default function RichTextEditor({
    value = "",
    onChange,
    onBlur,
    height = 500,
}: RichTextEditorProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="min-h-[320px] rounded-md border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                Loading editor...
            </div>
        );
    }

    return (
        <Editor
            tinymceScriptSrc="/tinymce/tinymce.min.js"
            value={value}
            licenseKey="gpl"
            init={{
                base_url: "/tinymce",
                suffix: ".min",
                height,
                plugins: [
                    "anchor",
                    "autolink",
                    "charmap",
                    "codesample",
                    "image",
                    "code",
                    "link",
                    "lists",
                    "media",
                    "searchreplace",
                    "table",
                    "visualblocks",
                    "wordcount",
                ],
                toolbar:
                    "undo redo | bold italic underline strikethrough | image link code table | align lineheight | numlist bullist indent outdent | charmap | removeformat",
                images_upload_url: "/api/upload",
                branding: false,
                promotion: false,
                skin_url: "/tinymce/skins/ui/tinymce-5-dark",
                content_css: "/tinymce/skins/content/dark/content.min.css",
                content_style:
                    "body { font-family:Inter,Helvetica,Arial,sans-serif; font-size:14px; background-color:#18181b; color:#f4f4f5; }",
            }}
            onEditorChange={onChange}
            onBlur={onBlur}
        />
    );
}
