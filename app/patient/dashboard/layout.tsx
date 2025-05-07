import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClientLayout from "../components/DashboardClientLayout";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/patient/login");
        alert("Vous devez vous connecter pour acceder a cette page.")
    }

    return <DashboardClientLayout>{children}</DashboardClientLayout>;
}
