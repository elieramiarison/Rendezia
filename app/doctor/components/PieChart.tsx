import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

type RendezVous = {
    _id: string;
    date: string;
    startTime: string;
    endTime: string;
    name: string;
    doctorId: string;
    userId: string;
};

const PieCharte = () => {
    const [rdv, setRdv] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/rdvDoc");
                const data = await res.json();
                setRdv(data);
            } catch (error) {
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
            <h3 className="text-lg font-semibold text-gray-500">Répartition des rendez-vous par jour</h3>
            <PieChart width={330} height={250}>
                <Pie data={aggregatedData} dataKey="count" nameKey="date" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                    {aggregatedData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    );
};

export default PieCharte;
