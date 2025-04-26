"use client"

import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";

const Profile = () => {
  const { data: session }: Record<string, any> = useSession()
  if (!session || !session.user) {
    return <p>Chargement de la session...</p>;
  }

  return (
    <main className="bg-gray-100 w-full h-full mx-auto">
      <div className="pt-0">
        <div className="flex items-center justify-between px-7 gap-4 w-[100%] h-32 bg-white rounded-md border-b-4 border-b-[#08a6a0] mx-auto">
          <div className="flex items-center justify-start gap-4 md:mt-0 mt-4 ">
            {session?.user?.image ? (
              <Image
                src={session?.user?.image}
                alt="Photo de profil"
                width={90}
                height={90}
                className="w-20 h-20 rounded-full object-cover cursor-pointer border-2 border-gray-300"
              />
            ) : null}
            <h2 className="lg:text-3xl md:text-2xl text-xl font-bold text-center"> {session?.user?.name} {session?.user?.firstName}</h2>
          </div>
          <Link href="/doctor/dashboard/updateProfil">
            <button className="text-[#08a6a0] border-[1px] border-[#08a6a0] p-2 px-6 rounded-md font-semibold hover:bg-gray-100 lg:flex md:flex hidden">Modifier le profil</button>
            <button className="text-[#08a6a0] border-[1px] border-[#08a6a0] p-2 rounded-full font-semibold hover:bg-gray-100 block md:hidden">🖊</button>
          </Link>
        </div>
      </div>

      <div className="pt-7 w-[100%] mx-auto">
        <h1 className="font-bold lg:text-3xl text-xl">Infos personnelles</h1>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white py-6 px-2 cursor-pointer mt-5 rounded-md shadow-md">
            <h1 className="font-bold text-xl">Nom</h1>
            <h1 className="font-semibold text-base">{session?.user?.name}</h1>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit facilis ipsa consequuntur</p>
          </div>

          <div className="bg-white py-6 px-2 cursor-pointer mt-5 rounded-md shadow-md">
            <h1 className="font-bold text-xl">Prénom</h1>
            <h1 className="font-semibold text-base">{session?.user?.firstName}</h1>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit facilis ipsa consequuntur</p>
          </div>

          <div className="bg-white py-6 px-2 cursor-pointer mt-5 rounded-md shadow-md">
            <h1 className="font-bold text-xl">Mail</h1>
            <h1 className="font-semibold text-base">{session?.user?.email}</h1>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit facilis ipsa consequuntur</p>
          </div>

          <div className="bg-white py-6 px-2 cursor-pointer mt-5 rounded-md shadow-md">
            <h1 className="font-bold text-xl">Téléphone</h1>
            <h1 className="font-semibold text-base">{session?.user?.tel}</h1>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit facilis ipsa consequuntur</p>
          </div>

          <div className="bg-white py-6 px-2 cursor-pointer mt-5 rounded-md shadow-md">
            <h1 className="font-bold text-xl">Spécialité</h1>
            <h1 className="font-semibold text-base">{session?.user?.specialite}</h1>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit facilis ipsa consequuntur</p>
          </div>

          <div className="bg-white py-6 px-2 cursor-pointer mt-5 rounded-md shadow-md">
            <h1 className="font-bold text-xl">Travaillé à</h1>
            <h1 className="font-semibold text-base">{session?.user?.clinic}</h1>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit facilis ipsa consequuntur</p>
          </div>

          {session?.user?.genre && (
            <div className="bg-white py-6 px-2 cursor-pointer mt-5 rounded-md shadow-md">
              <h1 className="font-bold text-xl">Genre</h1>
              <h1 className="font-semibold text-base">{session?.user?.genre}</h1>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit facilis ipsa consequuntur</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Profile;
