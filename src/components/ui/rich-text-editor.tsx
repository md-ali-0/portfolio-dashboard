"use client";

import dynamic from "next/dynamic";

const TinyMCEEditor = dynamic(
    () => import("@tinymce/tinymce-react").then((module) => module.Editor),
    {
        ssr: false,
        loading: () => (
            <div className="min-h-[320px] rounded-md border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                Loading editor...
            </div>
        ),
    }
);

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
    return (
        <TinyMCEEditor
            apiKey="lqre26087xr8qx73ci2q2p5xufo4o5b5zm0vcrt203awvvnx"
            tinymceScriptSrc="/tinymce/tinymce.min.js"
            value={value}
            init={{
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
                skin_url: "/tinymce/skins/ui/oxide",
                content_css: "/tinymce/skins/content/default/content.min.css",
                content_style:
                    "body { font-family:Inter,Helvetica,Arial,sans-serif; font-size:14px; background-color:#ffffff; color:#111827; }",
            }}
            onEditorChange={onChange}
            onBlur={onBlur}
        />
    );
}
