
import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, UserCheck, Phone, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import HospitalLayout from '@/components/HospitalLayout';

interface Medico {
  id: number;
  nome: string;
  crm: string;
  especialidade: string;
  telefone: string;
  email: string;
  plantoes: string[];
  status: 'ativo' | 'inativo';
}

export default function Medicos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [medicos] = useState<Medico[]>([
    {
      id: 1,
      nome: "Dr. João Silva",
      crm: "12345-SP",
      especialidade: "Cardiologia",
      telefone: "(11) 99999-9999",
      email: "joao.silva@hospital.com",
      plantoes: ["Segunda", "Quarta", "Sexta"],
      status: "ativo"
    },
    {
      id: 2,
      nome: "Dra. Maria Santos",
      crm: "54321-SP",
      especialidade: "Neurologia",
      telefone: "(11) 88888-8888",
      email: "maria.santos@hospital.com",
      plantoes: ["Terça", "Quinta", "Sábado"],
      status: "ativo"
    },
    {
      id: 3,
      nome: "Dr. Pedro Lima",
      crm: "67890-SP",
      especialidade: "Ortopedia",
      telefone: "(11) 77777-7777",
      email: "pedro.lima@hospital.com",
      plantoes: ["Segunda", "Sexta", "Domingo"],
      status: "inativo"
    },
    {
      id: 4,
      nome: "Dra. Ana Costa",
      crm: "09876-SP",
      especialidade: "Pediatria",
      telefone: "(11) 66666-6666",
      email: "ana.costa@hospital.com",
      plantoes: ["Terça", "Quinta", "Sábado"],
      status: "ativo"
    }
  ]);

  const filteredMedicos = medicos.filter(medico =>
    medico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medico.especialidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medico.crm.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <HospitalLayout currentPage="medicos" onPageChange={() => {}}>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-hospital-dark">Médicos</h1>
            <p className="text-gray-600">Gerencie o cadastro de médicos</p>
          </div>
          <Button className="bg-hospital-primary hover:bg-hospital-dark">
            <Plus className="h-4 w-4 mr-2" />
            Novo Médico
          </Button>
        </div>

        <Card className="bg-hospital-light">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nome, especialidade ou CRM..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Todos</Button>
                <Button variant="outline">Ativos</Button>
                <Button variant="outline">Inativos</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedicos.map((medico) => (
            <Card key={medico.id} className="hover:shadow-lg transition-shadow bg-hospital-light">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-hospital-primary rounded-full flex items-center justify-center">
                      <UserCheck className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-hospital-dark">{medico.nome}</CardTitle>
                      <p className="text-sm text-gray-600">CRM: {medico.crm}</p>
                    </div>
                  </div>
                  <Badge variant={medico.status === 'ativo' ? 'default' : 'secondary'}>
                    {medico.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-hospital-dark">Especialidade</p>
                  <p className="text-sm text-gray-600">{medico.especialidade}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <p className="text-sm text-gray-600">{medico.telefone}</p>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <p className="text-sm font-medium text-hospital-dark">Plantões</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {medico.plantoes.map((plantao, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {plantao}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMedicos.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-hospital-dark mb-2">Nenhum médico encontrado</h3>
              <p className="text-gray-600">Tente ajustar os filtros ou adicione um novo médico.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </HospitalLayout>
  );
}
