import mongoose from "mongoose";

let isConnected = false; // Pour éviter de se reconnecter à chaque appel

export async function connectDB() {
    const MONGODB_URL = process.env.MONGODB_URL;

    if (!MONGODB_URL) {
        throw new Error("MONGODB_URL manquant dans .env.local");
    }

    if (isConnected) {
        console.log("Déjà connecté à MongoDB");
        return;
    }

    try {
        await mongoose.connect(MONGODB_URL);
        isConnected = true;
        console.log("Connexion réussie à MongoDB");
    } catch (error) {
        console.error("Connexion échouée à MongoDB", error);
        throw new Error("Erreur de connexion à MongoDB");
    }
}
