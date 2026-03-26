export type TSession  = {
    isAuth: boolean;
    user: string | null
    role: 'superAdmin' | 'admin' | 'user' | 'guest'
}
