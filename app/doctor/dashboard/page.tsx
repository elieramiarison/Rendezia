"use client";

import Card from "../components/Card";
import Chart from "../components/Chart";
import Charte from "../components/BarChart";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useState, useEffect } from "react";
import PieCharte from "../components/PieChart";
import Image from 'next/image';

interface IRdv {
  _id: string,
  name: string,
  startTime: string,
  endTime: string,
  date: string,
  pdp: string,
  firstName: string,
  email: string,
  tel: string,
  annif: string,
  lieu: string,
  adresse: string
}

const avatarColors = [
  "bg-red-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-yellow-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-amber-500",
];

function getColorFromString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index];
}

const Dashboard = () => {

  const [rdv, setRdv] = useState<IRdv[]>([])
  const [openPatient, setOpenPatient] = useState<string | null>(null)

  const toggleDetails = (id: string) => {
    // setOpenPatient(openPatient === id ? null : id)
    setOpenPatient(prev => prev === id ? null : id);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/rdvDoc')
        const data = await res.json()
        setRdv(data)
      } catch {
        alert("Il y a une erreur sur la recuperation")
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        <Card title="Cost per Unit" amount="$17.21" color="bg-purple-500" />
        <Card title="Market Revenue" amount="$1875.54" color="bg-green-500" />
        <Card title="Expenses" amount="$784.62" color="bg-orange-500" />
        <Card title="Daily Visits" amount="1,15,187" color="bg-blue-500" />
      </div>

      {rdv.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[67vh] py-0">
          <p className="text-xl font-semibold text-gray-500">Aucun patient pour le moment</p>
          <p className="text-sm text-gray-400">Les données s&apos;afficheront ici dès qu&apos;un patient aura pris rendez-vous.</p>
        </div>

      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <Chart />
            <PieCharte />
            <Charte />
          </div>

          {/* Section Patients */}
          <section className="mt-6">
            <h1 className="lg:text-2xl font-bold text-center text-[#20363d]">Liste de vos patients</h1>
            <div className="mt-3 bg-white border-b-[1px] border-[#20363d44] w-full">
              {rdv.map((patient) => (
                <div key={patient._id} className="border-b last:border-none">
                  <div className="flex justify-between items-center p-0 px-4 hover:bg-gray-50 hover:text-blue-500 cursor-pointer">
                    <div className="flex justify-center items-center gap-4">
                      {patient.pdp ? (
                        <Image
                          src={patient.pdp}
                          alt={`Photo de ${patient.name}`}
                          width={96}
                          height={96}
                          className="md:w-12 md:h-12 sm:w-24 sm:h-24 w-24 h-24 object-cover rounded-full mb-5 my-2"
                        />
                      ) : (
                        <div className="my-5">
                          <div className={`w-11 h-11 rounded-full ${getColorFromString(patient.email || patient.name || "")} flex items-center justify-center text-white text-lg font-bold border-2 border-gray-300`}>
                            {patient.name?.[0]?.toUpperCase() || ""}
                            {patient.firstName?.[0]?.toUpperCase() || ""}
                          </div>
                        </div>
                      )}
                      <h2 className="text-lg font-semibold font-sans">{patient.name} {patient.firstName}</h2>
                    </div>
                    <button className="text-gray-600 text-lg" onClick={() => toggleDetails(patient._id)}>
                      {openPatient === patient._id ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </div>
                  {openPatient === patient._id && (
                    <div className="px-3 text-gray-700 bg-gray-50">
                      <div className="mb-4">
                        <h1 className="font-semibold text-[#0e1b1f]">Information sur le patient</h1>
                        <p className="text-gray-600">Adresse email : {patient.email}</p>
                        <p className="text-gray-600">Téléphone : {patient.tel}</p>
                        <p className="text-gray-600">Née le : {patient.annif}</p>
                        <p className="text-gray-600">à : {patient.lieu}</p>
                        <p className="text-gray-600">Adrèsse : {patient.adresse}</p>
                      </div>
                      <div>
                        <h1 className="font-semibold text-[#0e1b1f]">A propos du rendez-vous</h1>
                        <p className="text-gray-700">Le : {patient.date}</p>
                        <p className="text-gray-700">Du : {patient.startTime}</p>
                        <p className="text-gray-600">Jusqu&apos;à : {patient.endTime}</p>
                      </div>

                      <p className="text-sm pb-4">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores doloremque dolorum rerum, omnis quis tempora amet maxime eveniet ex commodi quasi, voluptatibus id libero inventore fugiat quos! Assumenda, perferendis et?
                        Deserunt quam assumenda officia eaque, minima veniam quod sapiente sint illo, eligendi blanditiis quas, dolorum laborum vel
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </>
      )}

    </div>
  );
};

export default Dashboard;
