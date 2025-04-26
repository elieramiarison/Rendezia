"use client";

import { SessionProvider } from "next-auth/react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Footer from "./components/footer/page";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (!isDesktop) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2 className="text-red-600">Cette page est accessible uniquement sur un écran de PC.</h2>
      </div>
    );
  }

  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <div className="flex">
            <Sidebar />
            <div className="flex-1">
              <Navbar />
              <Toaster />
              <main className="p-4 bg-gray-100">{children}</main>
            </div>
          </div>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
