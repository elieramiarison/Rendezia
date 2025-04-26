"use client";

import Image from "next/image"
import { useSession } from "next-auth/react"
import Link from "next/link";
import { signOut } from "next-auth/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { IoAccessibility, IoPerson, IoSettingsOutline, IoTrailSignOutline } from "react-icons/io5";
import { FaHome } from "react-icons/fa";

export default function Navbar() {
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

  return (
    <div className="w-full bg-[#08a6a0] shadow-md flex justify-between items-center fixed z-[100] lg:px-20 md:px-20 sm:px-20 px-10 sm:px-15">
      <div>
        <Image src="/rms.png" alt="logo" width={80} height={80} />
      </div>

      <div className="flex justify-center items-center text-white md:flex hidden">

        <Link href="/doctor/dashboard/" className="block px-4 py-2 hover:border-b-2 hover:border-white">Accueil</Link>

        <Link href="/doctor/dashboard/profil" className="block px-4 py-2 hover:border-b-2 hover:border-white">Profil</Link>

        <Link href="/doctor/dashboard/disponibilite" className="block px-4 py-2 hover:border-b-2 hover:border-white">Disponibilité</Link>

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
            className="rounded-full border-2 border-gray-200"
          />
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {/* Menu déroulant */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2">
            <Link href="/doctor/dashboard/profil" className="flex items-center gap-2 font-bold px-4 py-1 hover:bg-gray-100"><IoPerson size={17} /> {session?.user?.name}</Link>
            <hr className="my-1" />
            <Link href="/doctor/dashboard/" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"><FaHome size={17} />Accueil</Link>
            <Link href="/doctor/dashboard/disponibilite" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"><IoAccessibility size={17} />Disponibilité</Link>
            <h1 className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"><IoSettingsOutline size={17} />Parametre</h1>
            <hr className="my-1" />
            <span className="px-4 text-gray-500 text-xs">DECONNEXION</span>
            <div className=" px-4 py-2 hover:bg-gray-100 hover:text-red-500">
              <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-2" ><IoTrailSignOutline size={17} />Déconnexion</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}