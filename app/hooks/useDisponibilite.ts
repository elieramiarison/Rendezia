import { useEffect, useState } from "react";

interface IDispo {
    _id: string,
    doctorId: string,
    nameDoc: string,
    specialiteDoc: string,
    date: string,
    startTime: string,
    endTime: string
}

export function useDisponibilite() {
    const [dispo, setDispo] = useState<IDispo[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchDispo = async () => {
            setLoading(true)
            try {
                const res = await fetch('/api/rdv')
                const data = await res.json()
                setDispo(data)
                setTimeout(() => {
                    setLoading(false);
                }, 1500);
            } catch {
                // console.log("Erreur de serveur")
                setLoading(false)
            }
        }
        fetchDispo()
    }, [])
    return { dispo, loading }
}