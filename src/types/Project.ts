export type Project = {
    thumbnail: string;
    id: string;
    title: string;
    slug: string;
    content: string;
    authorId: string;
    liveUrl: string | null;
    StartDate: Date;
    EndDate: Date | null;
    category: string;
    metaTitle: string | null;
    metaDesc: string | null;
    metaKey: string | null;
    createdAt: Date;
    updatedAt: Date;
};
