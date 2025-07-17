
import React, { useState } from 'react';
import HospitalLayout from '@/components/HospitalLayout';
import Dashboard from '@/components/Dashboard';
import Medicos from '@/components/Medicos';
import Pacientes from '@/components/Pacientes';
import PlaceholderPage from '@/components/PlaceholderPage';
import { 
  Stethoscope, 
  Calendar, 
  Clock, 
  Users, 
  FileText,
  Activity
} from 'lucide-react';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'medicos':
        return <Medicos />;
      case 'pacientes':
        return <Pacientes />;
      case 'consultas':
        return (
          <PlaceholderPage
            title="Consultas"
            description="Gerencie consultas médicas"
            icon={<Stethoscope className="h-6 w-6 text-white" />}
            features={[
              "Cadastro completo de consultas",
              "Agendamento de horários",
              "Histórico do paciente",
              "Integração com convênios",
              "Receitas e prescrições",
              "Relatórios de atendimento"
            ]}
          />
        );
      case 'agendamentos':
        return (
          <PlaceholderPage
            title="Agendamentos"
            description="Sistema de agendamento hospitalar"
            icon={<Calendar className="h-6 w-6 text-white" />}
            features={[
              "Agenda médica integrada",
              "Confirmação de consultas",
              "Notificações automáticas",
              "Gestão de horários",
              "Reagendamentos",
              "Lista de espera"
            ]}
          />
        );
      case 'plantoes':
        return (
          <PlaceholderPage
            title="Plantões"
            description="Controle de escalas médicas"
            icon={<Clock className="h-6 w-6 text-white" />}
            features={[
              "Escalas de plantão",
              "Substituições automáticas",
              "Controle de horas trabalhadas",
              "Relatórios de presença",
              "Gestão de folgas",
              "Alertas de cobertura"
            ]}
          />
        );
      case 'colaboradores':
        return (
          <PlaceholderPage
            title="Colaboradores"
            description="Gestão de recursos humanos"
            icon={<Users className="h-6 w-6 text-white" />}
            features={[
              "Cadastro de funcionários",
              "Controle de setores",
              "Gestão de escalas",
              "Dados de emergência",
              "Relatórios de RH",
              "Controle de acesso"
            ]}
          />
        );
      case 'relatorios':
        return (
          <PlaceholderPage
            title="Relatórios"
            description="Relatórios e análises do sistema"
            icon={<FileText className="h-6 w-6 text-white" />}
            features={[
              "Relatórios de médicos e plantões",
              "Consultas e agendamentos",
              "Controle de convênios",
              "Estoque de medicamentos",
              "Materiais hospitalares",
              "Exportação PDF e Excel"
            ]}
          />
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <HospitalLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </HospitalLayout>
  );
};

export default Index;
