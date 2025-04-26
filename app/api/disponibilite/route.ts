import { Dispo } from "@/lib/models/disponibilite";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

connectDB()
export async function POST(req: NextRequest) {
    try {

        const { id, name, specialite, date, startTime, endTime, clinic, tel, firstName, email } = await req.json()

        if (!date || !startTime || !endTime) {
            return NextResponse.json({ message: "Tous les champs sont requis" }, { status: 400 });
        }

        const newDisponibilite = new Dispo({ doctorId: id, nameDoc: name, specialiteDoc: specialite, date, startTime, endTime, clinic, tel, firstName, email })
        const savedDisponibilite = await newDisponibilite.save()

        return NextResponse.json(savedDisponibilite, { status: 201 })
    } catch (error) {
        // console.log("Erreur serveur", error)
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const session: any = await getServerSession(authOptions)
        if (!session || !session.user) {
            return NextResponse.json({ message: "Non autorise" }, { status: 401 })
        }
        const doctorId = session.user.id
        const teste = await Dispo.find({ doctorId })
        return NextResponse.json(teste, { status: 200 });

    } catch (error) {
        // console.log("Erreur serveur", error);
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}