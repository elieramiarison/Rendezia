import { Doctor } from "@/lib/models/Doctor";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const res = await Doctor.find()
        return NextResponse.json(res)
    } catch (error) {
        return NextResponse.json({ message: "Votre donnees n'est pas recupere via le backend" }, { status: 400 })
    }
}