export type Post = {
    id: string;
    slug: string;
    thumbnail: string;
    title: string;
    shortDescription: string;
    authorId: string;
    categoryId: string;
    content: string;
    metaTitle: string | null;
    metaDesc: string | null;
    metaKey: string | null;
    createdAt: Date;
    updatedAt: Date;
}