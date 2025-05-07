"use client";

import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";
import Footer from "./footer/page";
import Navbar from "./Navbar";

export default function DashboardClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <Navbar />
            <ToastContainer position="bottom-right" autoClose={3000} />
            <Toaster />
            <main className="flex-1 bg-gray-100">{children}</main>
            <Footer />
        </SessionProvider>
    );
}
