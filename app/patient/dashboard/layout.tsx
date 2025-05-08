import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClientLayout from "../components/DashboardClientLayout";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/patient/login");
    }

    return <DashboardClientLayout>{children}</DashboardClientLayout>;
}

// "use client";

// import { SessionProvider } from "next-auth/react";
// import Footer from "../components/footer/page";
// import { ToastContainer } from "react-toastify";
// import { Toaster } from "react-hot-toast";
// // import dynamic from "next/dynamic";
// import Navbar from "../components/Navbar";

// // const Navbar = dynamic(() => import('../components/Navbar'), { ssr: false });

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//     return (
//         // <html lang="en">
//         //     <body>
//         <SessionProvider>
//             <Navbar />
//             <ToastContainer position="bottom-right" autoClose={3000} />
//             <Toaster />
//             <main className="flex-1 bg-gray-100">{children}</main>
//             <Footer />
//         </SessionProvider>
//         //     </body>
//         // </html>
//     );
// }