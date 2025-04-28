// "use client"
// import { createContext, useContext, useState, useEffect } from "react"
// import { useRouter } from "next/navigation";

// interface AuthContextType {
//     isAuthenticated: boolean;
//     userName: string | null;
//     pdp: string | null;
//     login: (token: string, name: string, pdp: any) => void;
//     logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [userName, setUserName] = useState<string | null>(null);
//     const [pdp, setPdp] = useState<string | null>(null)
//     const router = useRouter()

//     useEffect(() => {
//         const token = localStorage.getItem('token')
//         const storedName = localStorage.getItem("userName")
//         const storedPdp = localStorage.getItem("pdp")
//         if (token && storedName && storedPdp) {
//             setIsAuthenticated(true);
//             setUserName(storedName);
//             setPdp(storedPdp)
//         }
//     }, [])

//     const login = (token: string, name: string, pdp: any) => {
//         localStorage.setItem("token", token);
//         localStorage.setItem("userName", name)
//         localStorage.setItem("pdp", pdp)
//         setIsAuthenticated(true);
//         setUserName(name);
//         setPdp(pdp)
//         router.push('/app/dashboard/patient')
//     }

//     const logout = () => {
//         localStorage.removeItem("token");
//         localStorage.removeItem("userName");
//         localStorage.removeItem("pdp")
//         setIsAuthenticated(false);
//         setUserName(null);
//         setPdp(null)
//         router.push('/')
//     };

//     return (
//         <AuthContext.Provider value={{ isAuthenticated, userName, pdp, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     )
// }

// export function useAuth() {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error("useAuth must be used within an AuthProvider");
//     }
//     return context;
// }

"use client"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation";

interface AuthContextType {
    isAuthenticated: boolean;
    userName: string | null;
    pdp: string | null;
    login: (token: string, name: string, pdp: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const [pdp, setPdp] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedName = localStorage.getItem("userName");
        const storedPdp = localStorage.getItem("pdp");

        if (token && storedName) { // pdp est optionnel
            setIsAuthenticated(true);
            setUserName(storedName);
            setPdp(storedPdp); // Peut être null
        }
    }, [])

    const login = (token: string, name: string, pdp: string) => {
        // Validation basique
        if (typeof token !== 'string' || typeof name !== 'string') {
            throw new Error("Invalid credentials format");
        }

        localStorage.setItem("token", token);
        localStorage.setItem("userName", name);
        if (pdp) localStorage.setItem("pdp", pdp); // Stockage conditionnel

        setIsAuthenticated(true);
        setUserName(name);
        setPdp(pdp || null);
        router.push('/app/dashboard/patient');
    }

    const logout = () => {
        ['token', 'userName', 'pdp'].forEach(item => localStorage.removeItem(item));
        setIsAuthenticated(false);
        setUserName(null);
        setPdp(null);
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userName, pdp, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
