import React, { useState } from 'react';
import HospitalLayout from '@/components/HospitalLayout';
import Dashboard from '@/components/Dashboard';
import Medicos from '@/components/Medicos';
import Pacientes from '@/components/Pacientes';
import PlaceholderPage from '@/components/PlaceholderPage';
import Faturas from '@/pages/faturas/faturas';
import Encaminhamentos from '@/pages/encaminhamentos/encaminhamentos';
import Cirurgias from '@/pages/cirurgias/cirurgias';
import Procedimentos from '@/pages/procedimentos/procedimentos';

import {
  Stethoscope,
  Calendar,
  Clock,
  Users,
  FileText,
  Activity,
  FolderOpen,
  DollarSign
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
      case 'faturas':
        return <Faturas />;
      case 'encaminhamentos':
        return <Encaminhamentos />;
      case 'cirurgias':
        return <Cirurgias />;
      case 'procedimentos':
        return <Procedimentos />;
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

      // Novas opções do hospital-dashboard-fusion
      case 'encaminhamentos1':
        return (
          <PlaceholderPage
            title="Encaminhamentos 1"
            description="Gerencie os encaminhamentos médicos"
            icon={<FolderOpen className="h-6 w-6 text-white" />}
            features={[
              "Cadastro de encaminhamentos",
              "Filtro por especialidade",
              "Encaminhamento automático",
              "Histórico por paciente",
              "Vinculação com convênios"
            ]}
          />
        );
      case 'encaminhamentos2':
        return (
          <PlaceholderPage
            title="Encaminhamentos 2"
            description="Controle avançado de encaminhamentos"
            icon={<FolderOpen className="h-6 w-6 text-white" />}
            features={[
              "Listagem detalhada",
              "Acompanhamento de status",
              "Notificações de retorno",
              "Reencaminhamentos",
              "Exportações personalizadas"
            ]}
          />
        );
      case 'faturamentoA':
        return (
          <PlaceholderPage
            title="Faturamento A"
            description="Faturamento por convênios"
            icon={<DollarSign className="h-6 w-6 text-white" />}
            features={[
              "Conferência de valores",
              "Emissão de faturas",
              "Exportação para TISS",
              "Histórico financeiro",
              "Alertas de pendências"
            ]}
          />
        );
      case 'faturamentoB':
        return (
          <PlaceholderPage
            title="Faturamento B"
            description="Gestão financeira hospitalar"
            icon={<DollarSign className="h-6 w-6 text-white" />}
            features={[
              "Relatórios de receita",
              "Despesas por setor",
              "Rateios financeiros",
              "Gestão de cobranças",
              "Conciliação bancária"
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
