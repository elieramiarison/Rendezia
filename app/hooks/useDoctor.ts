import { useEffect, useState } from "react"

interface IProfile {
    _id: string,
    name: string,
    email: string,
    tel: string,
    specialite: string,
    genre: string,
    pdpDoc: Record<string, any>,
    firstName: string,
    clinic: string
}
export const useDoctors = () => {
    const [data, setData] = useState<IProfile[]>([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await fetch('/api/doctor')
                const data = await res.json()
                setData(data)
            } catch (error: any) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchDoctors()
    }, [])
    return { data, loading, error }
}