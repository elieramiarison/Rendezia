// import { Dispo } from "@/lib/models/disponibilite";
import { Dispo } from "../../../../lib/models/disponibilite"
import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
import { connectDB } from "../../mongodb"
// connectDB()
export async function DELETE(req: NextRequest, { params }: { params: { id?: string } }) {
    if (!params?.id) {
        return NextResponse.json({ message: "Id manquant" }, { status: 400 })
    }
    try {
        await connectDB()
        const { id } = params
        const deleted = await Dispo.findByIdAndDelete(id)
        if (!deleted) {
            console.log("Aucune disponibilité trouvée avec cet ID");
            return NextResponse.json({ message: "Disponibilite introuvable" }, { status: 404 })
        }
        return NextResponse.json({ message: "Disponibilité supprimée avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id?: string } }) {
    if (!params?.id) {
        return NextResponse.json({ message: "Id manquant" }, { status: 400 })
    }
    try {
        await connectDB()
        const { id } = params
        const { date, startTime, endTime } = await req.json()
        if (!date || !startTime || !endTime) {
            return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
        }
        const updateDispo = await Dispo.findByIdAndUpdate(id,
            { date, startTime, endTime },
            { new: true }
        )
        if (!updateDispo) {
            return NextResponse.json({ error: "Disponibilité non trouvée." }, { status: 404 });
        }
        return NextResponse.json(updateDispo, { status: 200 });

    } catch (error) {
        console.error("Erreur API:", error);
        return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
    }
}