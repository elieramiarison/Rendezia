"use client";

import { SessionProvider } from "next-auth/react";
// import Navbar from "../components/navbar/page";
import Footer from "../components/footer/page";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";

const Navbar = dynamic(() => import('../components/navbar/Narbar'), { ssr: false });

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        // <html lang="en">
        //     <body>
        <SessionProvider>
            <Navbar />
            <ToastContainer position="bottom-right" autoClose={3000} />
            <Toaster />
            <main className="flex-1 bg-gray-100">{children}</main>
            <Footer />
        </SessionProvider>
        //     </body>
        // </html>
    );
}
