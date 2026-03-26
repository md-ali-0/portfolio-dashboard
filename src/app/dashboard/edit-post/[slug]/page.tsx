import EditPostForm from "@/components/dashboard-forms/post-edit-form";
import Breadcrumb from "@/components/shared/breadcrumb";
import { Button } from "@/components/ui/button";
import config from "@/config";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditPostPage( { params : {slug}} : {params: {slug: string}}) {

    const result = await fetch(`${config.host}/api/v1/post/${slug}`, {
        cache: "no-store"
    })
    const post = await result.json()

    if (!post?.data) {
        return notFound()
    }

    return (
        <div>
            <Breadcrumb />
            <div className="rounded-xl border border-border bg-card mt-5 shadow-sm overflow-hidden">
                <div className="flex justify-between items-center border-b border-border px-7 py-4">
                    <h3 className="font-semibold text-foreground">
                        Edit Post
                    </h3>
                    <Button asChild variant={"default"} size={"sm"}>
                        <Link href={"/dashboard/posts"}>Manage Posts</Link>
                    </Button>
                </div>
                <div className="p-7">
                    <EditPostForm post={post?.data} />
                </div>
            </div>
        </div>
    );
}
