import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import SignOutButton from "./components/sign-out-button";
import { redirect } from "next/navigation";
import { db } from "@/db"; // Assuming you have a db instance set up
import { usersToClinicsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { PageContainer, PageHeader, PageHeaderContent, PageTitle, PageDescription, PageActions, PageContent } from "@/components/ui/page-container";
import { Plus } from "lucide-react";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  const clinics = await db.query.usersToClinicsTable.findMany({
    where: eq(usersToClinicsTable.userId, session.user.id),
  });

  if (clinics.length === 0) {
    redirect("/clinic-form");
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Dashboard</PageTitle>
          <PageDescription>
            Bem-vindo ao seu painel de controle!
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <h1>Dashboard</h1>
      </PageContent>
    </PageContainer>
  );
};

export default DashboardPage;
