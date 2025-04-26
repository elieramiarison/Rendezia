import { Doctor } from "@/lib/models/Doctor";
import { NextResponse } from "next/server";

export async function GET({ params }: { params: { id: string } }) {
    try {
        const { id } = params
        const doctor = await Doctor.findById(id)
        if (!doctor) {
            return NextResponse.json({ message: "Médecin non trouvé" }, { status: 404 });
        }
        return NextResponse.json(doctor)

    } catch (error) {
        return NextResponse.json({ message: "Erreur lors de la récupération du médecin" }, { status: 500 });
    }
}