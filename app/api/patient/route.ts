import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../connection/mongodb";
import { User } from "../../../lib/models/User"

export async function GET(req: NextRequest) {
    try {
        await connectDB()
        const user = await User.find()
        return NextResponse.json(user, { status: 200 });
    } catch (error: unknown) {
        console.error("Erreur serveur:", error);
        return NextResponse.json(
            { message: "Erreur serveur" },
            { status: 500 }
        );
    }
}