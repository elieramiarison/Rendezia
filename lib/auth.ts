import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
// import { Doctor } from "@/lib/models/Doctor";
import { Doctor } from "./models/Doctor"
import { connectDB } from "../app/api/connection/mongodb";
import { JWT } from "next-auth/jwt";
import { User } from "./models/User";

// interface IUser {
//     id: string,
//     name: string,
//     email: string
//     tel: string,
//     genre: string,
//     lieu: string,
//     adresse: string,
//     specialite: string,
//     firstName: string,
//     annif: string,
//     clinic: string,
//     type: string
// }

export const authOptions: AuthOptions = {
    debug: true,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { type: "email" },
                password: { type: "password" },
                type: { type: "text" }
            },
            async authorize(credentials) {
                // console.log("Tentative de connexion avec :", credentials);
                await connectDB();

                let user
                if (credentials?.type === "patient") {
                    user = await User.findOne({ email: credentials.email })
                } else {
                    user = await Doctor.findOne({ email: credentials?.email });
                }

                if (!user) {
                    // console.log("⚠️ Utilisateur non trouvé !");
                    throw new Error("Utilisateur non trouvé");
                }
                // console.log("📌 Utilisateur trouvé :", user);

                const isValidPassword = credentials?.password
                    ? await bcrypt.compare(credentials.password, user.password)
                    : false;

                if (!isValidPassword) {
                    // console.log("⚠️ Mot de passe incorrect !");
                    throw new Error("Mot de passe incorrect");
                }

                const userData = credentials?.type === "patient"
                    ? {
                        id: user._id.toString(),
                        name: user.name,
                        firstName: user.firstName,
                        annif: user.annif,
                        email: user.email,
                        lieu: user.lieu,
                        adresse: user.adresse,
                        image: user.pdp,
                        type: "patient",
                    } : {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        image: user.pdpDoc,
                        tel: user.tel,
                        genre: user.genre,
                        specialite: user.specialite,
                        clinic: user.clinic,
                        type: "doctor",
                    }

                return userData
            },
        }),
    ],
    pages: {
        signIn: "/patinet/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 30 * 24 * 60 * 60
    },
    jwt: {
        maxAge: 30 * 24 * 60 * 60,
    },
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 30 * 24 * 60 * 60
            },
        },
    },
    callbacks: {
        async session({ session, token }: { session: any; token: JWT }) {
            let updatedUser;
            if (token.type === "patient") {
                updatedUser = await User.findById(token.id);
            } else {
                updatedUser = await Doctor.findById(token.id);
            }

            // 🛠 Mettre à jour la session avec les nouvelles données
            if (updatedUser) {
                session.user = {
                    id: updatedUser._id.toString(),
                    name: updatedUser.name,
                    email: updatedUser.email,
                    image: updatedUser.pdp || updatedUser.pdpDoc,
                    tel: updatedUser.tel || null,
                    genre: updatedUser.genre || null,
                    lieu: updatedUser.lieu || null,
                    adresse: updatedUser.adresse || null,
                    specialite: updatedUser.specialite || null,
                    firstName: updatedUser.firstName || null,
                    annif: updatedUser.annif || null,
                    clinic: updatedUser.clinic || null,
                    type: token.type,
                };
            }
            return session;
        },
        async jwt({ token, user }: { token: JWT; user?: any }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.image = user.image;
                token.tel = user.tel || null;
                token.genre = user.genre || null;
                token.lieu = user.lieu || null;
                token.adresse = user.adresse || null;
                token.specialite = user.specialite || null;
                token.firstName = user.firstName || null;
                token.annif = user.annif || null;
                token.clinic = user.clinic || null;
                token.type = user.type;
            }
            return token;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);