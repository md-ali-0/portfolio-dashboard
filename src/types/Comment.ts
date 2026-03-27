export type Comment = {
    id: string;
    postId: string;
    name: string;
    email: string;
    picture?: string | null;
    content: string;
    isApproved: boolean;
    approvedBy?: string | null;
    approvedAt?: Date | null;
    parentId?: string | null;
    ipAddress?: string | null;
    userAgent?: string | null;
    deletedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    post?: {
        id: string;
        title: string;
        slug: string;
    };
};
