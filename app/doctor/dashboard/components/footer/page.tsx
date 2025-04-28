import { FaFacebook, FaInstagram, FaLinkedinIn } from "react-icons/fa";
// import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Footer() {
    return (
        <div className="bg-[#08a6a0] h-auto sm:h-auto w-full">
            <div className="flex justify-between items-center lg:px-9 md:px-9 sm:px-7 px-4 pt-10">
                <div className="flex justify-between items-center gap-2">
                    <FaFacebook size={35} color="white" />
                    <FaInstagram size={35} color="white" />
                    <FaLinkedinIn size={35} color="white" />
                </div>
                <div className=" flex flex-col md:flex-row sm:flex-row gap-4">

                    <button className="p-6 rounded-2xl bg-[#20363d] text-[#fff]">
                        <Image src="/apple.svg" alt="apple" width={30} height={30} className="w-6 lg:w-8 md:w-8 sm:w-8" />
                        <div className="lg:text-xs md:text-xs sm:text-xs text-[0.6rem]">Telecharger sur <br /> <span className="font-bold text-l">App Store</span></div>
                    </button>

                    <button className="p-6 rounded-2xl bg-[#20363d] text-[#fff]">
                        <Image src="/playstore.svg" alt="apple" width={30} height={30} className="w-6 lg:w-8 md:w-8 sm:w-8" />
                        <div className="lg:text-xs md:text-xs sm:text-xs text-[0.6rem]">Telecharger sur <br /> <span className="font-bold text-l">Play Store</span></div>
                    </button>

                </div>
            </div>
            <div className="flex flex-col mx-auto sm:flex-row md:flex-row lg:flex-row justify-center items-center mt-4 p-4 border-t-2 border-white gap-4">
                <h1 className="font-bold text-white text-sm sm:text-xs lg:text-base">Votre santé, un clic suffit</h1>
                <h1 className="font-bold text-white text-sm sm:text-xs lg:text-base">Prenez rendez-vous en toute simplicité</h1>
                <h1 className="font-bold text-white text-sm sm:text-xs lg:text-base">Rendezia : la santé à portée de main</h1>
                <h1 className="font-bold text-white text-sm sm:text-xs lg:text-base">Simplifiez vos rendez-vous médicaux</h1>
            </div>

        </div>
    )
}