// import { Doctor } from "@/lib/models/Doctor";
import { Doctor } from "../../../../lib/models/Doctor"
import bcrypt from "bcryptjs";
// import { writeFile, mkdir } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
// import path from "path";
// import { connectDB } from '@/lib/mongodb';
import { connectDB } from "../../../../lib/mongodb"
import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
import { authOptions } from "../../../../lib/auth"

// connectDB()
export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const formData = await req.formData()

        const name = formData.get("name") as string
        const email = formData.get("email") as string
        const firstName = formData.get("firstName") as string
        const tel = formData.get("tel") as string
        const genre = formData.get("genre") as string
        const password = formData.get("password") as string
        const clinic = formData.get("clinic") as string
        const specialite = formData.get("specialite") as string
        const pdpDoc = formData.get("pdpDoc") as File | null

        const existDoc = await Doctor.findOne({ email })
        if (existDoc) {
            return NextResponse.json({ message: "Email deja utilise" }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        let pdpPath = "";

        if (pdpDoc) {
            const uploadForm = new FormData();
            uploadForm.append("file", pdpDoc);

            const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/uploadImg/doctor`, {
                method: "POST",
                body: uploadForm,
            });

            if (!uploadResponse.ok) {
                return NextResponse.json({ message: "Échec de l'upload de l'image" }, { status: 500 });
            }

            const uploadData = await uploadResponse.json();
            pdpPath = uploadData.path;

            // const fileBuffer = Buffer.from(await pdpDoc.arrayBuffer())
            // const uploadDir = path.join(process.cwd(), "public", "imageDoc");
            // await mkdir(uploadDir, { recursive: true });

            // pdpPath = `/imageDoc/${Date.now()}_${pdpDoc.name}`;
            // const filePath = path.join(process.cwd(), "public", pdpPath);
            // await writeFile(filePath, fileBuffer);
        }

        const newDoc = new Doctor({ name, email, tel, genre, password: hashedPassword, specialite, pdpDoc: pdpPath, firstName, clinic })
        await newDoc.save()

        return NextResponse.json({ message: "Vouz avez connecté" }, { status: 201 })

    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}

interface AuthenticatedSession {
    id: string;
    email?: string;
    // Ajouter d'autres champs si nécessaire
}

export async function PUT(req: NextRequest) {
    try {
        await connectDB()
        const session = await getServerSession(authOptions)
        const user = session?.user as AuthenticatedSession | undefined;

        if (!user?.id) {
            return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
        }

        const formData = await req.formData();
        const name = formData.get("name") as string | null;
        const firstName = formData.get("firstName") as string | null;
        const email = formData.get("email") as string | null;
        const tel = formData.get("tel") as string | null;
        const genre = formData.get("genre") as string | null;
        const password = formData.get("password") as string | null;
        const specialite = formData.get("specialite") as string | null;
        const clinic = formData.get("clinic") as string | null;
        const pdpDoc = formData.get("pdpDoc") as File | null;
        const newPassword = formData.get("newPassword") as string || null

        const doctor = await Doctor.findById(user.id)
        if (!doctor) {
            return NextResponse.json({ message: "Docteur introuvable" }, { status: 404 });
        }
        if (name) doctor.name = name;
        if (firstName) doctor.firstName = firstName;
        if (email) doctor.email = email;
        if (tel) doctor.tel = tel;
        if (genre) doctor.genre = genre;
        if (specialite) doctor.specialite = specialite;
        if (clinic) doctor.clinic = clinic;

        if (password && newPassword) {
            const isMatch = await bcrypt.compare(password, doctor.password)
            if (!isMatch) {
                return NextResponse.json({ message: "Ancien mot de passe incorrect" }, { status: 400 })
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10)
            doctor.password = hashedPassword
        }

        if (pdpDoc) {

            const uploadForm = new FormData();
            uploadForm.append("file", pdpDoc);

            const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/uploadImg/doctor`, {
                method: "PUT",
                body: uploadForm,
            });

            if (!uploadResponse.ok) {
                return NextResponse.json({ message: "Échec de l'upload de l'image" }, { status: 500 });
            }

            const uploadData = await uploadResponse.json();
            doctor.pdpDoc = uploadData.path;

            // const fileBuffer = Buffer.from(await pdpDoc.arrayBuffer());
            // const uploadDir = path.join(process.cwd(), "public", "imageDoc");
            // await mkdir(uploadDir, { recursive: true });

            // const pdpPath = `/imageDoc/${Date.now()}_${pdpDoc.name}`;
            // const filePath = path.join(process.cwd(), "public", pdpPath);
            // await writeFile(filePath, fileBuffer);

            // doctor.pdpDoc = pdpPath;
        }
        await doctor.save();

        return NextResponse.json({
            message: "Profil mis à jour avec succès",
            name: doctor.name,
            tel: doctor.tel,
            genre: doctor.genre,
            specialite: doctor.specialite,
            pdpDoc: doctor.pdpDoc
        }, { status: 200 });

    } catch (error: unknown) {
        // return NextResponse.json({ message: "Erreur serveur", error: error.message }, { status: 500 });
        const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
        return NextResponse.json({ message: "Erreur serveur", error: errorMessage }, { status: 500 });
    }
}