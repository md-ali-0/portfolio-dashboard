export type Post = {
    id: string;
    slug: string;
    thumbnail?: string | File | null;
    featuredImage?: string | null;
    title: string;
    excerpt?: string | null;
    authorId: string;
    categoryId: string;
    content: string;
    metaTitle: string | null;
    metaDesc: string | null;
    metaKey: string | null;
    createdAt: Date;
    updatedAt: Date;
}
