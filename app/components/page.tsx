'use client'

import { motion, useAnimation } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

interface IData {
    pdp: string,
    name: string,
    firstName: string
}

const MyAnimatedCarouselAccueil = () => {
    const [data, setData] = useState<IData[]>([]);

    const controls = useAnimation();
    const [offset, setOffset] = useState(0);
    const CARD_WIDTH = 220;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/patient');
                if (!res.ok) {
                    throw new Error("Erreur lors du chargement des données");
                }
                const data = await res.json();
                console.log("Users sont :::", data);
                setData(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const startAutoScroll = useCallback(() => {
        controls.start({
            x: ["0%", "-100%"],
            transition: {
                duration: 20,
                ease: "linear",
                repeat: Infinity,
            },
        });
    }, [controls]); // Ajout de controls comme dépendance

    useEffect(() => {
        startAutoScroll();
    }, [startAutoScroll]);

    const stopAndMove = async (direction: "left" | "right") => {
        await controls.stop();

        const newOffset = direction === "left"
            ? offset + CARD_WIDTH
            : offset - CARD_WIDTH;

        setOffset(newOffset);

        await controls.start({
            x: newOffset,
            transition: { duration: 0.5 },
        });

        // Redémarre l’auto scroll après 1 secondes
        setTimeout(() => {
            setOffset(0);
            startAutoScroll();
        }, 1000);
    };

    return (
        <div>
            {/* Flèche gauche */}
            <button
                onClick={() => stopAndMove("left")}
                className="absolute left-[-1.5rem] top-1/2 -translate-y-1/2 z-20 bg-[#067f7a] text-white p-2 rounded-full shadow hover:bg-[#1b6e6a]"
            >
                <ChevronLeft />
            </button>
            <div className="overflow-hidden lg:w-[50rem] md:w-[40rem] sm:w-[30rem] w-[20rem] relative z-0 mx-auto">
                {/* Carrousel */}
                <motion.div
                    className="flex gap-4 z-0"
                    animate={controls}
                >
                    {[...data, ...data].map((rdv, index) => (
                        <div
                            key={index}
                            className="min-w-[200px] p-4 border flex flex-col justify-center items-center text-start rounded-lg shadow-lg bg-gray-100"
                        >
                            {rdv.pdp ? (
                                <Image
                                    src={rdv.pdp}
                                    alt="Photo de profil"
                                    width={100}
                                    height={100}
                                    className="lg:w-16 lg:h-16 md:w-20 md:h-20 sm:w-16 sm:h-16 w-16 h-16 rounded-full border-2 border-gray-600 object-cover pointer-events-none select-none" draggable={false}
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-gray-400 flex items-center justify-center text-white text-2xl font-bold border-2 border-gray-600 cursor-pointer">
                                    {rdv.name?.[0]?.toUpperCase() || ""}
                                    {rdv.firstName?.[0]?.toUpperCase() || ""}
                                </div>
                            )}
                            {/* <div className="text-start"> */}
                            <h3 className="font-bold text-sm">{rdv.name}</h3>
                            <h3 className="font-bold text-sm">{rdv.firstName}</h3>
                            {/* </div> */}
                        </div>
                    ))}
                </motion.div>
            </div>
            {/* Flèche droite */}
            <button
                onClick={() => stopAndMove("right")}
                className="absolute right-[-1.5rem] top-1/2 -translate-y-1/2 z-10 bg-[#067f7a] text-white p-2 rounded-full shadow hover:bg-[#1b6e6a]"
            >
                <ChevronRight />
            </button>
        </div>
    );
};

export default MyAnimatedCarouselAccueil;
