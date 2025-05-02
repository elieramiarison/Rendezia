// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/auth";
// import { authOptions } from "../../../lib/auth"
import { connectDB } from "../connection/mongodb";

export async function GET() {
    // const session = await getServerSession(authOptions);
    // await connectDB()

    try {
        await connectDB();
        console.log('MongoDB connected ✅')
        return new Response('MongoDB connected ✅');
    } catch (error) {
        console.log('MongoDB connection error ❌')
        return new Response('MongoDB connection error ❌', { status: 500 });
    }

    // if (!session) {
    //     return NextResponse.json({ error: "Utilisateur non connecté", session: null }, { status: 401 });
    // }

    // return NextResponse.json({ message: "Utilisateur connecté", session });
}