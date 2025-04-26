import { NextRequest, NextResponse } from "next/server"
import { Rdv } from "@/lib/models/RendezVous"
import { connectDB } from "@/lib/mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

connectDB()
export async function POST(req: NextRequest) {
    try {
        const session: any = await getServerSession(authOptions)
        if (!session || !session.user) {
            return NextResponse.json({ message: "Non autorise" }, { status: 401 })
        }

        const { id, firstName, email, annif, lieu, adresse, tel, date, startTime, endTime, name, doctorId, pdp } = await req.json()
        const userId = session.user.id

        if (!id || !date || !startTime || !endTime || !name || !doctorId || !pdp) {
            return NextResponse.json({ message: "Il y a une champs manquant" }, { status: 400 })
        }

        const existingRdv = await Rdv.findOne({ dispoId: id, userId })
        if (existingRdv) {
            return NextResponse.json({ message: "Rendez-vous déjà pris" }, { status: 400 });
        }

        const rdvDoc = new Rdv({ id: id, date, startTime, endTime, name, doctorId, userId, pdp, firstName, email, annif, lieu, adresse, tel })
        await rdvDoc.save()

        return NextResponse.json({ message: "Rendez-vous docteur ajoutée avec succès" }, { status: 201 })

    } catch (error) {
        // console.log("Erreur serveur", error)
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session: any = await getServerSession(authOptions)
        if (!session || !session.user) {
            return NextResponse.json({ message: "Non autorise" }, { status: 401 })
        }
        const doctorId = session.user.id
        const teste = await Rdv.find({ doctorId })
        return NextResponse.json(teste, { status: 200 });

    } catch (error) {
        // console.log("Erreur serveur", error);
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}