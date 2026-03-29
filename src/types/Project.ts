export type ProjectImage = {
    id: string;
    url: string;
    projectId: string;
    createdAt: Date | string;
    updatedAt: Date | string;
};

export type Project = {
    thumbnail: string | null;
    id: string;
    title: string;
    slug: string;
    content: string;
    authorId: string;
    images: Array<string | ProjectImage> | null;
    liveUrl: string | null;
    SourceFront: string | null;
    SourceBack: string | null;
    StartDate: Date;
    EndDate: Date | null;
    category: string;
    languages: string[];
    technologies: string[];
    metaTitle: string | null;
    metaDesc: string | null;
    metaKey: string | null;
    createdAt: Date;
    updatedAt: Date;
};
