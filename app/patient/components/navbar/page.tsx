"use client";

import Image from "next/image"
import { useSession } from "next-auth/react"
import Link from "next/link";
import { signOut } from "next-auth/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { IoAccessibilityOutline, IoPerson, IoHomeOutline } from "react-icons/io5";
import { FaPowerOff } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export default function Navbar() {
    if (typeof window === "undefined") {
        // Pendant le build => pas de session
        return null;
    }

    const { data: session } = useSession()
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!document.getElementById("dropdown")?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [])

    const handleClick = () => {
        alert("Bonjour, cette section est encore en cours de développement...")
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
                    href="/patient/dashboard/profil"
                    className="relative group px-0 py-2"
                >
                    Votre profil
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gray-100 transition-all duration-300 ease-in-out group-hover:w-full"></span>
                </Link>

                <Link
                    href="/patient/dashboard/rendez-vous"
                    className="relative group px-0 py-2"
                >
                    Rendez-vous
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gray-100 transition-all duration-300 ease-in-out group-hover:w-full"></span>
                </Link>
            </div>



            <div className="relative" id="dropdown">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 bg-white lg:p-1 md:p-1 sm:p-0 p-0 rounded-full hover:bg-gray-300 transition"
                >
                    <Image
                        src={session?.user?.image || "/default-avatar.png"}
                        alt="Photo de profil"
                        width={40} height={40}
                        className="w-10 h-10 rounded-full object-cover  border-2 border-gray-200"
                    />
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {/* Menu déroulant */}
                <div style={{ display: isOpen ? "block" : "none" }} className="absolute">
                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2">
                            <Link href="/patient/dashboard/profil" onClick={() => setIsOpen(false)} className="flex items-center gap-2 font-bold px-4 py-1 hover:bg-gray-100">
                                <IoPerson size={17} /> {session?.user?.name}
                            </Link>

                            <hr className="my-1" />

                            <Link href="/patient/dashboard/" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
                                <IoHomeOutline size={17} />Accueil
                            </Link>

                            <Link href="/patient/dashboard/rendez-vous" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100">
                                <IoAccessibilityOutline size={17} /> Rendez-vous
                            </Link>

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