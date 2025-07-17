
import React from 'react';
import { 
  Activity, 
  Users, 
  Calendar, 
  Clock, 
  Bed, 
  AlertCircle,
  TrendingUp,
  UserCheck,
  FileText,
  Stethoscope
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color: 'primary' | 'secondary' | 'warning' | 'success';
}

function DashboardCard({ title, value, icon, trend, color }: DashboardCardProps) {
  const colorClasses = {
    primary: 'bg-hospital-primary text-white',
    secondary: 'bg-hospital-accent text-white', 
    warning: 'bg-orange-500 text-white',
    success: 'bg-green-500 text-white'
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 animate-fade-in">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-hospital-dark">{value}</p>
            {trend && (
              <div className="flex items-center mt-2">
                <TrendingUp className={`h-4 w-4 mr-1 ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`} />
                <span className={`text-sm ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {trend.value}
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface MedicoPlantao {
  nome: string;
  especialidade: string;
  crm: string;
  status: 'ativo' | 'pausa';
}

interface Cirurgia {
  paciente: string;
  cirurgiao: string;
  horario: string;
  sala: string;
  tipo: string;
}

export default function Dashboard() {
  const medicosPlantao: MedicoPlantao[] = [
    { nome: "Dr. João Silva", especialidade: "Cardiologia", crm: "12345", status: "ativo" },
    { nome: "Dra. Maria Santos", especialidade: "Neurologia", crm: "54321", status: "ativo" },
    { nome: "Dr. Pedro Lima", especialidade: "Ortopedia", crm: "67890", status: "pausa" },
    { nome: "Dra. Ana Costa", especialidade: "Pediatria", crm: "09876", status: "ativo" },
    { nome: "Dr. Carlos Mendes", especialidade: "Cirurgia Geral", crm: "11111", status: "ativo" },
    { nome: "Dra. Lúcia Ferreira", especialidade: "Ginecologia", crm: "22222", status: "ativo" },
  ];

  const cirurgiasAgendadas: Cirurgia[] = [
    { paciente: "José António", cirurgiao: "Dr. Carlos Mendes", horario: "14:00", sala: "Sala 1", tipo: "Apendicectomia" },
    { paciente: "Maria Oliveira", cirurgiao: "Dr. Pedro Lima", horario: "16:30", sala: "Sala 2", tipo: "Artroscopia" },
    { paciente: "António Silva", cirurgiao: "Dra. Lúcia Ferreira", horario: "09:00", sala: "Sala 3", tipo: "Cesárea" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-hospital-dark mb-2">Dashboard - Resumo do Dia</h1>
        <p className="text-gray-600">Visão geral das operações hospitalares de hoje</p>
      </div>

      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Consultas Hoje"
          value="45"
          icon={<Stethoscope className="h-6 w-6" />}
          trend={{ value: "+12%", isPositive: true }}
          color="primary"
        />
        <DashboardCard
          title="Plantonistas"
          value="6"
          icon={<UserCheck className="h-6 w-6" />}
          color="secondary"
        />
        <DashboardCard
          title="Leitos Disponíveis"
          value="12"
          icon={<Bed className="h-6 w-6" />}
          trend={{ value: "-3", isPositive: false }}
          color="success"
        />
        <DashboardCard
          title="Exames Pendentes"
          value="8"
          icon={<FileText className="h-6 w-6" />}
          color="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Médicos de Plantão */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-hospital-primary" />
              <span>Médicos de Plantão</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {medicosPlantao.map((medico, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-hospital-light rounded-lg hover:bg-hospital-secondary transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-hospital-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {medico.nome.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-hospital-dark">{medico.nome}</p>
                      <p className="text-sm text-gray-600">{medico.especialidade} - CRM: {medico.crm}</p>
                    </div>
                  </div>
                  <Badge variant={medico.status === 'ativo' ? 'default' : 'secondary'}>
                    {medico.status === 'ativo' ? 'Ativo' : 'Pausa'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas Rápidas */}
        <div className="space-y-6">
          {/* Leitos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bed className="h-5 w-5 text-hospital-primary" />
                <span>Ocupação de Leitos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Ocupados</span>
                  <span className="font-bold text-hospital-dark">88</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-hospital-primary h-2 rounded-full" style={{width: '88%'}}></div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Disponíveis</p>
                    <p className="font-bold text-green-600">12</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Em Espera</p>
                    <p className="font-bold text-orange-600">5</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alertas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <span>Alertas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-2 p-2 bg-orange-50 rounded">
                  <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Aprovações Pendentes</p>
                    <p className="text-xs text-gray-600">3 exames aguardando convênio</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 p-2 bg-red-50 rounded">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Salas Cirúrgicas</p>
                    <p className="text-xs text-gray-600">2 reservas pendentes</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cirurgias Agendadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-hospital-primary" />
            <span>Cirurgias Agendadas - Hoje</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-hospital-secondary">
                  <th className="text-left py-3 px-4 font-medium text-hospital-dark">Horário</th>
                  <th className="text-left py-3 px-4 font-medium text-hospital-dark">Paciente</th>
                  <th className="text-left py-3 px-4 font-medium text-hospital-dark">Cirurgião</th>
                  <th className="text-left py-3 px-4 font-medium text-hospital-dark">Procedimento</th>
                  <th className="text-left py-3 px-4 font-medium text-hospital-dark">Sala</th>
                </tr>
              </thead>
              <tbody>
                {cirurgiasAgendadas.map((cirurgia, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-hospital-light">
                    <td className="py-3 px-4 font-medium text-hospital-primary">{cirurgia.horario}</td>
                    <td className="py-3 px-4">{cirurgia.paciente}</td>
                    <td className="py-3 px-4">{cirurgia.cirurgiao}</td>
                    <td className="py-3 px-4">{cirurgia.tipo}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{cirurgia.sala}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
