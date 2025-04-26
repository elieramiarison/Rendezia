import { getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function withAuth({ Component }: any) {
    return function ProtectedRoute(props: any) {
        const [loading, setLoading] = useState(true)
        const [session, setSession] = useState<any | any>(null)
        const router = useRouter()

        useEffect(() => {
            const checkSession = async () => {
                const session = getSession()
                if (!session) {
                    router.replace("/login")
                } else {
                    setSession(session)
                }
                setLoading(false)
            }
            checkSession()
        }, [])
        if (!session) null
        return <Component { ...props } session = { session } />
    }
}