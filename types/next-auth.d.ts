// import "next-auth";
// import "next-auth/jwt";

// declare module "next-auth/jwt" {
//     interface JWT {
//         id: string;
//         name?: string | null;
//         email?: string | null;
//         image?: string | null;
//         tel?: string | null;
//         genre?: string | null;
//         lieu?: string | null;
//         adresse?: string | null;
//         specialite?: string | null;
//         firstName?: string | null;
//         annif?: string | null;
//         clinic?: string | null;
//         type: string;
//     }
// }

// declare module "next-auth" {
//     interface Session {
//         user: {
//             id: string;
//             name?: string | null;
//             email?: string | null;
//             image?: string | null;
//             tel?: string | null;
//             genre?: string | null;
//             lieu?: string | null;
//             adresse?: string | null;
//             specialite?: string | null;
//             firstName?: string | null;
//             annif?: Date | null;
//             clinic?: string | null;
//             type: string;
//         };
//     }
// }

// // declare module "next-auth/jwt" {
// //     interface JWT {
// //         id: string;
// //         name?: string | null;
// //         email?: string | null;
// //         image?: string | null;
// //         tel?: string | null;
// //         genre?: string | null;
// //         lieu?: string | null;
// //         adresse?: string | null;
// //         specialite?: string | null;
// //         firstName?: string | null;
// //         annif?: string | null; // Changé de Date à string
// //         clinic?: string | null;
// //         type: "patient" | "doctor"; // Spécifié comme union littérale
// //     }
// // }

// // declare module "next-auth" {
// //     interface Session {
// //         user: {
// //             id: string;
// //             name?: string | null;
// //             email?: string | null;
// //             image?: string | null;
// //             tel?: string | null;
// //             genre?: string | null;
// //             lieu?: string | null;
// //             adresse?: string | null;
// //             specialite?: string | null;
// //             firstName?: string | null;
// //             annif?: string | null;
// //             clinic?: string | null;
// //             type: "patient" | "doctor";
// //         } & DefaultSession["user"]; // Conserve les propriétés par défaut
// //     }
// // }

import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { Doctor } from "@/lib/models/Doctor";
import { connectDB } from "./mongodb";
import { JWT } from "next-auth/jwt";
import { User } from "./models/User";

// Définir les interfaces pour User et Doctor (basées sur ce que tu utilises)
interface IUser {
    id: string;
    name: string;
    email: string;
    tel: string;
    genre: string;
    lieu: string;
    adresse: string;
    specialite: string;
    firstName: string;
    annif: string;
    clinic: string;
    type: string;
}

interface IDoctor extends IUser {
    // Un médecin peut avoir des champs supplémentaires
    tel: string;
    genre: string;
    specialite: string;
    clinic: string;
}

// Définir un type spécifique pour la session et le JWT
interface SessionUser extends IUser {
    image?: string;
}

interface JWTToken extends JWT {
    id: string;
    name: string;
    email: string;
    image?: string;
    tel?: string | null;
    genre?: string | null;
    lieu?: string | null;
    adresse?: string | null;
    specialite?: string | null;
    firstName?: string | null;
    annif?: string | null;
    clinic?: string | null;
    type: string;
}

export const authOptions: AuthOptions = {
    debug: true,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { type: "email" },
                password: { type: "password" },
                type: { type: "text" },
            },
            async authorize(credentials) {
                await connectDB();

                let user: IUser | IDoctor | null = null;
                if (credentials?.type === "patient") {
                    user = await User.findOne({ email: credentials.email });
                } else {
                    user = await Doctor.findOne({ email: credentials?.email });
                }

                if (!user) {
                    throw new Error("Utilisateur non trouvé");
                }

                const isValidPassword = credentials?.password
                    ? await bcrypt.compare(credentials.password, user.password)
                    : false;

                if (!isValidPassword) {
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
                    }
                    : {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        image: user.pdpDoc,
                        tel: user.tel,
                        genre: user.genre,
                        specialite: user.specialite,
                        clinic: user.clinic,
                        type: "doctor",
                    };

                return userData;
            },
        }),
    ],
    pages: {
        signIn: "/patient/login", // Correction du typo sur "patinet"
    },
    session: {
        strategy: "jwt",
    },
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
            },
        },
    },
    callbacks: {
        async session({ session, token }: { session: { user: SessionUser }; token: JWTToken }) {
            let updatedUser: IUser | IDoctor | null;
            if (token.type === "patient") {
                updatedUser = await User.findById(token.id);
            } else {
                updatedUser = await Doctor.findById(token.id);
            }

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
        async jwt({ token, user }: { token: JWTToken; user?: SessionUser }) {
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
