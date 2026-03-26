export type TSession  = {
    isAuth: boolean;
    user: number | null
    role: 'superAdmin' | 'admin' | 'user' | 'guest'
}
