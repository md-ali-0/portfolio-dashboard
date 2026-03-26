import SignInForm from "@/components/auth/signin-form";

const Page = () => {
    return (
        <div className="dark min-h-screen flex flex-col items-center justify-center py-5 px-4" style={{ background: '#111113' }}>
            <div className="relative max-w-md w-full">
                <SignInForm />
            </div>
        </div>
    );
};

export default Page;
