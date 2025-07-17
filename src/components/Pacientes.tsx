
import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, User, Phone, Calendar, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Paciente {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  dataNascimento: string;
  convenio: string;
  idade: number;
  status: 'ativo' | 'internado' | 'alta';
  ultimaConsulta: string;
}

export default function Pacientes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pacientes] = useState<Paciente[]>([
    {
      id: 1,
      nome: "Maria da Silva",
      cpf: "123.456.789-00",
      telefone: "(11) 99999-1111",
      email: "maria.silva@email.com",
      dataNascimento: "15/03/1980",
      convenio: "Unimed",
      idade: 44,
      status: "ativo",
      ultimaConsulta: "10/12/2024"
    },
    {
      id: 2,
      nome: "João Santos",
      cpf: "987.654.321-00",
      telefone: "(11) 88888-2222",
      email: "joao.santos@email.com",
      dataNascimento: "22/07/1975",
      convenio: "Bradesco Saúde",
      idade: 49,
      status: "internado",
      ultimaConsulta: "15/12/2024"
    },
    {
      id: 3,
      nome: "Ana Costa",
      cpf: "456.789.123-00",
      telefone: "(11) 77777-3333",
      email: "ana.costa@email.com",
      dataNascimento: "08/11/1992",
      convenio: "SulAmérica",
      idade: 32,
      status: "alta",
      ultimaConsulta: "05/12/2024"
    },
    {
      id: 4,
      nome: "Pedro Oliveira",
      cpf: "321.654.987-00",
      telefone: "(11) 66666-4444",
      email: "pedro.oliveira@email.com",
      dataNascimento: "30/01/1988",
      convenio: "Particular",
      idade: 36,
      status: "ativo",
      ultimaConsulta: "12/12/2024"
    }
  ]);

  const filteredPacientes = pacientes.filter(paciente =>
    paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.cpf.includes(searchTerm) ||
    paciente.convenio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'internado': return 'bg-hospital-secondary text-hospital-dark';
      case 'alta': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-hospital-dark">Pacientes</h1>
          <p className="text-gray-600">Gerencie o cadastro de pacientes</p>
        </div>
        <Button className="bg-hospital-primary hover:bg-hospital-dark">
          <Plus className="h-4 w-4 mr-2" />
          Novo Paciente
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-hospital-dark">{pacientes.length}</p>
              </div>
              <User className="h-8 w-8 text-hospital-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ativos</p>
                <p className="text-2xl font-bold text-green-600">
                  {pacientes.filter(p => p.status === 'ativo').length}
                </p>
              </div>
              <Heart className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Internados</p>
                <p className="text-2xl font-bold text-hospital-primary">
                  {pacientes.filter(p => p.status === 'internado').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-hospital-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alta</p>
                <p className="text-2xl font-bold text-gray-600">
                  {pacientes.filter(p => p.status === 'alta').length}
                </p>
              </div>
              <User className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome, CPF ou convênio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Todos</Button>
              <Button variant="outline">Ativos</Button>
              <Button variant="outline">Internados</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Pacientes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-hospital-secondary">
                  <th className="text-left py-3 px-4 font-medium text-hospital-dark">Paciente</th>
                  <th className="text-left py-3 px-4 font-medium text-hospital-dark">CPF</th>
                  <th className="text-left py-3 px-4 font-medium text-hospital-dark">Idade</th>
                  <th className="text-left py-3 px-4 font-medium text-hospital-dark">Convênio</th>
                  <th className="text-left py-3 px-4 font-medium text-hospital-dark">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-hospital-dark">Última Consulta</th>
                  <th className="text-left py-3 px-4 font-medium text-hospital-dark">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredPacientes.map((paciente) => (
                  <tr key={paciente.id} className="border-b border-gray-100 hover:bg-hospital-light">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-hospital-dark">{paciente.nome}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                          <Phone className="h-3 w-3" />
                          <span>{paciente.telefone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{paciente.cpf}</td>
                    <td className="py-3 px-4 text-sm">{paciente.idade} anos</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{paciente.convenio}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(paciente.status)}>
                        {paciente.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">{paciente.ultimaConsulta}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {filteredPacientes.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum paciente encontrado</h3>
            <p className="text-gray-600">Tente ajustar os filtros ou adicione um novo paciente.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
