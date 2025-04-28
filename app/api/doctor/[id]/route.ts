import { Doctor } from "@/lib/models/Doctor";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params
        const doctor = await Doctor.findById(id)
        if (!doctor) {
            return NextResponse.json({ message: "Médecin non trouvé" }, { status: 404 });
        }
        return NextResponse.json(doctor)

    } catch {
        return NextResponse.json({ message: "Erreur lors de la récupération du médecin" }, { status: 500 });
    }
}