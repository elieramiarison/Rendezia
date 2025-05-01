import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
import { connectDB } from "../../../../lib/mongodb"
// import { User } from "@/lib/models/User";
import { User } from "../../../../lib/models/User"
import bcrypt from "bcryptjs";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
import { authOptions } from "../../../../lib/auth"
import fs from "fs";

// connectDB();

export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const formData = await req.formData();

        const name = formData.get("name") as string
        const firstName = formData.get("firstName") as string
        const annif = formData.get("annif") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string
        const lieu = formData.get("lieu") as string
        const adresse = formData.get("adresse") as string
        const tel = formData.get("tel")
        const pdp = formData.get("pdp") as File | null

        if (!name || !firstName || !annif || !email || !password || !lieu || !adresse || !tel) {
            return NextResponse.json({ message: "Tous les champs sont obligatoire" }, { status: 400 })
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json({ error: "Email déjà utilisé" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let profilePicturePath = "";
        if (pdp) {
            const fileBuffer = Buffer.from(await pdp.arrayBuffer());
            const uploadDir = path.join(process.cwd(), "public", "uploads");
            await mkdir(uploadDir, { recursive: true });

            profilePicturePath = `/uploads/${Date.now()}_${pdp.name}`;
            const filePath = path.join(process.cwd(), "public", profilePicturePath);
            await writeFile(filePath, fileBuffer);
        }

        const newUser = new User({ name, firstName, annif, email, pdp: profilePicturePath, password: hashedPassword, lieu, adresse, tel });
        await newUser.save();

        return NextResponse.json({ message: "Connexion reussi" }, { status: 201 });

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
    await connectDB()
    const session = await getServerSession(authOptions)
    const user_ = session?.user as AuthenticatedSession | undefined;

    if (!user_?.id) {
        return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }
    const formData = await req.formData()
    const name = formData.get("name") as string || null
    const firstName = formData.get("firstName") as string || null
    const email = formData.get("email") as string || null
    const annif = formData.get("annif") as string || null
    const lieu = formData.get("lieu") as string || null
    const adresse = formData.get("adresse") as string || null
    const tel = formData.get("tel") as string || null
    const password = formData.get("password") as string || null
    const nouvPassword = formData.get("NouvPassword") as string || null

    const user = await User.findById(user_.id)
    if (!user) {
        return NextResponse.json({ message: "Utilisateur introuvable" }, { status: 404 })
    }

    if (password && nouvPassword) {
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return NextResponse.json({ message: "Ancien mot de passe incorrect" }, { status: 400 })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(nouvPassword, salt)
        user.password = hashedPassword
    }
    user.name = name || user.name
    user.firstName = firstName || user.firstName;
    user.email = email || user.email;
    user.annif = annif || user.annif;
    user.lieu = lieu || user.lieu;
    user.adresse = adresse || user.adresse;
    user.tel = tel || user.tel;

    const imageFile = formData.get("pdp") as File;
    if (imageFile) {

        const uploadDir = path.join(process.cwd(), "public/uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, `${user._id}_${Date.now()}_${imageFile.name}`);
        const fileBuffer = Buffer.from(await imageFile.arrayBuffer());
        fs.writeFileSync(filePath, fileBuffer);

        user.pdp = `/uploads/${path.basename(filePath)}`;
    }

    await user.save()
    return NextResponse.json({ message: "Profil modifier avec succes" }, { status: 200 })
}
