"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from "../dashboard/components/footer/page";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export default function Login() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [tel, setTel] = useState('')
  const [genre, setGenre] = useState('')
  const [specialite, setSpecialite] = useState('')
  const [clinic, setClinic] = useState('')
  const [pdpDoc, setPdpDoc] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null);

  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdpDoc(file);
      setPreview(URL.createObjectURL(file)); // Génère un aperçu de l'image
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    NProgress.start()
    e.preventDefault()

    const formData = new FormData()
    formData.append("name", name)
    formData.append("firstName", firstName)
    formData.append("email", email)
    formData.append("password", password)
    formData.append("tel", tel)
    formData.append("clinic", clinic)
    formData.append("specialite", specialite)
    if (!genre) {
      formData.append("genre", genre)
      // console.log("Genre:::", genre)
    }

    if (pdpDoc) {
      formData.append("pdpDoc", pdpDoc)
    }

    const res = await fetch('/api/doctAuth/signup', {
      method: "POST",
      body: formData
    })

    const data = await res.json();
    if (res.ok) {
      router.push('/doctor/login')
    } else {
      console.error("Erreur API :", data);
      alert(data.message || "Erreur lors de l'inscription");
    }
    NProgress.done()
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
          <Card className="lg:w-[450px] md:w-[400px] sm:w-[350px] w-[350px] mt-14">
            <CardHeader className="flex items-start">
              <CardTitle className="font-bold text-xl text-[#20363d]">Vous êtes docteur ?</CardTitle>
              <p className="text-sm text-[#20363d]">C'est le moment de créer votre compte !</p>
              <p className="text-sm">Les champs avec <span className="text-red-600">*</span> sont obligatoire</p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSignup} className="flex flex-col gap-3">

                <Label className="text-sm text-[#20363d]">Photo de profile<span className="text-red-600">*</span></Label>
                <div className="flex flex-col items-center mb-4">
                  <label htmlFor="pdp">
                    <Image
                      src={preview || "/avatar.jpeg"}
                      alt="Profile"
                      width={100}
                      height={100}
                      className="w-24 h-24 rounded-full object-cover cursor-pointer border-2 border-gray-300"
                    />
                  </label>
                  <Input
                    id="pdp"
                    name="pdp"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <Label className="text-sm text-[#20363d]">Nom<span className="text-red-600">*</span></Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Scofield"
                  name="name"
                />

                <Label className="text-sm text-[#20363d]">Prénom<span className="text-red-600">*</span></Label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  type="text"
                  placeholder="John Doe"
                  name="firstName"
                />

                <Label className="text-sm text-[#20363d]">Adrèsse e-mail<span className="text-red-600">*</span></Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="exemple@gmail.com"
                  name="email"
                />

                <Label className="text-sm text-[#20363d]">Numéro de telephone<span className="text-red-600">*</span></Label>
                <Input
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  type="text"
                  placeholder="03X XX XXX XX"
                  name="tel"
                />

                <Label className="text-sm text-[#20363d]">Genre<span className="text-red-600">*</span></Label>
                <select value={genre} defaultValue="Homme" onChange={(e) => setGenre(e.target.value)} className="w-full p-1.5 rounded-lg border border-[#000000ab]">
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                </select>

                <Label className="text-sm text-[#20363d]">Spécialité<span className="text-red-600">*</span></Label>
                <Input
                  value={specialite}
                  onChange={(e) => setSpecialite(e.target.value)}
                  type="text"
                  placeholder="ex: Dérmatologue"
                  name="specialite"
                />

                <Label className="text-sm text-[#20363d]">Nom du clinique<span className="text-red-600">*</span></Label>
                <Input
                  value={clinic}
                  onChange={(e) => setClinic(e.target.value)}
                  type="text"
                  placeholder="ex: Clinique Ilafy"
                  name="clinic"
                />

                <Label className="text-sm text-[#20363d]">Mots de passe<span className="text-red-600">*</span></Label>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="********"
                  name="password"
                />

                <SubmitButton />
              </form>
              <div className="flex justify-center p-2">
                <p>
                  Vous avez déjà un compte ? <Link
                    href="/doctor/login"
                    className="text-[#067f7a] underline"
                  >Se connecter ici</Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-[9rem] lg:flex hidden">
          <Image src="/main.svg" width={400} height={400} alt="User" />
        </div>
      </div>
      <Footer />
    </div>
  )
}

const SubmitButton = () => {
  return (
    <Button type="submit" className="bg-[#067f7a] hover:bg-[#1d6965] text-white px-4 py-2 rounded-full">S'inscrire</Button>
  )
}