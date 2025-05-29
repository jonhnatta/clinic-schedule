import { Button } from "@/components/ui/button";
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { Plus } from "lucide-react";

const DoctorPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Médicos</PageTitle>
          <PageDescription>
            Aqui você pode gerenciar os médicos do sistema, incluindo a criação,
            edição e exclusão de registros.
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <Plus />
          <Button>Adicionar Médico</Button>
        </PageActions>
      </PageHeader>
      <PageContent>
        <h1>Médicos</h1>
      </PageContent>
    </PageContainer>
  );
};

export default DoctorPage;
