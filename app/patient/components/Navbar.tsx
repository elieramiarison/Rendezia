"use client";

import Image from "next/image"
import { useSession } from "next-auth/react"
import Link from "next/link";
import { signOut } from "next-auth/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { IoAccessibilityOutline, IoPerson, IoHomeOutline, IoChatbox } from "react-icons/io5";
import { FaPowerOff } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { useRef } from "react";
import NProgress from "nprogress";
import { MdNotificationsNone } from "react-icons/md";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import "nprogress/nprogress.css";

interface UserSession {
    name?: string;
    firstName?: string;
    image?: string;
}

interface CustomSession extends Session {
    user?: UserSession;
}

export default function Navbar() {

    const { data: session } = useSession() as { data: CustomSession | null };
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter()

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            const res = await fetch("/api/auth/session/[...nextauth]");
            if (res.status === 401) {
                router.push("/patient/login");
            }
        }, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    const handleClick = () => {
        alert("Bonjour,\n \nCette section est encore en cours de développement...");
    }

    const handleLogout = async () => {
        NProgress.start();
        await signOut({ callbackUrl: "/" });
        NProgress.done();
    };


    return (
        <div className="w-full h-[4.5rem] bg-[#08a6a0] shadow-md flex justify-between items-center fixed z-[100] lg:px-20 md:px-20 sm:px-12 px-[1.5rem]">
            <div>
                {/* <Image src="/logo2.png" alt="logo" width={80} height={20} className="md:w-[5rem] w-[4rem" /> */}
                <h1 className="font-[cursive] md:text-3xl text-2xl text-white">Rendezia</h1>
            </div>
            <div className="flex justify-center lg:gap-12 md:gap-8 items-center text-white md:flex hidden">
                <Link
                    href="/patient/dashboard/"
                    className="relative group px-0 py-2"
                >
                    Accueil
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gray-100 transition-all duration-300 ease-in-out group-hover:w-full"></span>
                </Link>

                <Link
                    href="/patient/dashboard/rendez-vous"
                    className="relative group px-0 py-2"
                >
                    Rendez-vous
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gray-100 transition-all duration-300 ease-in-out group-hover:w-full"></span>
                </Link>

                <Link
                    href="/patient/dashboard/profil"
                    className="relative group px-0 py-2"
                >
                    Votre profil
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gray-100 transition-all duration-300 ease-in-out group-hover:w-full"></span>
                </Link>
            </div>

            <div className="relative flex gap-4" ref={dropdownRef}>
                <div onClick={handleClick} className="relative flex justify-center items-center cursor-pointer">
                    <MdNotificationsNone size={28} color="#fff" />
                    <span className="absolute top-3 right-[0.3rem] translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold px-1 py-.25 rounded-full">
                        +5
                    </span>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 bg-white lg:p-1 md:p-1 sm:p-0 p-0 rounded-full hover:bg-gray-300 transition"
                >
                    {session?.user?.image ? (
                        <Image
                            src={session?.user?.image || "/default-avatar.png"}
                            alt="Photo de profil"
                            width={40} height={40}
                            className="w-5 h-5 rounded-full object-cover  border-2 border-gray-200"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white text-base font-bold border-2 border-gray-600 cursor-pointer">
                            {session?.user?.name?.[0]?.toUpperCase() || ""}
                            {session?.user?.firstName?.[0]?.toUpperCase() || ""}
                        </div>
                    )}
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {/* Menu déroulant */}
                <div style={{ display: isOpen ? "block" : "none" }} className="absolute">
                    {isOpen && (
                        <div className="absolute right-[-6rem] mt-12 w-48 bg-white shadow-lg rounded-lg py-2">
                            <Link href="/patient/dashboard/profil" onClick={() => setIsOpen(false)} className="flex items-center gap-2 font-bold px-4 py-1 hover:bg-gray-100">
                                <IoPerson size={17} /> {session?.user?.name}...
                            </Link>

                            <hr className="my-1" />

                            <Link href="/patient/dashboard/" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
                                <IoHomeOutline size={17} />Accueil
                            </Link>

                            <Link href="/patient/dashboard/rendez-vous" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
                                <IoAccessibilityOutline size={17} /> Rendez-vous
                            </Link>

                            <div onClick={handleClick} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                <IoChatbox size={17} /> Message
                            </div>

                            <Link href="/patient/dashboard/updateProfil" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
                                <MdEdit size={17} /> Modifier profil
                            </Link>

                            <div onClick={handleClick} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                <Settings size={17} /> Paramètres
                            </div>

                            <hr className="my-1" />
                            <span className="px-4 text-gray-500 text-xs">DECONNEXION</span>

                            <div className="px-4 py-2 hover:bg-gray-100 hover:text-red-500">
                                <button onClick={() => { setIsOpen(false); handleLogout(); }} className="flex items-center gap-2">
                                    <FaPowerOff size={17} /> Déconnexion
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}