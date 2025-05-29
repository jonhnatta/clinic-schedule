import { Button } from "@/components/ui/button";
import { PageContainer, PageHeader, PageHeaderContent, PageTitle, PageDescription, PageActions, PageContent } from "@/components/ui/page-container";
import { Plus } from "lucide-react";

const AppointmentPage = () => {
  return (
        <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Agendamentos</PageTitle>
          <PageDescription>
            Aqui você pode gerenciar os agendamentos do sistema, incluindo a criação,
            edição e exclusão de registros.
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <Plus />
          <Button>Adicionar Agendamento</Button>
        </PageActions>
      </PageHeader>
      <PageContent>
        <h1>Agendamentos</h1>
      </PageContent>
    </PageContainer>
  );
};

export default AppointmentPage;
