import { NextResponse } from "next/server";
import { Rdv } from "@/lib/models/RendezVous";
import { connectDB } from "@/lib/mongodb";

connectDB();

export async function GET(context: { params: { userId: string } }) {
    try {
        const userId = context?.params?.userId;

        if (!userId) {
            return NextResponse.json({ message: "User ID manquant" }, { status: 400 });
        }

        const userAppointments = await Rdv.find({ userId });
        return NextResponse.json(userAppointments, { status: 200 });
    } catch (error) {
        // console.error("Erreur serveur", error);
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}
