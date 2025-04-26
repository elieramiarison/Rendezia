import { NextRequest, NextResponse } from "next/server"
import { Dispo } from "@/lib/models/disponibilite";

export async function GET(req: NextRequest) {
    try {
        const teste = await Dispo.find()
        return NextResponse.json(teste, { status: 200 });

    } catch (error) {
        // console.log("Erreur serveur", error);
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}