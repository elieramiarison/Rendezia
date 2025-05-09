"use client"

import Link from "next/link";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Session } from "next-auth";

interface UserSession {
    name?: string;
    firstName?: string;
    email?: string;
    image?: string;
    annif?: string;
    lieu?: string;
    adresse?: string;
    tel?: string;
}

interface CustomSession extends Session {
    user?: UserSession;
}

const Profile = () => {
    const { data: session, status } = useSession() as {
        data: CustomSession | null;
        status: "loading" | "authenticated" | "unauthenticated";
    };
    const router = useRouter();


    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/patient/login");
        }
    }, []);

    if (status === "loading") {
        return (
            <div className="flex justify-center items-center h-screen ">
                <h1>Chargement...</h1>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <div className="flex justify-center items-center h-screen ">
                <h1 className="text-red-600">Redirection...</h1>
            </div>
        );
    }

    return (
        <main className="bg-gray-100 w-full h-full mx-auto">
            <div className="pt-12">
                <div className="flex md:flex-row flex-col md:items-center items-start justify-between px-7 mt-10 gap-4 w-[87%] md:h-32 h-auto bg-white rounded-md border-b-4 border-b-[#08a6a0] mx-auto">
                    <div className="flex items-center justify-start gap-4 md:mt-0 mt-4 ">
                        {/* <div className="relative w-16 h-auto mt-4 pr-2"> */}
                        {session?.user?.image ? (
                            <Image
                                src={session?.user?.image}
                                alt="Photo de profil"
                                width={100}
                                height={100}
                                className="lg:w-20 lg:h-20 md:w-20 md:h-20 sm:w-16 sm:h-16 w-16 h-16 rounded-full border-2 border-gray-600 object-cover pointer-events-none select-none" draggable={false}
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-gray-400 flex items-center justify-center text-white text-2xl font-bold border-2 border-gray-600 cursor-pointer">
                                {session?.user?.name?.[0]?.toUpperCase() || ""}
                                {session?.user?.firstName?.[0]?.toUpperCase() || ""}
                            </div>
                        )}
                        {/* </div> */}
                        <h2 className="lg:text-3xl md:text-2xl text-lg font-bold text-center"> {session?.user?.name} {session?.user?.firstName}</h2>
                    </div>
                    <Link href="/patient/dashboard/updateProfil">
                        <button className="text-[#08a6a0] border-[1px] border-[#08a6a0] p-2 px-6 rounded-md font-semibold hover:bg-gray-100 lg:flex md:flex hidden">Modifier le profil</button>

                        <a className=" rounded-full font-semibold hover:bg-gray-100 block md:hidden mb-4 underline">Modifier le profil</a>
                    </Link>
                </div>
            </div>

            <div className="pt-7 w-[87%] mx-auto">
                <h1 className="font-bold md:text-xl text-base">Infos personnelles</h1>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white py-6 px-2 cursor-pointer mt-5 rounded-md shadow-md">
                        <h1 className="font-semibold md:text-xl text-base">Nom :</h1>
                        <h1 className="font-semibold text-base">{session?.user?.name}</h1>
                        <p className="md:text-base text-sm">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit facilis ipsa consequuntur</p>
                    </div>

                    <div className="bg-white py-6 px-2 cursor-pointer mt-5 rounded-md shadow-md">
                        <h1 className="font-semibold md:text-xl text-base">Prénom :</h1>
                        <h1 className="font-semibold text-base">{session?.user?.firstName}</h1>
                        <p className="md:text-base text-sm">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit facilis ipsa consequuntur</p>
                    </div>

                    <div className="bg-white py-6 px-2 mt-5 rounded-md shadow-md">
                        <h1 className="font-semibold md:text-xl text-base">Mail :</h1>
                        <h1 className="font-semibold text-base">{session?.user?.email}</h1>
                        <p className="md:text-base text-sm">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit facilis ipsa consequuntur</p>
                    </div>

                    <div className="bg-white py-6 px-2 cursor-pointer mt-5 rounded-md shadow-md">
                        <h1 className="font-semibold md:text-xl text-base">Date de naissance :</h1>
                        <h1 className="font-semibold text-base">{session?.user?.annif}</h1>
                        <p className="md:text-base text-sm">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit facilis ipsa consequuntur</p>
                    </div>

                    <div className="bg-white py-6 px-2 cursor-pointer mt-5 rounded-md shadow-md">
                        <h1 className="font-semibold md:text-xl text-base">Lieu de naissance :</h1>
                        <h1 className="font-semibold text-base">à {session?.user?.lieu}</h1>
                        <p className="md:text-base text-sm">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit facilis ipsa consequuntur</p>
                    </div>

                    <div className="bg-white py-6 px-2 cursor-pointer mt-5 rounded-md shadow-md">
                        <h1 className="font-semibold md:text-xl text-base">Adresse :</h1>
                        <h1 className="font-semibold text-base">{session?.user?.adresse}</h1>
                        <p className="md:text-base text-sm">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit facilis ipsa consequuntur</p>
                    </div>

                    <div className="bg-white py-6 px-2 cursor-pointer mt-5 rounded-md shadow-md">
                        <h1 className="font-semibold md:text-xl text-base">Téléphone :</h1>
                        <h1 className="font-semibold text-base">{session?.user?.tel}</h1>
                        <p className="md:text-base text-sm">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit facilis ipsa consequuntur</p>
                    </div>
                </div>
            </div>

            <div className="bg-[#e0f5f4] mt-5 p-3 w-[87%] mx-auto">
                <h1><span className="underline cursor-pointer">Retournez à vos paramètres</span> pour éditer vos informations de forum, paiement et préférences.</h1>
            </div>
        </main>
    );
};

export default Profile;
