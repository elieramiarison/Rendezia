"use client"

// import { useDoctors } from "@/app/hooks/useDoctor";
import { useDoctors } from "../../../hooks/useDoctor"
import { AiOutlineClose } from "react-icons/ai";
import Image from "next/image";

export default function Modal({ doctor, onClose }: { doctor: string | null, onClose: () => void }) {

    const { data } = useDoctors()
    if (!doctor) return null;
    const data_ = data.find((item) => item._id === doctor)
    if (!data_) return null
    const imageUrl = data_?.pdpDoc || "/default-avatar.png";

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-sm max-w-[22rem]">
                <div className="mt-0 flex justify-end">
                    <button
                        className="p-2 bg-gray-200 text-black rounded-full hover:bg-gray-200"
                        onClick={onClose}
                    >
                        <AiOutlineClose size={20} />
                    </button>

                </div>
                <div className="flex flex-col justify-center items-center">
                    {imageUrl && (
                        <Image
                            src={imageUrl}
                            alt={`Photo de ${data_.name}`}
                            width={96}
                            height={96}
                            className="md:w-24 md:h-24 sm:w-24 sm:h-24 w-24 h-24 object-cover rounded-full mb-3 my-2 border-2 border-gray-400 pointer-events-none select-none" draggable={false}
                        />
                    )}
                    <h2 className="text-xl font-semibold mb-2">Dr {data_?.name} {data_.firstName}</h2>
                </div>
                <div className="mt-4">
                    <p><span className="font-semibold">Spécialité :</span>{data_?.specialite}</p>
                    <p><span className="font-semibold">Adresse email :</span> {data_?.email}</p>
                    <p><span className="font-semibold">Téléphone :</span> {data_?.tel}</p>
                    {data_?.genre && <p><span className="font-semibold">Genre :</span> {data_?.genre}</p>}
                    <p><span className="font-semibold">Lieu :</span> {data_?.clinic}</p>
                </div>

            </div>
        </div>
    );
};
