import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import SignOutButton from "./components/sign-out-button";
import { redirect } from "next/navigation";
import { db } from "@/db"; // Assuming you have a db instance set up
import { usersToClinicsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const DashboardPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if(!session?.user){
        redirect("/authentication");
    }

    const clinics = await db.query.usersToClinicsTable.findMany({
        where: eq(usersToClinicsTable.userId, session.user.id),
    })

    if( clinics.length === 0) {
        redirect("/clinic-form");
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <h2>{session?.user?.name}</h2>
            <h2>{session?.user?.email}</h2>
            <SignOutButton />
        </div>
    );
}
 
export default DashboardPage;