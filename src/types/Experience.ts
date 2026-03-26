export type Experience = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    companyName: string;
    position: string;
    description: string;
    startDate: Date;
    endDate: Date | null;
    userId: string;
}