// import { writeFile, mkdir, unlink } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
// import path from "path";
import cloudinary from "../../../../lib/cloudinary";

// export async function POST(req: NextRequest) {
//     try {
//         const formData = await req.formData();
//         const file = formData.get("file") as File | null;

//         if (!file) {
//             return NextResponse.json({ message: "Fichier manquant" }, { status: 400 });
//         }

//         const fileBuffer = Buffer.from(await file.arrayBuffer());
//         const uploadDir = path.join(process.cwd(), "public", "imageDoc");
//         await mkdir(uploadDir, { recursive: true });

//         const fileName = `${Date.now()}_${file.name}`;
//         const filePath = path.join(uploadDir, fileName);

//         await writeFile(filePath, fileBuffer);
//         const publicPath = `/imageDoc/${fileName}`;

//         return NextResponse.json({ path: publicPath }, { status: 200 });
//     } catch (error) {
//         console.error("Erreur upload image:", error);
//         return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
//     }
// }

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ message: "Fichier manquant" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const base64String = buffer.toString("base64");
        const dataUrl = `data:${file.type};base64,${base64String}`;

        const result = await cloudinary.uploader.upload(dataUrl, {
            folder: "doctors", // tu peux changer ou retirer
        });

        return NextResponse.json({ url: result.secure_url, public_id: result.public_id }, { status: 200 });
    } catch (error) {
        console.error("Erreur upload Cloudinary:", error);
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}

// export async function PUT(req: NextRequest) {
//     try {
//         const formData = await req.formData();
//         const file = formData.get("file") as File | null;
//         const oldPath = formData.get("oldPath") as string | null;

//         if (!file) {
//             return NextResponse.json({ message: "Fichier manquant" }, { status: 400 });
//         }

//         const fileBuffer = Buffer.from(await file.arrayBuffer());
//         const uploadDir = path.join(process.cwd(), "public", "imageDoc");
//         await mkdir(uploadDir, { recursive: true });

//         const fileName = `${Date.now()}_${file.name}`;
//         const newFilePath = path.join(uploadDir, fileName);
//         const publicPath = `/imageDoc/${fileName}`;

//         // Enregistrer la nouvelle image
//         await writeFile(newFilePath, fileBuffer);

//         // Supprimer l'ancienne image si elle existe
//         if (oldPath) {
//             const oldFilePath = path.join(process.cwd(), "public", oldPath);
//             try {
//                 await unlink(oldFilePath);
//             } catch (err) {
//                 console.warn("Ancienne image introuvable ou déjà supprimée :", oldFilePath);
//             }
//         }

//         return NextResponse.json({ path: publicPath }, { status: 200 });

//     } catch (error) {
//         console.error("Erreur lors du remplacement de l'image:", error);
//         return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
//     }
// }

export async function PUT(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const oldPublicId = formData.get("oldPublicId") as string | null;

        if (!file) {
            return NextResponse.json({ message: "Fichier manquant" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const base64String = buffer.toString("base64");
        const dataUrl = `data:${file.type};base64,${base64String}`;

        // Upload de la nouvelle image
        const result = await cloudinary.uploader.upload(dataUrl, {
            folder: "doctors",
        });

        // Suppression de l'ancienne image si public_id fourni
        if (oldPublicId) {
            try {
                await cloudinary.uploader.destroy(oldPublicId);
            } catch (err) {
                console.warn("Ancienne image non supprimée :", oldPublicId);
            }
        }

        return NextResponse.json({ url: result.secure_url, public_id: result.public_id }, { status: 200 });
    } catch (error) {
        console.error("Erreur lors du remplacement de l'image:", error);
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}

