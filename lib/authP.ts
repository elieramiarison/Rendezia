import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { User } from "./models/User";
import { connectDB } from "./mongodb";
import { JWT } from "next-auth/jwt";

export const authOptions_: AuthOptions = {
    debug: true,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { type: "email" },
                password: { type: "password" },
            },
            async authorize(credentials) {
                // console.log("Tentative de connexion avec :", credentials);
                await connectDB();
                const patient = await User.findOne({ email: credentials?.email });
                if (!patient) {
                    // console.log("⚠️ Patient non trouvé !");
                    throw new Error("Patient non trouvé");
                }
                console.log("📌 Patient trouvé :", patient);

                const isValidPassword = credentials?.password
                    ? await bcrypt.compare(credentials.password, patient.password)
                    : false;

                if (!isValidPassword) {
                    // console.log("⚠️ Mot de passe incorrect !");
                    throw new Error("Mot de passe incorrect");
                }

                const userData = {
                    id: patient._id.toString(),
                    name: patient.name,
                    firstName: patient.firstName,
                    annif: patient.annif,
                    email: patient.email,
                    image: patient.pdp,
                };
                // console.log("✅ Données renvoyées par authorize :", userData);
                return userData
            },
        }),
    ],
    pages: {
        signIn: "/patinet/login/patient",
    },
    session: {
        strategy: "jwt",
        // maxAge: 60 * 60 * 24 * 7
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
        async session({ session, token }: { session: any; token: JWT }) {
            if (token.id) {
                session.user = {
                    id: token.id,
                    name: token.name,
                    firstName: token.firstName,
                    annif: token.annif,
                    email: token.email,
                    image: token.image,
                };
            }
            // console.log("✅ Session après transformation :", session);
            return session;
        },
        async jwt({ token, user }: { token: JWT; user?: any }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.firstName = user.firstName;
                token.annif = user.annif;
                token.email = user.email;
                token.image = user.image
            }
            // console.log("✅ Token après JWT callback :", token);
            return token;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions_);
