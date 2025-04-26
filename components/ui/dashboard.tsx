"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Avatar } from "@/components/ui/avatar";
import { Calendar, User, LogOut } from "lucide-react";
import { useDoc } from "@/app/context/DocContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function DoctorDashboard() {
  const router = useRouter()
  const { data: session, status } = useSession()

  const [appointments] = useState([
    { id: 1, patient: "Jean Dupont", date: "2025-03-01", heure: "10:00" },
    { id: 2, patient: "Marie Curie", date: "2025-03-01", heure: "14:30" },
  ]);
  if (!session) {
    return <p>Chargement...</p>
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}


      {/* Contenu principal */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Bonjour Dr {session?.user?.name} 👋</h1>
          <div className="relative w-12 h-12">
            {session?.user?.image && (
              <div>
                <Image
                  src={session?.user?.image}
                  alt="Photo de profil"
                  width={50}
                  height={50}
                  className="rounded-full border-2 border-gray-200"
                />
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
            )
            }
          </div>
        </div>

        {/* Section Rendez-vous */}
        <section className="mt-6">
          <h2 className="text-xl font-semibold">Rendez-vous du jour 📅</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
            {appointments.map((rdv) => (
              <Card key={rdv.id} className="p-4">
                <CardHeader>
                  <CardTitle>{rdv.patient}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Date : {rdv.date}</p>
                  <p>Heure : {rdv.heure}</p>
                  <Button className="mt-2 bg-green-600 hover:bg-green-700 w-full">Voir Détails</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Section Patients */}
        <section className="mt-6">
          <h2 className="text-xl font-semibold">Mes Patients 🏥</h2>
          <div className="mt-3 bg-white p-4 shadow rounded-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Nom</th>
                  <th className="p-2 text-left">Dernier Rendez-vous</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-2">Jean Dupont</td>
                  <td className="p-2">01/03/2025</td>
                  <td className="p-2">
                    <Button className="bg-blue-600 hover:bg-blue-700">Voir Profil</Button>
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="p-2">Marie Curie</td>
                  <td className="p-2">01/03/2025</td>
                  <td className="p-2">
                    <Button className="bg-blue-600 hover:bg-blue-700">Voir Profil</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
