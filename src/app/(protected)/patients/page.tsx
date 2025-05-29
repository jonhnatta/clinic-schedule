import { Button } from "@/components/ui/button";
import { PageContainer, PageHeader, PageHeaderContent, PageTitle, PageDescription, PageActions, PageContent } from "@/components/ui/page-container";
import { Plus } from "lucide-react";

const PatientPage = () => {
  return (
        <PageContainer>
          <PageHeader>
            <PageHeaderContent>
              <PageTitle>Pacientes</PageTitle>
              <PageDescription>
                Aqui você pode gerenciar os pacientes do sistema, incluindo a criação,
                edição e exclusão de registros.
              </PageDescription>
            </PageHeaderContent>
            <PageActions>
              <Plus />
              <Button>Adicionar Paciente</Button>
            </PageActions>
          </PageHeader>
          <PageContent>
            <h1>Pacientes</h1>
          </PageContent>
        </PageContainer>
  );
};

export default PatientPage;
