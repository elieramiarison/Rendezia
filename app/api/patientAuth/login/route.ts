import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

connectDB()

const SECRET_KEY = "process.env.JWT_SECRET"

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json()
        const user = await User.findOne({ email })
        if (!user) {
            return NextResponse.json({ error: "Adresse email introuvable" }, { status: 400 })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 400 });
        }

        const token = jwt.sign({ userId: user._id, role: "patient", name: user.name }, SECRET_KEY, { expiresIn: "1h" });

        return NextResponse.json({
            message: "Connexion reussi",
            role: "patient",
            token,
            name: user.name,
            pdp: user.pdp
        })

    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}