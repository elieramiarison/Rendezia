// import { Rdv } from "@/lib/models/RendezVous";
import { Rdv } from "../../../../lib/models/RendezVous"
import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
import { connectDB } from "../../../../lib/mongodb"

// connectDB()
export async function DELETE(req: NextRequest, { params }: { params: { id?: string } }) {
    try {
        await connectDB()
        const { id } = params
        console.log("Id est :::", id)
        const deleted = await Rdv.findOneAndDelete({ id })
        if (!deleted) {
            return NextResponse.json({ message: "Disponibilite introuvable" }, { status: 404 })
        }
        return NextResponse.json({ message: "Disponibilité supprimée avec succès" });
    } catch {
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}