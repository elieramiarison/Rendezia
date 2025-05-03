"use client"
import Link from "next/link"
import Image from "next/image";
import { FaCalendarAlt } from "react-icons/fa";
// import { Button } from "@/components/ui/button";
import { MdSecurity } from "react-icons/md";
import Footer from "./doctor/dashboard/components/footer/page";
import AnimatedSection1 from "./animation/animationdif";


export default function Home() {
  const icone = [
    { icone: FaCalendarAlt, title: "Consultez un professionnel de santé", para: "Filtrer par disponibilité, conventionnement et emplacement" },
    { icone: FaCalendarAlt, title: "Prendre RDV", para: "Directement en ligne ou en appelant le professionnel de santé" },
    { icone: FaCalendarAlt, title: "Votre professionnel de santé", para: "Un SMS de rappel avec toutes les informations pratiques est envoyé la veille de votre rendez-vous" },
    { icone: MdSecurity, title: "Votre sécurité", para: "Vos données sont protégées grâce à notre hébergeur agréé par le Ministère de la Santé" }
  ]

  const table = [
    { title: "La protection des données personnelles", image: "data.svg" },
    { title: "Téléconsultez avec un médecin sans rendez-vous", image: "pharma.svg" },
    { title: "Tous les détails sur vos médicaments", image: "medoc.svg" }
  ]

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white relative">

      {/* Navbar */}
      <div className="w-full h-16 bg-[#08a6a0] shadow-md flex justify-between items-center fixed z-[100] top-0 lg:px-20 md:px-20 sm:px-12 px-[1rem]">
        <div>
          <div>
            <h1 className="font-[cursive] md:text-3xl text-2xl text-white">Rendezia</h1>
          </div>
        </div>
        <div className="flex lg:gap-6 md:gap-6 sm:gap-4 gap-3 items-center">
          <Link href="/patient/signup">
            <button className="border border-white text-white lg:text-base md:text-base sm:text-sm text-xs px-4 py-1 rounded-3xl">Inscription</button>
          </Link>
          <Link href="/patient/login">
            <button className="border border-white bg-white text-[#08a6a0] lg:text-base md:text-base sm:text-sm text-xs px-4 py-1 rounded-3xl">Connexion</button>
          </Link>
        </div>
      </div>

      {/* Conteneur principal avec alignement horizontal */}
      <div className="bg-[#08a6a0] h-[35rem] w-full mt-[64px] gap-10 relative">
        {/* Image gauche */}
        <div className="absolute left-0 top-2 z-[1]">
          <Image src="/header_left.svg" alt="left" width={150} height={150} className="w-24 sm:w-24 md:w-28 lg:w-32 pointer-events-none select-none"
            draggable={false}
          />
        </div>

        <div className="flex justify-start lg:pl-[15%] md:pl-[10%] sm:pl-[5rem] items-center text-start h-full z-[5]">
          <div className="lg:w-[50rem] md:w-[45rem] sm:w-[35rem] w-[30rem] px-8 z-10">
            <h1 className="lg:text-5xl md:text-5xl sm:text-4xl text-3xl font-bold text-white">
              Trouvez un professionnel de santé et prenez rendez-vous en ligne!
            </h1>
            <h4 className="md:text-2xl sm:text-xl text-white p-1">Rapide, gratuit et sécurisé</h4>
            <p className="text-white lg:text-base md:text-base sm:text-base text-xs p-1">
              Accédez en quelques clics à des médecins, spécialistes et centres de soins près de chez vous. Gagnez du temps, évitez les files d&apos;attente, et choisissez le créneau qui vous convient, directement en ligne.
            </p>
            <div className="mt-2">
              <div className="flex gap-4">
                <Link href="/doctor/login">
                  <button className="bg-[#eb3e5efa] hover:bg-[#f03658] text-white px-4 py-[0.35rem] rounded-full lg:flex hidden">
                    Se connecter en tant que docteur 👨‍⚕️
                  </button>
                </Link>
                <Link href="/patient/login">
                  <button className="bg-[#eb3e5efa] hover:bg-[#f03658] text-white px-3 py-[0.35rem] rounded-full lg:flex hidden">
                    Se connecter en tant que patient 🙎‍♂️
                  </button>
                </Link>
              </div>

              <div className="flex gap-4">
                <Link href="/doctor/login">
                  <button className="bg-[#eb3e5efa] hover:bg-[#f03658] font-semibold text-white lg:text-base md:text-base sm:text-sm text-sm px-5 py-1 items-center rounded-lg block lg:hidden">
                    Docteur 👨‍⚕️
                  </button>
                </Link>
                <Link href="/patient/login">
                  <button className="bg-[#eb3e5efa] hover:bg-[#f03658] font-semibold text-white lg:text-base md:text-base sm:text-sm text-sm px-5 py-1 items-center rounded-lg block lg:hidden">
                    Patient 🙎‍♂️
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Image droite */}
        <div className="absolute right-0 bottom-0 z-[1]">
          <Image src="/right.svg" alt="right" width={100} height={100} className="w-20 sm:w-20 md:w-24 lg:w- pointer-events-none select-none"
            draggable={false}
          />
        </div>
      </div>

      <div className="flex lg:flex-col sm:flex-col flex-col gap-10 mt-[4rem] items-center">

        <div className="flex flex-col justify-center items-center mx-auto z-[50px] lg:mt-[-8rem] md:mt-[-8rem] sm:mt-[-8rem] mt-[-8rem] relative">

          <div className="flex md:flex-row sm:flex-col flex-col gap-4 mx-auto">
            {table.map((item, index) => (
              <AnimatedSection1 key={index} delay={index * 0.3}>
                <div key={index} className="p-4 border flex lg:flex-row md:flex-col sm:flex-col flex-col gap-4 lg:text-start md:text-center items-center rounded-lg shadow-lg lg:w-[21rem] lg:h-[10rem] md:w-[209px] sm:w-[209px] w-[209px] bg-white">

                  <div className="lg:w-[13rem] md:w-[8rem] sm:w-[8rem] w-[8rem] lg:py md:py-1">
                    <Image src={item.image} alt="Prof" width={10} height={10} className="sm:w-[8rem] w-[8rem] md:w-[8rem] pointer-events-none select-none" draggable={false} />
                  </div>
                  <h3 className="text-[#20363d] font-semibold lg:text-base md:text-base sm:text-base text-base pt-[-5rem]">{item.title}</h3>
                </div>
              </AnimatedSection1>
            ))}
          </div>

        </div>

        <div className="flex lg:flex-row sm:flex-col flex-col gap-10 mt-[1rem] items-center">
          <AnimatedSection1 delay={0.2}>
            <div className="left-10 top-40">
              <Image src="/medication.svg" alt="Docteur" width={150} height={150} className="sm:w-[20rem] w-[18rem] md:w-[29rem] pointer-events-none select-none" draggable={false} />
            </div>
          </AnimatedSection1>

          <AnimatedSection1 delay={0.5}>
            <div className="lg:w-[50vw] md:w-[40rem] sm:w-[35rem] w-[20rem] text-start md:py-10 sm:py-10 py-10 md:mb-[3rem] lg:pl-[2rem]">
              <h1 className="md:text-4xl sm:text-4xl text-3xl font-bold text-[#20363d]">Bienvenue sur Rendezia, votre plateforme de rendez-vous médicaux en ligne</h1>
              <h4 className="text-xl font-semibold text-[#20363d]">Prenez rendez-vous rapidement, gratuitement et en toute sécurité</h4>
              <p className="text-[#20363d] lg:text-base md:text-base sm:text-base text-sm ">
                Accédez à une large sélection de professionnels de santé et choisissez l&apos;heure qui vous convient, le tout en quelques clics
              </p>
            </div>
          </AnimatedSection1>
        </div>
      </div>

      <div className="mt-10 bg-[#e0f5f4] w-full h-auto flex justify-around items-center gap-10 py-10 flex-wrap">
        {icone.map((item, index) => (
          <AnimatedSection1 key={index} delay={index * 0.3}>
            <div className="w-[15rem] flex flex-col text-center items-center">
              <div className="bg-[#08a6a0] text-white text-4xl p-4 rounded-full flex items-center justify-center w-16 h-16">
                <item.icone />
              </div>
              <h1 className="text-black font-sans text-2xl text-center">{item.title}</h1>
              <p className="text-[#000000ab]">{item.para}</p>
            </div>
          </AnimatedSection1>
        ))}
      </div>

      <div className="flex lg:flex-row sm:flex-col flex-col gap-10 mt-16 mb-8">
        <AnimatedSection1 delay={0.2}>
          <div className=" lg:w-[35rem] md:w-[35rem] sm:w-[33rem] w-[20rem] md:flex-col md:justify-center">
            <h1 className="font-bold md:text-4xl sm:text-4xl text-3xl text-[#20363d] p-2">Prenez rendez-vous avec vos professionnels de santé</h1>
            <p className="text-[#20363d] md:text-base sm:text-sm text-sm p-3">Consultez la disponibilité de médecins et spécialistes près de chez vous, et réservez un créneau en quelques secondes. Simple, rapide et sans frais</p>
            <button className="bg-[#067f7a] hover:bg-[#1d6965] text-white lg:text-base md:text-base sm:text-sm text-xs px-4 py-2 rounded-3xl">
              Se connecter
            </button>
          </div>
        </AnimatedSection1>
        <AnimatedSection1 delay={0.5}>
          <div className="top-40">
            <Image src="prof.svg" alt="Prof" width={150} height={150} className="sm:w-[20rem] w-[18rem] md:w-[29rem] pointer-events-none select-none" draggable={false} />
          </div>
        </AnimatedSection1>
      </div>

      <div className="flex justify-around flex-wrap p-20 lg:pl-[9rem] md:pl-[9rem] sm:pl-[5rem] pl-[0rem] z-[5] gap-8 bg-[#e0f5f4] w-full h-auto mt-20">
        <AnimatedSection1 delay={0.2}>
          <div className="w-60">
            <h1 className=" font-bold text-2xl text-[#20363d]">Spécialités</h1>
            <ul className="mt-5 text-[#20363d]">
              <li>Chirurgien orthopédique et traumatologique</li>
              <li>Laboratoire de biologie médicale Ophtalmologue</li>
              <li>Médecin généraliste</li>
              <li>Dermatologue et vénérologue</li>
            </ul>
          </div>
        </AnimatedSection1>

        <AnimatedSection1 delay={0.4}>
          <div className="w-60">
            <ul className="mt-[3.3rem] text-[#20363d]">
              <li>Gynécologue</li>
              <li>Kinésithérapeute</li>
              <li>ORL</li>
              <li>Psychiatre</li>
              <li>Obstétricien</li>
            </ul>
          </div>
        </AnimatedSection1>

        <AnimatedSection1 delay={0.6}>
          <div className="w-60">
            <h1 className="font-bold text-2xl text-[#20363d]">Infos santé</h1>
            <ul className="mt-5 text-[#20363d]">
              <li>Les dentistes : toutes les informations</li>
              <li>Le Médecin Généraliste</li>
              <li>La gynécologie</li>
              <li>La dermatologie</li>
              <li>L&apos;ophtalmologie</li>
            </ul>
          </div>
        </AnimatedSection1>

        <AnimatedSection1 delay={0.8}>
          <div className="w-60">
            <h1 className="font-bold text-2xl text-[#20363d]">Liens utiles</h1>
            <ul className="mt-5 text-[#20363d]">
              <li>Accueil</li>
              <li>À propos</li>
            </ul>
          </div>
        </AnimatedSection1>
      </div>
      <Footer />


    </main>
  );
}
