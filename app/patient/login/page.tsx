"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import { signIn } from "next-auth/react";
import { TailSpin } from "react-loader-spinner";
// pour le chargement
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Footer from "../components/footer/page";


export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [userType, setUserType] = useState<"doctor" | "patient">("patient")
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        NProgress.start()
        setLoading(true)
        setError(null);

        const res = await signIn("credentials", {
            email,
            password,
            type: userType,
            callbackUrl: "/patient/dashboard",
            redirect: false
        })
        setLoading(false)
        if (res?.error) {
            setError(res.error);
        } else {
            router.push("/patient/dashboard");
        }
        NProgress.done();
    }

    return (
        <div>
            <div className="w-full h-16 bg-[#08a6a0] shadow-md flex justify-between items-center fixed z-[100] top-0 lg:px-20 md:px-20 sm:px-12 px-[1rem]">
                <div>
                    <h1 className="font-[cursive] md:text-3xl text-2xl text-white">Rendezia</h1>
                </div>
                <div className="flex lg:gap-6 md:gap-6 sm:gap-4 gap-3 items-center">
                    <Link href="/patient/signup">
                        <button className="border border-white text-white lg:text-base md:text-base sm:text-sm text-xs px-4 py-1 rounded-3xl">Inscription</button>
                    </Link>
                    <Link href="/patient/login">
                        <button className="border border-white bg-white text-[#08a6a0] lg:text-base md:text-base sm:text-sm text-xs px-4 py-1 rounded-3xl">Connexion</button>
                    </Link>
                </div>
            </div>
            <div className="bg-gray-100 flex lg:justify-between md:justify-center sm:justify-center justify-center pt-1 h-full">
                <div>
                    <Card className="lg:w-[450px] md:w-[400px] sm:w-[350px] w-[350px] h-[30rem] mt-14">
                        <CardHeader className="flex items-start">
                            <CardTitle className="font-bold text-2xl text-[#20363d]">Se connecter</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={handleLogin}
                                className="flex flex-col gap-4">

                                <div>
                                    <Label className="text-sm text-[#20363d]">Adresse e-mail*</Label>
                                    <Input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        type="email"
                                        placeholder="exemple@gmail.com"
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm text-[#20363d]">Mots de passe*</Label>
                                    <Input
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        type="password"
                                        placeholder="Saisir le mots de passe"
                                    />
                                </div>

                                <div className="mt-3">
                                    <Button type="submit" className="bg-[#067f7a] hover:bg-[#1d6965] w-full rounded-full">{loading ?
                                        <TailSpin color="#fff" height={20} width={20} strokeWidth={5} />
                                        : "Se connecter"}</Button>
                                </div>
                                {error && (
                                    <div className="text-red-700 text-sm text-start">
                                        {error}
                                    </div>
                                )}

                            </form>

                            <div className="flex justify-center p-2">
                                <p>
                                    Pas encore de compte ? <Link
                                        href="/patient/signup"
                                        className="text-[#067f7a] underline"
                                    >S'inscrire ici</Link>
                                </p>
                            </div>
                            <div className="mt-4">
                                <p className="text-xs text-[#20363d98]">
                                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iusto corrupti unde laboriosam similique quod sed autem, possimus ipsum sunt! Asperiores, libero ipsa aut repudiandae ad possimus
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="mt-[5rem] lg:flex hidden">
                    <Image src="/pharma.svg" width={600} height={600} alt="User" />
                </div>
            </div>
            <Footer />
        </div>
    )
}