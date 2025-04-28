import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

type RendezVous = {
    _id: string;
    date: string;
    startTime: string;
    endTime: string;
    name: string;
    doctorId: string;
    userId: string;
};

const Charte = () => {
    const [rdv, setRdv] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/rdvDoc");
                const data = await res.json();
                setRdv(data);
            } catch {
                console.log("Il y a une erreur sur la récupération des données")
            }
        };
        fetchData();
    }, []);

    // Regrouper par date et compter le nombre de rendez-vous
    const aggregatedData = rdv.reduce<{ date: string; count: number }[]>((acc, curr: RendezVous) => {
        const existing = acc.find((item) => item.date === curr.date);
        if (existing) {
            existing.count += 1;
        } else {
            acc.push({ date: curr.date, count: 1 });
        }
        return acc;
    }, []);

    return (
        <div className="bg-white flex flex-col justify-center items-center p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-500">Nombre de rendez-vous par jour</h3>
            <BarChart width={330} height={250} data={aggregatedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
        </div>
    );
};

export default Charte;
