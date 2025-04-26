import { Doctor } from "@/lib/models/Doctor";
import { connectDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connectDB()
const SECRET_KEY = "process.env.JWT_SECRET"

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json()

        const doc = await Doctor.findOne({ email })
        if (!doc) {
            return NextResponse.json({ error: "Adresse email introuvable" }, { status: 400 })
        }
        const isMatch = await bcrypt.compare(password, doc.password)
        if (!isMatch) {
            return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 400 });
        }
        const token = jwt.sign({
            userId: doc._id,
            name: doc.name,
            email: doc.email,
            tel: doc.tel,
            genre: doc.genre,
            specialite: doc.specialite
        },
            SECRET_KEY,
            { expiresIn: "1h" });

        return NextResponse.json({
            message: "Connexion reussi",
            _id: doc._id,
            token,
            name: doc.name,
            pdpDoc: doc.pdpDoc,
            email: doc.email,
            tel: doc.tel,
            genre: doc.genre,
            specialite: doc.specialite
        })

    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
} 