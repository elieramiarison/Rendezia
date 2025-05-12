import { Doctor } from "../../../../lib/models/Doctor"
import bcrypt from "bcryptjs";
// import { writeFile, mkdir } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
// import path from "path";
// import { connectDB } from '@/lib/mongodb';
import { connectDB } from "../../connection/mongodb"
import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
import { authOptions } from "../../../../lib/auth"

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const firstName = formData.get("firstName") as string;
    const tel = formData.get("tel") as string;
    const genre = formData.get("genre") as string;
    const password = formData.get("password") as string;
    const clinic = formData.get("clinic") as string;
    const specialite = formData.get("specialite") as string;
    const numOnm = formData.get("numOnm") as string;
    const pdpDoc = formData.get("pdpDoc");

    const isValidFile = pdpDoc instanceof File && pdpDoc.size > 0;

    const existDoc = await Doctor.findOne({ email });
    if (existDoc) {
      return NextResponse.json({ message: "Email déjà utilisé" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let pdpPath = "";

    if (isValidFile) {
      const buffer = await pdpDoc.arrayBuffer();
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

      pdpPath = data.data.link;
    }

    const newDoc = new Doctor({
      name,
      email,
      tel,
      genre,
      password: hashedPassword,
      specialite,
      numOnm,
      pdpDoc: pdpPath,
      firstName,
      clinic,
    });

    await newDoc.save();

    return NextResponse.json({ message: "Vous êtes inscrit avec succès" }, { status: 201 });
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
    const numOnm = formData.get("numOnm") as string | null;
    const clinic = formData.get("clinic") as string | null;
    const pdpDoc = formData.get("pdpDoc") as File | null;
    const removePdpDoc = formData.get("removePdpDoc") === "true";
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
    if (numOnm) doctor.numOnm = numOnm;
    if (clinic) doctor.clinic = clinic;

    if (password && newPassword) {
      const isMatch = await bcrypt.compare(password, doctor.password)
      if (!isMatch) {
        return NextResponse.json({ message: "Ancien mot de passe incorrect" }, { status: 400 })
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)
      doctor.password = hashedPassword
    }

    if (removePdpDoc) {
      if (doctor.pdpDocDeleteHash) {
        await fetch(`https://api.imgur.com/3/image/${doctor.pdpDocDeleteHash}`, {
          method: "DELETE",
          headers: {
            Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
          },
        });
      }
      doctor.pdpDoc = null;
      doctor.pdpDocDeleteHash = null;
    } else if (pdpDoc) {
      if (doctor.pdpDocDeleteHash) {
        await fetch(`https://api.imgur.com/3/image/${doctor.pdpDocDeleteHash}`, {
          method: "DELETE",
          headers: {
            Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
          },
        });
      }

      const buffer = Buffer.from(await pdpDoc.arrayBuffer());
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
      console.log("IMGUR upload response:", uploadData);
      if (!uploadData.success) {
        return NextResponse.json({ message: "Échec de l'upload Imgur" }, { status: 500 });
      }

      doctor.pdpDoc = uploadData.data.link;
      doctor.pdpDocDeleteHash = uploadData.data.deletehash;
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