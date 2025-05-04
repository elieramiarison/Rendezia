"use client"
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Card } from "../../../components/ui/card"
import { CardContent } from "../../../components/ui/card"
import { CardHeader } from "../../../components/ui/card"
import { CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Footer from "../components/footer/page";

export default function Login() {

  const [name, setName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [annif, setAnnif] = useState('')
  const [lieu, setLieu] = useState('')
  const [adresse, setAdresse] = useState('')
  const [tel, setTel] = useState('')
  const [password, setPassword] = useState('')
  const [pdp, setPdp] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null);
  const [errorImg, setErrorImg] = useState(false)

  const router = useRouter()
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 1 * 1024 * 1024;
      if (file.size > maxSize) {
        setErrorImg(true)
        return;
      }
      setPdp(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    NProgress.start()
    setError(null)

    const formData = new FormData()
    formData.append("name", name);
    formData.append("firstName", firstName);
    formData.append("email", email);
    formData.append("annif", annif);
    formData.append("lieu", lieu)
    formData.append("adresse", adresse)
    formData.append("tel", tel)
    formData.append("password", password);
    if (pdp) {
      formData.append("pdp", pdp);
    }

    const res = await fetch('/api/patientAuth/signup', {
      method: "POST",
      body: formData
    })
    NProgress.done()

    const data = await res.json();
    if (res.ok) {
      router.push('/patient/login')
    } else {
      console.error("Erreur API :", data);
      alert(data.message || "Erreur lors de l'inscription");
    }
  }

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
          <Card className="lg:w-[450px] md:w-[400px] sm:w-[350px] w-[350px] mt-14">
            <CardHeader className="flex items-start">
              <CardTitle className="font-bold text-xl text-[#20363d]">Nouveau sur Rendezia ?</CardTitle>
              <p className="text-sm text-[#20363d]">C&apos;est le moment de créer votre compte !</p>
              <p className="text-sm">Les champs avec <span className="text-red-600">*</span> sont obligatoire</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignup} className="flex flex-col gap-[0.30rem]">
                <Label className="text-sm text-[#20363d]">Photo de profile</Label>
                <div className="mb-5">
                  {errorImg ?
                    <Label className="text-red-600 text-sm">La taille de l'image ne doit pas dépasser 1MB.</Label>
                    :
                    <Label className="text-sm text-[#20363dd6]">La taille de l'image ne doit pas dépasser 1MB.</Label>
                  }
                </div>

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
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Scofield"
                  required
                />

                <Label className="text-sm text-[#20363d]">Prenom<span className="text-red-600">*</span></Label>
                <Input
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  type="text"
                  placeholder="John doe"
                  required
                />
                <Label className="text-sm text-[#20363d]">Adresse e-mail<span className="text-red-600">*</span></Label>
                <Input
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="exemple@gmail.com"
                  required
                />
                <Label className="text-sm text-[#20363d]">Date de naissance<span className="text-red-600">*</span></Label>
                <Input
                  name="annif"
                  value={annif}
                  onChange={(e) => setAnnif(e.target.value)}
                  type="date"
                  required
                />
                <Label className="text-sm text-[#20363d]">Lieu de naissance<span className="text-red-600">*</span></Label>
                <Input
                  name="lieu"
                  value={lieu}
                  onChange={(e) => setLieu(e.target.value)}
                  type="text"
                  placeholder="Tananarive"
                  required
                />
                <Label className="text-sm text-[#20363d]">Adresse<span className="text-red-600">*</span></Label>
                <Input
                  name="adresse"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  type="text"
                  placeholder="Lot BB 101 p/elle 14/22 Ambohipo"
                  required
                />
                <Label className="text-sm text-[#20363d]">Téléphone<span className="text-red-600">*</span></Label>
                <Input
                  name="tel"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  type="text"
                  placeholder="03X XX XXX XX"
                  required
                />
                <Label className="text-sm text-[#20363d]">Mots de passe<span className="text-red-600">*</span></Label>
                <Input
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Saisir le mot de passe"
                  required
                />

                <SubmitButton />
                {error && (
                  <div className="text-red-700 text-sm text-start">
                    {error}
                  </div>
                )}
              </form>
              <div className="flex justify-center p-2">
                <p>
                  Vous avez déjà un compte ? <Link
                    href="/patient/login"
                    className="text-[#067f7a] underline"
                  >Se connecter ici</Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-[9rem] lg:flex hidden">
          <Image src="/main.svg" width={400} height={400} alt="User" className="pointer-events-none select-none" draggable={false} />
        </div>
      </div>
      <Footer />
    </div>
  )
}

const SubmitButton = () => {
  return (
    <button type="submit" className="bg-[#067f7a] hover:bg-[#1d6965] p-[0.35rem] text-white rounded-full mt-2">
      S&apos;inscrire
    </button>
  )
}