import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/auth";
import { authOptions } from "../../../lib/auth"

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Utilisateur non connecté", session: null }, { status: 401 });
    }

    return NextResponse.json({ message: "Utilisateur connecté", session });
}