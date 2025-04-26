"use client"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation";

interface DocContextType {
    login: (token: string,
        name: string,
        pdpDoc: any,
        email: string,
        tel: string,
        genre: string,
        specialite: string,
        _id: string,
    ) => void;
    logout: () => void;
    isAuthenticated: boolean;
    name: string | null;
    pdpDoc: any,
    email: string | null,
    tel: string | null,
    genre: string | null,
    specialite: string | null,
    id: string | null
}

const DocContext = createContext<DocContextType | undefined>(undefined)

export function DocProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [name, setName] = useState<string | null>(null)
    const [pdpDoc, setPdpDoc] = useState<string | null>(null)
    const [email, setEmail] = useState<string | null>(null)
    const [tel, setTel] = useState<string | null>(null)
    const [genre, setGenre] = useState<string | null>(null)
    const [specialite, setSpecialite] = useState<string | null>(null)
    const [id, setId] = useState<any | null>(null)

    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('token')
        const storedName = localStorage.getItem("name")
        const storedPdp = localStorage.getItem("pdpDoc")
        const storedEmail = localStorage.getItem("email")
        const storedTel = localStorage.getItem("tel")
        const storedGen = localStorage.getItem("genre")
        const storedSpec = localStorage.getItem("specialite")
        const storedId = localStorage.getItem("id")

        if (token && storedName && storedPdp) {
            setIsAuthenticated(true)
            setName(storedName)
            setPdpDoc(storedPdp)
            setEmail(storedEmail)
            setTel(storedTel)
            setGenre(storedGen)
            setSpecialite(storedSpec)
            setId(storedId)

        }
    }, [])

    const login = (token: string, name: string, pdpDoc: string, email: string, tel: string, genre: string, specialite: string, _id: string) => {

        localStorage.setItem("token", token);
        localStorage.setItem("name", name);
        localStorage.setItem("pdpDoc", pdpDoc);
        localStorage.setItem("email", email);
        localStorage.setItem("tel", tel);
        localStorage.setItem("genre", genre);
        localStorage.setItem("specialite", specialite);
        localStorage.setItem("id", _id)

        setIsAuthenticated(true);
        setName(name);
        setPdpDoc(pdpDoc);
        setEmail(email);
        setTel(tel);
        setGenre(genre);
        setSpecialite(specialite);
        setId(_id)
    };


    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("name")
        localStorage.removeItem("pdpDoc")
        localStorage.removeItem("email")
        localStorage.removeItem("tel")
        localStorage.removeItem("genre")
        localStorage.removeItem("specialite")

        setIsAuthenticated(false)
        setName(null)
        setPdpDoc(null)
        setEmail(null)
        setTel(null)
        setGenre(null)
        setSpecialite(null)
        setId(null)
        router.push('/')
    }

    return (
        <DocContext.Provider value={{ login, logout, isAuthenticated, name, pdpDoc, email, tel, genre, specialite, id }}>
            {children}
        </DocContext.Provider>
    )
}

export function useDoc() {
    const context = useContext(DocContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context
}