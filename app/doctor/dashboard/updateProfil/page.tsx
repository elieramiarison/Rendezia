"use client"
// import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Session } from "next-auth";
import Image from "next/image";

interface UserSession {
  user?: {
    name?: string;
    firstName?: string;
    email?: string;
    tel?: string;
    specialite?: string;
    clinic?: string;
    genre?: string;
    image?: string;
  };
}

interface SessionReturn {
  data: UserSession;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  update: (data?: unknown) => Promise<Session | null>;
}

export default function Login() {
  const router = useRouter()
  const { data: session, status, update } = useSession() as SessionReturn;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    firstName: "",
    tel: "",
    genre: "Homme",
    specialite: "",
    clinic: "",
    password: "",
  })
  const [newPassword, setNewPassword] = useState("")
  const [pdpDoc_, setPdpDoc] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)
  const [errorImg, setErrorImg] = useState(false)

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setFormData({
        name: session.user.name || "",
        firstName: session.user.firstName || "",
        email: session.user.email || "",
        tel: session.user.tel || "",
        genre: session.user.genre || "Homme",
        specialite: session.user.specialite || "",
        clinic: session.user.clinic || "",
        password: "",
      })
      setPreviewImage(session.user.image || "");
    }
  }, [session, status]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setErrorImg(true)
        return;
      }
      setPdpDoc(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const updatedFormData = new FormData()
    updatedFormData.append("name", formData.name)
    updatedFormData.append("firstName", formData.firstName)
    updatedFormData.append("email", formData.email)
    updatedFormData.append("clinic", formData.clinic)
    updatedFormData.append("password", formData.password)
    updatedFormData.append("tel", formData.tel)
    updatedFormData.append("newPassword", newPassword)
    if (!formData.genre) {
      updatedFormData.append("genre", formData.genre)
    }
    updatedFormData.append("specialite", formData.specialite)
    if (pdpDoc_) {
      updatedFormData.append("pdpDoc", pdpDoc_)
    }

    try {
      const res = await fetch('/api/doctAuth/signup', {
        method: "PUT",
        body: updatedFormData
      })
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Une erreur s'est produite.");
      await update()
      await signIn("credentials", { redirect: false });
      router.refresh();
      router.push('/doctor/dashboard/profil');
    } catch (error) {
      console.error("Erreur API :", error);
      alert(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-gray-100 w-full h-full mx-auto">
      <div className=" bg-white md:w-[45rem] mx-auto">
        <div className="flex justify-center p-4">
          <h1 className="font-bold md:text-xl text-base">Modifier le profil</h1>
        </div>
        <hr className="my-1" />
        <div>
          <h1 className="font-bold md:text-xl text-base p-3 ml-5">Photo de profil</h1>
          <div className="flex flex-col justify-center items-center">
            <label htmlFor="upload-photo" className="relative cursor-pointer">
              <Image
                src={previewImage || "/default-avatar.png"}
                alt="Photo de profil"
                width={100}
                height={100}
                className="w-24 h-24 rounded-full border-2 border-gray-600 object-cover "
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
              <label className="md:text-base text-sm">Specialite</label>
              <input
                value={formData.specialite}
                name="specialite"
                type="text"
                onChange={handleChange}
                className="w-full border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-[#08a6a0] outline-none md:text-base text-sm" />
            </div>
            <div className="flex flex-col">
              <label className="md:text-base text-sm">Genre</label>
              <input
                value={formData.genre}
                name="genre"
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
              <label className="md:text-base text-sm">Clinique</label>
              <input
                value={formData.clinic}
                name="clinic"
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
                value={newPassword}
                name="newPassword"
                type="password"
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-[#08a6a0] outline-none md:text-base text-sm" />
            </div>
          </div>
          <div className=" mt-4">
            <button type="submit" className="bg-[#08a6a0] hover:bg-[#067f7a] md:text-base p-2 rounded-md text-white w-64 text-[0.6rem]">
              {loading ?
                "Enregistrer la modification..."
                : "Enregistrer la modification"}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}