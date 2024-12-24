import ReduxProvider from "@/provider/redux-provider";
import { SessionProvider } from "@/provider/session-provider";
import { ThemeProvider } from "@/provider/theme-provider";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import "../styles/globals.css";

export const metadata: Metadata = {
    title: "Mohammad Ali | Full Stack Developer Portfolio",
    description:
        "Explore the portfolio of Mohammad Ali, a full stack web developer specializing in building dynamic, user-friendly web applications and scalable backend solutions.",
    keywords: [
        "Mohammad Ali portfolio",
        "Full stack developer",
        "Web development projects",
        "JavaScript expert",
        "Next.js developer",
        "MERN stack projects",
        "Dynamic portfolio website",
        "Frontend and backend development",
        "Software engineer portfolio",
        "React and Node.js developer",
        "Full stack web applications",
    ],
    openGraph: {
        title: "Mohammad Ali | Full Stack Developer Portfolio",
        description:
            "Discover the work and expertise of Mohammad Ali, a passionate full stack developer creating innovative web applications.",
        url: "https://md-ali.vercel.app",
        siteName: "Mohammad Ali Portfolio",
        images: [
            {
                url: "https://md-ali.vercel.app/og-image.png",
                width: 1200,
                height: 630,
                alt: "Mohammad Ali - Full Stack Developer Portfolio",
            },
        ],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Mohammad Ali | Full Stack Developer Portfolio",
        description:
            "Get to know Mohammad Ali, a full stack web developer with expertise in frontend and backend technologies. View projects and blogs.",
        images: ["https://md-ali.vercel.app/og-image.png"],
    },
    alternates: {
        canonical: "https://www.md-ali.vercel.app/",
    },
    robots: {
        index: true,
        follow: true,
    },
    other: {
        "application/ld+json": JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Mohammad Ali",
            url: "https://www.md-ali.vercel.app/",
            image: "https://www.md-ali.vercel.app/profile-image.png",
            description:
                "Full stack web developer with experience in building dynamic and scalable web applications using modern technologies.",
        }),
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
                <SessionProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <ReduxProvider>{children}</ReduxProvider>
                        <Toaster richColors={true} expand={false} />
                    </ThemeProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
