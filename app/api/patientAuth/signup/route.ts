import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
import { connectDB } from "../../connection/mongodb"
// import { User } from "@/lib/models/User";
import { User } from "../../../../lib/models/User"
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
import { authOptions } from "../../../../lib/auth"


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
        // const pdp = formData.get("pdp") as File | null
        const pdp = formData.get("pdp")

        const isValidFile = pdp instanceof File && pdp.size > 0;

        if (!name || !firstName || !annif || !email || !password || !lieu || !adresse || !tel) {
            return NextResponse.json({ message: "Tous les champs sont obligatoire" }, { status: 400 })
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json({ error: "Email déjà utilisé" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let profilePicturePath = "";
        if (isValidFile) {
            const buffer = await pdp.arrayBuffer();
            const base64Image = Buffer.from(buffer).toString("base64");

            const response = await fetch("https://api.imgur.com/3/image", {
                method: "POST",
                headers: {
                    Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID as string}`,
                },
                body: new URLSearchParams({
                    image: base64Image,
                    type: "base64",
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                console.error("Erreur upload Imgur:", data);
                return NextResponse.json({ message: "Échec de l'upload de l'image" }, { status: 500 });
            }

            profilePicturePath = data.data.link;

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
    const removePdp = formData.get("removePdpDoc") === "true";

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

    if (removePdp) {
        // user.pdp = null;
        if (user.pdpDocDeleteHash) {
            await fetch(`https://api.imgur.com/3/image/${user.pdpDocDeleteHash}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
                },
            });
        }
        user.pdpDoc = null;
        user.pdpDocDeleteHash = null;
    } else if (imageFile) {

        // const uploadForm = new FormData();
        // uploadForm.append("file", imageFile);

        // const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/uploadImg/patient`, {
        //     method: "PUT",
        //     body: uploadForm,
        // });

        // if (!uploadResponse.ok) {
        //     return NextResponse.json({ message: "Échec de l'upload de l'image" }, { status: 500 });
        // }

        // const uploadData = await uploadResponse.json();
        // user.pdp = uploadData.url;

        // Supprimer l’ancienne image Imgur
        if (user.pdpDocDeleteHash) {
            await fetch(`https://api.imgur.com/3/image/${user.pdpDocDeleteHash}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
                },
            });
        }

        // Préparer le fichier à uploader
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const base64Image = buffer.toString('base64');

        const uploadResponse = await fetch("https://api.imgur.com/3/image", {
            method: "POST",
            headers: {
                Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                image: base64Image,
                type: "base64",
            }),
        });

        const uploadData = await uploadResponse.json();
        if (!uploadData.success) {
            return NextResponse.json({ message: "Échec de l'upload Imgur" }, { status: 500 });
        }

        user.pdp = uploadData.data.link;
        user.pdpDocDeleteHash = uploadData.data.deletehash;
    }

    await user.save()
    return NextResponse.json({ message: "Profil modifier avec succes" }, { status: 200 })
}
