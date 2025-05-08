"use client"
// import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
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

interface UserData {
    name?: string;
    firstName?: string;
    email?: string;
    annif?: string;
    lieu?: string;
    adresse?: string;
    tel?: string;
    image?: string;
}

interface UserSession {
    user?: UserData;
}

interface SessionReturn {
    data: UserSession | null;
    status: 'loading' | 'authenticated' | 'unauthenticated';
    update: (data?: Partial<UserData>) => Promise<Session | null>;
}


export default function UpdateProfil() {
    const { data: session, status, update } = useSession() as SessionReturn

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
    const [errorImg, setErrorImg] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toggle, setToggle] = useState(false)
    const [removePdpDoc, setRemovePdpDoc] = useState(false);
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
        const handleFocus = () => {
            // window.location.reload();
            update()
        };

        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, [session, status])

    // if (status === "loading") {
    //     return (
    //         <div className="flex justify-center items-center h-screen ">
    //             <h1>Chargement...</h1>
    //         </div>
    //     );
    // }

    if (status !== "authenticated") {
        return (
            <div className="flex justify-center items-center h-screen ">
                <h1 className="text-red-600">Non connecté</h1>
            </div>
        );
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                setErrorImg(true)
                return;
            }
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
        } else {
            updatedFormData.append("removePdpDoc", "true");
        }

        try {
            const res = await fetch('/api/patientAuth/signup', {
                method: "PUT",
                body: updatedFormData
            })
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Une erreur s'est produite.");
            }
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
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
            console.error("Erreur API :", errorMessage);
            alert(errorMessage);
            NProgress.done()
        }
        finally {
            setLoading(false);
        }
    }
    const handleRemoveImage = () => {
        setPreviewImage(null);
        setPdp(null);
        setIsModalOpen(false);
        setRemovePdpDoc(true)
    };

    return (
        <main className="bg-gray-100 w-full h-full mx-auto">
            <div className="pt-20 bg-white md:w-[45rem] mx-auto">
                <div className="flex justify-center p-4">
                    <h1 className="font-bold md:text-xl text-base">Modifier le profil</h1>
                </div>
                <hr className="my-1" />
                <div>
                    <h1 className="font-bold md:text-xl text-base p-3 ml-5">Photo de profil</h1>
                    <div className="flex flex-col justify-center items-center">
                        {previewImage ? (
                            <>
                                <div>
                                    <Image
                                        src={previewImage}
                                        alt="Photo de profil"
                                        width={100}
                                        height={100}
                                        className="w-24 h-24 rounded-full border-2 border-gray-600 object-cover cursor-pointer"
                                        onClick={() => {
                                            setIsModalOpen(true)
                                            setToggle(false);
                                        }}
                                    />
                                </div>
                                {/* Modale */}
                                <div>
                                    {isModalOpen && (
                                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                                            <div className="bg-white p-4 rounded-md flex flex-col items-center">
                                                <div
                                                    className="cursor-pointer"
                                                    onClick={() => setToggle(true)}
                                                >
                                                    {toggle ? '' : (
                                                        <Image
                                                            src={previewImage}
                                                            alt="Aperçu"
                                                            width={100}
                                                            height={100}
                                                            className="lg:w-[14rem] lg:h-[16rem] md:w-[14rem] md:h-[16rem] w-[12rem] h-[14rem] rounded-md mb-4"
                                                        />
                                                    )}
                                                    {toggle && (
                                                        <label className="relative">
                                                            <Image
                                                                src={previewImage}
                                                                alt="Aperçu"
                                                                width={200}
                                                                height={200}
                                                                className="rounded-md mb-4"
                                                            />

                                                            <input
                                                                id="upload-photo"
                                                                type="file"
                                                                name="pdpDoc"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={handleFileChange}
                                                                ref={(input) => input?.click()}
                                                            />
                                                        </label>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={handleRemoveImage}
                                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mb-2"
                                                >
                                                    Supprimer la photo
                                                </button>
                                                <button
                                                    onClick={() => setIsModalOpen(false)}
                                                    className="text-gray-500 text-sm underline"
                                                >
                                                    Fermer
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <label className="relative">
                                <div className="w-24 h-24 rounded-full bg-gray-400 flex items-center justify-center text-white text-2xl font-bold border-2 border-gray-600 cursor-pointer">

                                    <input
                                        id="upload-photo"
                                        type="file"
                                        name="pdpDoc"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />

                                    {session?.user?.name?.[0]?.toUpperCase() || ""}
                                    {session?.user?.firstName?.[0]?.toUpperCase() || ""}
                                </div>
                            </label>
                        )}
                        {errorImg && <p className="text-red-600 text-sm">La taille de l'image ne doit pas dépasser 5MB.</p>}
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
                        <button type="submit" disabled={loading} className="bg-[#067f7a] hover:bg-[#1d6965] py-[0.40rem] px-4 text-white rounded-full md:text-base sm:text-xs text-xs">
                            {loading ? "Enregistrement..." : "Enregistrer la modification"}
                        </button>

                    </div>
                </form>
            </div>
        </main>
    )
}