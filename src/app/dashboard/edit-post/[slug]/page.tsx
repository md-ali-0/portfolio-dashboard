import EditPostForm from "@/components/dashboard-forms/post-edit-form";
import Breadcrumb from "@/components/shared/breadcrumb";
import { Button } from "@/components/ui/button";
import config from "@/config";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditPostPage( { params : {slug}} : {params: {slug: string}}) {

    const result = await fetch(`${config.host}/api/post/${slug}`, {
        cache: "no-store"
    })
    const post = await result.json()

    if (!post?.data) {
        return notFound()
    }

    return (
        <div>
            <Breadcrumb />
            <div className="rounded-sm border bg-white dark:bg-gray-900 mt-5">
                <div className="flex justify-between items-center border-b px-7 py-4">
                    <h3 className="font-medium text-black dark:text-white">
                        Create New Post
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
