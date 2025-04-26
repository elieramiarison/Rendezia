import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { HomeIcon } from "lucide-react";
import { FaPowerOff } from "react-icons/fa";
import { Calendar } from "lucide-react";
import { IoPerson } from "react-icons/io5";
import { usePathname } from "next/navigation";
import { MdOutlinePerson } from "react-icons/md";
import Image from "next/image";

const Sidebar = () => {
  const { data: session, status }: any = useSession()
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/doctor/dashboard", icon: <HomeIcon size={22} /> },
    { label: "Profil", href: "/doctor/dashboard/profil", icon: <MdOutlinePerson size={25} /> },
    { label: "Disponibilité", href: "/doctor/dashboard/disponibilite", icon: <Calendar size={22} /> },
  ];

  return (
    <aside className="w-48 bg-[#08a6a0] text-white min-h-screen p-5">
      <div className="text-center flex flex-col justify-center items-center">
        <div className="relative w-20 h-20">
          <Image
            src={session?.user?.image || "/default-avatar.png"}
            alt="Photo de profil"
            width={100}
            height={100}
            className="w-20 h-20 rounded-full object-cover cursor-pointer border-2 border-gray-300"
          />
          <span className="absolute bottom-0 right-3 w-[0.85rem] h-[0.85rem] bg-green-500 border border-white rounded-full"></span>
        </div>

        <h2 className="text-xl font-semibold mt-2">
          {session?.user?.name} {session?.user?.firstName}
        </h2>
      </div>

      <ul className="mt-5 flex flex-col gap-4">
        {navItems.map(({ href, label, icon }) => (
          <Link key={href} href={href}>
            <li
              className={`p-2 rounded-md flex gap-2 items-center cursor-pointer
                    ${pathname === href ? "bg-gray-100 text-[#08a6a0] font-semibold mr-[-5rem]" : "hover:bg-[#1e9795]"}`}
            >
              {icon} {label}
            </li>
          </Link>
        ))}

        <li
          onClick={() => signOut({ callbackUrl: "/" })}
          className="p-2 rounded-md hover:bg-[#1e9795] hover:text-red-500 cursor-pointer flex gap-2 items-center"
        >
          <FaPowerOff /> Déconnexion
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
