"use client"
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Card } from "../../../components/ui/card"
import { CardContent } from "../../../components/ui/card"
import { CardHeader } from "../../../components/ui/card"
import { CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import ClipLoader from 'react-spinners/ClipLoader';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Footer from "../dashboard/components/footer/page";

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        NProgress.start()
        e.preventDefault();
        setLoading(true);
        setError(null)

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl: "/doctor/dashboard",
        });

        if (res?.error) {
            setError(res.error);
        } else {
            router.push("/doctor/dashboard");
        }
        NProgress.done()
        setLoading(false);
    };

    return (
        <div>
            <div className="w-full h-16 bg-[#08a6a0] shadow-md flex justify-between items-center fixed z-[100] top-0 lg:px-20 md:px-20 sm:px-12 px-[1rem]">
                <div>
                    {/* <Image src="/logo2.png" alt="logo" width={80} height={20} className="lg:w-[5rem] md:w-[5rem] sm:w-[4rem] w-[3.5rem]" /> */}
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
                                    <Label className="text-sm text-[#20363d]"> Mots de passe*</Label>
                                    <Input
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        type="password"
                                        placeholder="Saisir le mots de passe"
                                    />
                                </div>

                                <div className="mt-3">
                                    <button
                                        type="submit"
                                        className={`w-full rounded-full p-[0.35rem] text-white flex items-center justify-center ${email && password
                                            ? 'bg-[#067f7a] hover:bg-[#1d6965]'
                                            : 'bg-gray-400 cursor-not-allowed'
                                            }`}
                                        disabled={!email || !password || loading}
                                    >
                                        {loading ? <ClipLoader size={23} color="#fff" /> : "Se connecter"}
                                    </button>
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
                                        href="/doctor/signup"
                                        className="text-[#067f7a] underline"
                                    >S&apos;inscrire ici</Link>
                                </p>
                            </div>
                            <div className="mt-4">
                                <p className="text-sm">
                                    <span className="text-yellow-500">⚠ Une fois connecté, cette page est accessible uniquement depuis un ordinateur ⚠ </span>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="mt-[5rem] lg:flex hidden">
                    <Image src="/pharma.svg" width={600} height={600} alt="User" className="pointer-events-none select-none" draggable={false} />
                </div>
            </div>
            <Footer />
        </div>
    )
}