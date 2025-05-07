"use client";

// import { useDisponibilite } from "@/app/hooks/useDisponibilite";
import { useDisponibilite } from "../../../hooks/useDisponibilite"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Card } from "../../../../components/ui/card"
import { CardContent } from "../../../../components/ui/card"
import { CardHeader } from "../../../../components/ui/card"
import { CardTitle } from "../../../../components/ui/card"
// import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Modal from "../../components/modal/page";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "react-toastify/dist/ReactToastify.css";
import toast from "react-hot-toast";
import { Session } from "next-auth";
import SkeletonCard from "../../components/skeleton/rendez-vous/page";
import 'react-loading-skeleton/dist/skeleton.css';

interface Appointment {
  _id: string;
  nameDoc: string;
  specialiteDoc: string;
  date: string;
  startTime: string;
  endTime: string;
  doctorId: string;
}

interface UserSession {
  id?: string;
  name?: string;
  firstName?: string;
  email?: string;
  annif?: string;
  lieu?: string;
  adresse?: string;
  tel?: string;
  image?: string;
}

interface CustomSession {
  user?: UserSession;
}

interface UserAppointment {
  data: CustomSession | null
  id: string;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  update: (data?: Partial<UserSession>) => Promise<Session | null>;
}


const AppointmentForm = () => {
  const { dispo, loading } = useDisponibilite();
  const { data: session, status, update } = useSession() as UserAppointment;
  const [disabledButtons, setDisabledButtons] = useState<{ [key: string]: boolean }>({});
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserAppointments = async () => {
      if (!session?.user?.id) return;

      const res = await fetch(`/api/rdvUser/${session.user.id}`);

      if (res.ok) {
        const userAppointments = await res.json();
        const takenDates = userAppointments.reduce((acc: Record<string, boolean>, rdv: UserAppointment) => {
          acc[rdv.id] = true;
          return acc;
        }, {} as { [key: string]: boolean });
        setDisabledButtons(takenDates);
      }

    };

    fetchUserAppointments();
    const handleFocus = () => {
      update();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [session, status]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen ">
        <h1>Chargement...</h1>
      </div>
    );
  }

  if (status !== "authenticated") {
    return (
      <div className="flex justify-center items-center h-screen ">
        <h1 className="text-red-600">Non connecté</h1>
      </div>
    );
  }

  const handleCancel = async (id: string) => {
    NProgress.start()
    try {
      const res = await fetch(`/api/rdvDoc/${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setDisabledButtons((prev) => ({ ...prev, [id]: false }))
        NProgress.done()
      } else {
        alert("Échec de l'annulation du rendez-vous");
        NProgress.done()
      }
    } catch (error) {
      console.error("Erreur lors de l'annulation du rendez-vous :", error);
      NProgress.done()
    }
  }

  const handleClick_ = async (id: string) => {
    toast(
      (t) => (
        <div className="p-4">
          <p className="text-gray-800 font-medium">Voulez-vous annuler votre réservation ?</p>
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                await handleCancel(id);
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

  const handleClick = async (id: string, date: string, startTime: string, endTime: string, doctorId: string) => {
    toast(
      (t) => (
        <div className="p-4">
          <p className="text-gray-800 font-medium">Voulez-vous confirmer votre réservation ?</p>
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                await confirmReservation(id, date, startTime, endTime, doctorId);
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
    );
  };

  const confirmReservation = async (id: string, date: string, startTime: string, endTime: string, doctorId: string) => {
    NProgress.start();
    if (!session?.user?.id) {
      return;
    }
    const rdvDoc = {
      id,
      name: session.user.name,
      firstName: session.user.firstName,
      email: session.user.email,
      annif: session.user.annif,
      lieu: session.user.lieu,
      adresse: session.user.adresse,
      tel: session.user.tel,
      pdp: session.user.image,
      date,
      startTime,
      endTime,
      doctorId
    };

    try {
      const res = await fetch("/api/rdvDoc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rdvDoc),
      });
      if (!res.ok) {
        throw new Error("Échec de la réservation !");
      }
      setDisabledButtons((prev) => ({ ...prev, [id]: true }));
    } catch (error: any) {
      console.log("Ty ngia:::", error.message)
      setDisabledButtons((prev) => ({ ...prev, [id]: false }));
    } finally {
      NProgress.done();
    }
  };

  const openModal = (doctor: string | null) => {
    NProgress.start()
    setSelectedDoctor(doctor)
    setIsModalOpen(true)
    NProgress.done()
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="pt-[5.5rem] pb-6 px-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Rendez-vous disponible</h2>
      {loading === true ?
        (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )
        : (
          <>
            {dispo.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[67vh] py-0">
                <p className="text-xl font-semibold text-gray-500">Aucun rendez-vous disponible pour le moment</p>
                <p className="text-sm text-gray-400">Les données s&apos;afficheront ici dès qu&apos;un docteur aura mets la date.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                  {dispo.map((rdv: Appointment) => (
                    <Card key={rdv._id} className="p-4">
                      <CardHeader>
                        {/* <Image src={rdv.pdp} /> */}
                        <CardTitle>Dr {rdv.nameDoc} ({rdv.specialiteDoc}) </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>Date : {rdv.date}</p>
                        <p>Du : {rdv.startTime}</p>
                        <p>Jusqu&ops;à : {rdv.endTime}</p>
                        <div className="flex gap-3">
                          {disabledButtons[rdv._id] ? <button
                            className="mt-2 bg-red-600 hover:bg-red-700 w-full p-2 rounded-md text-white"
                            onClick={() => handleClick_(rdv._id)}
                          >
                            Annuler ce date
                          </button> :
                            <button
                              className="mt-2 bg-[#067f7a] hover:bg-[#1d6965] w-full p-2 rounded-md text-white"
                              onClick={() => handleClick(rdv._id, rdv.date, rdv.startTime, rdv.endTime, rdv.doctorId)}
                            >
                              Prendre ce date
                            </button>}
                          <button
                            className="mt-2 bg-blue-600 hover:bg-blue-700 w-full p-2 rounded-md text-white"
                            onClick={() => openModal(rdv.doctorId)}
                          >
                            Voir le profil
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      {isModalOpen && <Modal doctor={selectedDoctor} onClose={closeModal} />}
    </div>
  );
};

export default AppointmentForm;