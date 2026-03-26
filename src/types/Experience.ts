export type Experience = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    companyName: string;
    position: string;
    description: string;
    icon?: string;
    startDate: Date;
    endDate: Date | null;
    achievements: string[];
    technologies: string[];
    userId: string;
}