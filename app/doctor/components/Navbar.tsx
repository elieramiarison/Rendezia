import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { MdNotificationsNone } from "react-icons/md";
import { CiSettings } from "react-icons/ci";

const Navbar = () => {
    const { data: session, status } = useSession()
    const pathname = usePathname();

    // Mapping entre chemin et label
    const getTitle = (path: string) => {
        if (path === "/doctor/dashboard") return "Dashboard";
        if (path === "/doctor/dashboard/profil") return "Profil";
        if (path === "/doctor/dashboard/disponibilite") return "Disponibilité";
        return "Page";
    };

    const handleClick = () => {
        alert("Bonjour, cette section est encore en cours de développement...")
    }

    const title = getTitle(pathname);
    return (
        <nav className="bg-white shadow-lg p-4 flex justify-between items-center">
            <h1 className="font-bold text-lg">{title}</h1>
            <div className="flex items-center gap-4">
                <div onClick={handleClick} className="relative flex justify-center items-center cursor-pointer">
                    <MdNotificationsNone size={28} />
                    {/* Pastille de notification */}
                    <span className="absolute top-0 right-[6rem] translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold px-1 py-.25 rounded-full">
                        5
                    </span>
                    <h1 className="ml-2">Notification</h1>
                </div>

                <div onClick={handleClick} className="flex justify-center items-center cursor-pointer">
                    <CiSettings size={28} />
                    <h1 className="ml-2">Paramètres</h1>
                </div>

                <img
                    src={session?.user?.image || "Pas d'image"}
                    alt="User"
                    className="w-10 h-10 rounded-full"
                />
            </div>

        </nav>
    );
};

export default Navbar;
