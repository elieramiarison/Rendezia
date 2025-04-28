import { Doctor } from "@/lib/models/Doctor";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const res = await Doctor.find()
        return NextResponse.json(res)
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
        console.error("Échec de récupération des médecins :", errorMessage);
        return NextResponse.json(
            { message: "Échec de la récupération des données des médecins", error: errorMessage },
            { status: 500 }
        );
    }
}