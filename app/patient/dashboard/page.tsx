"use client";

import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import { useSession } from "next-auth/react";
import MyCarousel from "../components/swiper/page";
// import AnimatedSection1 from "@/app/animation/animationdif";
import AnimatedSection1 from "../../animation/animationdif"

export default function DoctorDashboard() {
  const { data: session, status } = useSession()

  const handleClick = () => {
    alert("Bonjour, cette section est encore en cours de développement...")
  }

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen ">
        <h1>Chargement...</h1>
      </div>
    );
  }

  if (status !== "authenticated") {
    return null;
  }

  return (
    <div className="flex h-full">

      {/* Contenu principal */}
      <main className="flex-1">
        <div className="bg-[#08a6a0] h-[33rem] mt-[70px] gap-10 relative">
          {/* Image gauche */}
          <div className="absolute left-0 top-2 z-[1]">
            <Image src="../../header_left.svg" alt="left" width={150} height={150} className="w-24 sm:w-24 md:w-28 lg:w-32" />
          </div>

          <div className="flex justify-center items-center text-center h-full z-[5]">
            <div className="lg:w-[45rem] md:w-[45rem] sm:w-[35rem] w-[23rem] z-10">
              <AnimatedSection1 delay={0.3}>
                <h1 className="lg:text-5xl md:text-5xl sm:text-4xl text-3xl font-bold text-white">
                  Bienvenue {session.user?.name}, heureux de vous accueillir
                </h1>
              </AnimatedSection1>
              <AnimatedSection1 delay={0.6}>
                <h4 className="md:text-2xl sm:text-xl text-white p-1">Rapide, gratuit et sécurisé</h4>
              </AnimatedSection1>
              <AnimatedSection1 delay={0.9}>
                <p className="text-white lg:text-base md:text-base sm:text-base text-xs p-1">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto corrupti unde laboriosam similique quod sed autem, possimus ipsum sunt! Asperiores, libero ipsa aut repudiandae ad possimus voluptas adipisci quos natus!
                </p>
              </AnimatedSection1>
              <AnimatedSection1 delay={1}>
                <Link href="/patient/dashboard/profil">
                  <button className="bg-[#fff] hover:bg-gray-300 text-[#20363d] px-7 py-[0.35rem] rounded-full">
                    Votre profil
                  </button>
                </Link>
              </AnimatedSection1>
            </div>
          </div>

          {/* Image droite */}
          <div className="absolute right-0 bottom-5 z-[1]">
            <Image src="../../right.svg" alt="right" width={100} height={100} className="w-20 sm:w-20 md:w-24 lg:w-28" />
          </div>
        </div>

        {/* Section Rendez-vous */}
        <section className=" bg-white lg:h-[33rem] md:h-auto flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-center mx-auto z-[50px] lg:mt-[-8rem] md:mt-[-5rem] sm:mt-[-4rem] mt-[-4rem] relative">
            {/* <h2 className="text-xl font-semibold top-0">Liste des rendez-vous 📅</h2> */}
            <AnimatedSection1 delay={1.3}>
              <div className="mx-auto">
                <MyCarousel />
              </div>
            </AnimatedSection1>
          </div>

          <div className="lg:flex justify-center items-center lg:text-start md:text-center sm:text-center gap-6 mt-10 py-10">
            <AnimatedSection1 delay={0.3}>
              <div className="md:flex md:justify-center flex justify-center">
                <Image src="../../femme.svg" alt="dame" width={350} height={350} className="md:ml-[152px] sm:ml-[100px] w-64 lg:w-80" />
              </div>
            </AnimatedSection1>
            <AnimatedSection1 delay={0.6}>
              <div className="ml-[5px] lg:w-[40rem] md:w-[35rem] sm:w-[33rem] w-[23rem] text-start md:p-8">
                <h1 className="font-bold lg:text-4xl md:text-4xl sm:text-3xl text-2xl text-[#20363d] p-2">Votre consultation
                  à tout moment de la journée</h1>
                <p className="text-[#20363d] p-3 lg:text-base md:text-base sm:text-xs text-xs">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iusto corrupti unde laboriosam similique quod sed autem, possimus ipsum sunt! Asperiores, libero ipsa aut repudiandae ad possimus voluptas adipisci quos natus!</p>
                <button className="bg-[#067f7a] hover:bg-[#1d6965] text-white px-4 py-2 rounded-3xl md:text-base sm:text-xs text-xs" onClick={handleClick}>
                  Teleconsulter avec Rendezia
                </button>
              </div>
            </AnimatedSection1>
          </div>
        </section>

        <div className="bg-[#e0f5f4] w-full lg:flex">
          <div className="flex lg:flex-row md:flex-col-reverse sm:flex-col-reverse flex-col-reverse justify-center items-center lg:gap-0 md:gap-6 sm:gap-6 gap-6 py-10 mx-auto">
            <AnimatedSection1 delay={0.3}>
              <div className="ml-[5px] lg:w-[40rem] md:w-[35rem] sm:w-[33rem] w-[23rem] text-start md:p-8">
                <h1 className="font-bold lg:text-4xl md:text-4xl sm:text-3xl text-2xl text-[#20363d] p-2">Vos documents de santé, toujours avec vous !</h1>
                <p className="text-[#20363d] p-3 lg:text-base md:text-base sm:text-xs text-xs">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iusto corrupti unde laboriosam similique quod sed autem, possimus ipsum sunt! Asperiores, libero ipsa aut repudiandae ad possimus voluptas adipisci quos natus!</p>
                <button className="bg-[#067f7a] hover:bg-[#1d6965] text-white px-4 py-2 rounded-3xl md:text-base sm:text-xs text-xs" onClick={handleClick}>
                  Acceder a mes medicaments
                </button>
              </div>
            </AnimatedSection1>
            <AnimatedSection1 delay={0.6}>
              <div className="top-40">
                <Image src="/dame.svg" alt="Prof" width={350} height={350} className=" sm:ml-[100px] w-44 lg:w-80" />
              </div>
            </AnimatedSection1>
          </div>
        </div>
      </main>
    </div>
  );
}
