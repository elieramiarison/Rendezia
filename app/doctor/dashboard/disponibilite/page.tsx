"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { MdDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { TailSpin } from "react-loader-spinner";
import { Button } from "@/components/ui/button";
import "react-toastify/dist/ReactToastify.css";
import toast from "react-hot-toast";

interface Disponibilite {
  _id: string;
  doctorId?: string;
  nameDoc?: string;
  specialiteDoc?: string;
  date: string;
  startTime: string;
  endTime: string;
  clinic?: string;
  tel?: string;
  firstName?: string;
  email?: string;
}

interface UserSession extends Session {
  user?: {
    id: string;
    name?: string;
    specialite?: string;
    clinic?: string;
    tel?: string;
    firstName?: string;
    email?: string;
    image?: string;
  };
}

export default function AddAvailability() {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [availabilities, setAvailabilities] = useState<Disponibilite[]>([]);
  const { data: session } = useSession() as { data: UserSession | null }
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [toggle, setIsToggle] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleClic = (id: string) => {
    setCurrentId(id);
    const selectedAvailability = availabilities.find(item => item._id === id);
    if (selectedAvailability) {
      setDate(selectedAvailability.date);
      setStartTime(selectedAvailability.startTime);
      setEndTime(selectedAvailability.endTime);
      setIsToggle(true);
    }
  };

  const handleBack = () => {
    setIsToggle(false)
    setDate("");
    setStartTime("");
    setEndTime("");
  }

  const handleUpdate = async () => {
    if (!currentId) return;
    setLoading(true)

    const updatedAvailability = { date, startTime, endTime };

    const res = await fetch(`/api/disponibilite/${currentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedAvailability),
    });

    if (res.ok) {
      setAvailabilities(availabilities.map(item =>
        item._id === currentId ? { ...item, ...updatedAvailability } : item
      ));
      setDate("");
      setStartTime("");
      setEndTime("");
      setIsToggle(false);
      setCurrentId(null);
      setLoading(false)
    } else {
      alert("Erreur lors de la mise à jour.");
      setLoading(false)
    }
  };

  const handleDelete = async (id: string) => {
    toast(
      (t) => (
        <div className="p-4">
          <p className="text-gray-800 font-medium">Voulez-vous supprimer vraiment ?</p>
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                await handleConfirmed(id);
              }}
              className="bg-[#067f7a] hover:bg-[#1d6965] text-white font-semibold px-4 py-2 rounded-lg transition"
            >
              Oui
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-lg transition"
            >
              Non
            </button>
          </div>
        </div>
      ),
      { duration: 3000 },
    )
  }

  const handleConfirmed = async (id: string) => {
    try {
      const res = await fetch(`/api/disponibilite/${id}`, {
        method: "DELETE"
      })
      if (res.ok) {
        setAvailabilities(availabilities.filter(item => item._id !== id))
      } else {
        alert("Donnee n'est pas supprimer")
      }
    } catch {
      alert("Donnee n'est pas supprimer")
    }
  }

  useEffect(() => {
    const fetchDisponibilites = async () => {
      try {
        const res = await fetch("/api/disponibilite", { credentials: "include" })
        if (!res.ok) throw new Error("Erreur lors de la récupération");
        const data = await res.json();
        if (Array.isArray(data)) {
          setAvailabilities(data);
        } else {
          console.error("Les données reçues ne sont pas un tableau :", data);
          setAvailabilities([]);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchDisponibilites();
  }, []);
  const id = session?.user?.id
  const name = session?.user?.name
  const specialite = session?.user?.specialite
  const clinic = session?.user?.clinic
  const tel = session?.user?.tel
  const firstName = session?.user?.firstName
  const email = session?.user?.email

  const handleAddAvailability = async () => {
    setLoading(true)
    if (!id || !name) {
      alert("Erreur : Impossible de récupérer le docteur.");
      return;
    }
    if (!date || !startTime || !endTime) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const newAvailability = { id, name, specialite, date, startTime, endTime, clinic, tel, firstName, email };

    const res = await fetch("/api/disponibilite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAvailability),
    });

    if (res.ok) {
      const savedAvailability = await res.json();
      setAvailabilities([...availabilities, savedAvailability]);
      setDate("");
      setStartTime("");
      setEndTime("");
      setLoading(false)
    } else {
      setLoading(false)
      alert("Erreur lors de l'ajout de la disponibilité.");
    }
  };

  return (
    <div className="bg-gray-100 h-full gap-10 relative pb-5">
      <div className="pt-0">
        <div className="p-6 bg-white shadow-2xl rounded-lg w-full max-w-2xl mx-auto mt-7">
          <h2 className="text-2xl font-bold text-center text-[#20363d]">Ajouter une date de rendez-vous</h2>

          <div className="mb-4">
            <label className="block text-gray-700">Date :</label>
            <input type="date" className="w-full px-3 py-2 border rounded-md" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="flex space-x-4 mb-4">
            <div className="w-1/2 sm:w-full">
              <label className="block text-gray-700">Heure de début :</label>
              <input type="time" className="w-full px-3 py-2 border rounded-md" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div className="w-1/2 sm:w-full">
              <label className="block text-gray-700">Heure de fin :</label>
              <input type="time" className="w-full px-3 py-2 border rounded-md" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>

          {
            toggle ? (
              <div className="flex gap-2">
                <Button onClick={handleUpdate} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition">
                  {loading ?
                    <TailSpin color="#fff" height={20} width={20} strokeWidth={5} />
                    : "Enregistrer"}
                </Button>
                <Button onClick={handleBack} className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md transition">
                  Annuler la modification
                </Button>
              </div>
            ) : (
              <div className="flex w-full gap-2">
                <div className="w-full">
                  <Button onClick={handleAddAvailability} className="w-full bg-[#08a6a0] hover:bg-[#067f7a] text-white py-2 rounded-md transition">
                    {loading ?
                      <TailSpin color="#fff" height={20} width={20} strokeWidth={5} />
                      : "Ajouter"}
                  </Button>
                </div>
              </div>
            )
          }

          <h3 className="text-lg font-semibold mt-6">Mes disponibilités</h3>
          <ul className="mt-2 space-y-2">
            {availabilities.map((item, index) => (
              <li key={index} className="p-2 bg-gray-100 rounded-md flex justify-between">
                📅 {item.date} | ⏰ {item.startTime} - {item.endTime}
                {
                  !toggle && (
                    <div className="flex gap-3">
                      <button className="text-blue-700 border ml-2" onClick={() => handleClic(item._id)}><FiEdit size={23} /></button>
                      <button className="text-red-500 ml-2" onClick={() => handleDelete(item._id)}><MdDelete size={25} /></button>
                    </div>
                  )
                }
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
