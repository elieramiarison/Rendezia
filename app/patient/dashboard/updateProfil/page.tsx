"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

interface IUser {
    name: string,
    firstName: string,
    email: string,
    annif: string,
    lieu: string,
    adresse: string,
    tel: string,
    password: string,
}

export default function UpdateProfil() {
    const { data: session, status, update }: Record<string, any> = useSession()
    const [formData, setFormData] = useState<IUser>({
        name: "",
        firstName: "",
        email: "",
        annif: "",
        lieu: "",
        adresse: "",
        password: "",
        tel: "",
    })
    const [pdp, setPdp] = useState<File | null>(null)
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false)
    const [nouvPassword, setNouvPassword] = useState<string>("")
    const router = useRouter()

    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            setFormData({
                name: session.user.name || '',
                firstName: session.user.firstName ?? "",
                email: session.user.email || "",
                annif: session.user.annif ?? "",
                lieu: session.user.lieu || "",
                adresse: session.user.adresse || "",
                tel: session.user.tel || "",
                password: "",
            });
            setPreviewImage(session.user.image || "");
        }
    }, [session, status])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPdp(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        NProgress.start()

        setLoading(true)
        const updatedFormData = new FormData()
        updatedFormData.append("name", formData.name)
        updatedFormData.append("firstName", formData.firstName)
        updatedFormData.append("email", formData.email)
        updatedFormData.append("annif", formData.annif)
        updatedFormData.append("lieu", formData.lieu)
        updatedFormData.append("adresse", formData.adresse)
        updatedFormData.append("tel", formData.tel)
        updatedFormData.append("password", formData.password)
        updatedFormData.append("nouvPassword", nouvPassword)
        if (pdp) {
            updatedFormData.append("pdp", pdp)
        }
        try {
            const res = await fetch('/api/patientAuth/signup', {
                method: "PUT",
                body: updatedFormData
            })
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Une erreur s'est produite.");
            const updatedSession = await update({
                name: formData.name,
                firstName: formData.firstName,
                email: formData.email,
                annif: formData.annif,
                image: data.imageUrl,
            });
            console.log("Session après update() :", updatedSession);
            await signIn("credentials", { redirect: false });
            router.refresh();
            router.push('/patient/dashboard/profil');
            NProgress.done()
        } catch (error: any) {
            console.error("Erreur API :", error.message);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="bg-gray-100 w-full h-full mx-auto">
            <div className="pt-20 bg-white md:w-[45rem] mx-auto">
                <div className="flex justify-center p-4">
                    <h1 className="font-bold md:text-xl text-base">Modifier le profil</h1>
                </div>
                <hr className="my-1" />
                <div>
                    <h1 className="font-bold md:text-xl text-base p-3 ml-5">Photo de profil</h1>
                    <div className="flex justify-center">
                        <label htmlFor="upload-photo" className="relative cursor-pointer">
                            <Image
                                src={previewImage || "/default-avatar.png"}
                                alt="Photo de profil"
                                width={100}
                                height={100}
                                className="w-24 h-24 rounded-full object-cover "
                            />
                            <input
                                id="upload-photo"
                                type="file"
                                name="pdpDoc"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>
                </div>
                <form onSubmit={handleUpdate} className="p-4">
                    <h1 className="font-bold  md:text-xl text-base p-4">Infos personnelles</h1>
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="md:text-base text-sm">Nom</label>
                            <input
                                value={formData.name}
                                name="name"
                                onChange={handleChange}
                                className="w-full border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-[#08a6a0] outline-none md:text-base text-sm"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="md:text-base text-sm">Prénom</label>
                            <input
                                value={formData.firstName}
                                name="firstName"
                                onChange={handleChange}
                                className="w-full border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-[#08a6a0] outline-none md:text-base text-sm"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="md:text-base text-sm">Mail</label>
                            <input
                                value={formData.email}
                                name="email"
                                onChange={handleChange}
                                className="w-full border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-[#08a6a0] outline-none md:text-base text-sm" />
                        </div>
                        <div className="flex flex-col">
                            <label className="md:text-base text-sm">Date de naissance</label>
                            <input
                                value={formData.annif}
                                name="annif"
                                type="date"
                                onChange={handleChange}
                                className="w-full border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-[#08a6a0] outline-none md:text-base text-sm" />
                        </div>
                        <div className="flex flex-col">
                            <label className="md:text-base text-sm">Lieu de naissance</label>
                            <input
                                value={formData.lieu}
                                name="lieu"
                                onChange={handleChange}
                                className="w-full border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-[#08a6a0] outline-none md:text-base text-sm" />
                        </div>
                        <div className="flex flex-col">
                            <label className="md:text-base text-sm">Telephone</label>
                            <input
                                value={formData.tel}
                                name="tel"
                                onChange={handleChange}
                                className="w-full border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-[#08a6a0] outline-none md:text-base text-sm" />
                        </div>
                        <div className="flex flex-col">
                            <label className="md:text-base text-sm">Adresse</label>
                            <input
                                value={formData.adresse}
                                name="adresse"
                                onChange={handleChange}
                                className="w-full border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-[#08a6a0] outline-none md:text-base text-sm" />
                        </div>

                        <div className="flex flex-col">
                            <label className="md:text-base text-sm">Ancien mot de passe</label>
                            <input
                                value={formData.password}
                                name="password"
                                type="password"
                                onChange={handleChange}
                                className="w-full border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-[#08a6a0] outline-none md:text-base text-sm" />
                        </div>
                        <div className="flex flex-col">
                            <label className="md:text-base text-sm">Nouveau mot de passe</label>
                            <input
                                value={nouvPassword}
                                name="nouvPassword"
                                type="password"
                                onChange={(e) => setNouvPassword(e.target.value)}
                                className="w-full border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-[#08a6a0] outline-none md:text-base text-sm" />
                        </div>
                    </div>
                    <div className=" mt-4">
                        <Button type="submit" className="bg-[#08a6a0] hover:bg-[#067f7a] md:text-base text-[0.6rem]">
                            Enregistrer la modification
                        </Button>
                    </div>
                </form>
            </div>
        </main>
    )
}