export type User = {
    id: string;
    email: string;
    password: string;
    name: string;
    avatar: string;
    phone: string | null;
    city: string | null;
    state: string | null;
    zip_code: string | null;
    address: string | null;
    country: string | null;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
};

export enum Role {
    ADMIN,
}
