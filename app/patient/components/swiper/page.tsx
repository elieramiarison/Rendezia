'use client'

import { motion, useAnimation } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
// import { useDisponibilite } from "@/app/hooks/useDisponibilite";
import { useDisponibilite } from "../../../hooks/useDisponibilite"
import { useEffect, useState, useCallback } from "react";

const MyAnimatedCarousel = () => {
    const { dispo } = useDisponibilite();
    const controls = useAnimation();
    const [offset, setOffset] = useState(0);
    const CARD_WIDTH = 220;

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
                    {[...dispo, ...dispo].map((rdv, index) => (
                        <div
                            key={index}
                            className="min-w-[200px] p-4 border text-center rounded-lg shadow-lg bg-gray-100"
                        >
                            <h3 className="font-bold text-sm">Dr {rdv.nameDoc}</h3>
                            <p className="text-sm">Date : {rdv.date}</p>
                            <p className="text-sm">Du : {rdv.startTime}</p>
                            <p className="text-sm">Jusqu&apos;à : {rdv.endTime}</p>
                            <button
                                onClick={() => alert("Bonjour,\n \nCette section est encore en cours de développement...")}
                                className="text-[#067f7a] bg-white border border-[#067f7a] hover:text-white hover:bg-[#067f7a] rounded-3xl mt-1 text-xs px-3 py-1"
                            >
                                Voir Détails
                            </button>
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

export default MyAnimatedCarousel;
