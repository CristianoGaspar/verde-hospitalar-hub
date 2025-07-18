import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft,  BellRing, CalendarClock, Download, FileText, Plus, RotateCcw, Search, Table, UserPlus, Users } from "lucide-react";
import { Link } from "react-router-dom";
import HospitalLayout from "@/components/HospitalLayout";
import { Input } from "@/components/ui/input";
import { TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";


const PatientsView = () => {
  const [filters, setFilters] = useState({ name: "", cpf: "", convenio: "" });

  const patients = [
    { id: 1, name: "Carlos Silva", cpf: "123.456.789-00", convenio: "Unimed", status: "ativo", examesPendentes: true },
    { id: 2, name: "Juliana Oliveira", cpf: "987.654.321-00", convenio: "Amil", status: "ativo", examesPendentes: false },
    { id: 3, name: "Marcos Souza", cpf: "111.222.333-44", convenio: "Bradesco Saúde", status: "inativo", examesPendentes: false },
  ];

  const dashboardData = {
    examesPendentes: 6,
    examesProximos: 9,
    cancelamentos: 4,
    faturasAtrasadas: 3,
    conveniados: 52,
  };

  return (
    <HospitalLayout currentPage="pacientes" onPageChange={() => {}}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-hospital-dark">Consultar Pacientes</h1>
            <p className="text-muted-foreground">Gerencie e visualize informações dos pacientes</p>
          </div>
          <Link to="/patients/register">
            <Button className="bg-hospital-primary hover:bg-hospital-dark">
              <Plus className="h-4 w-4 mr-2" />
              Novo Paciente
            </Button>
          </Link>
        </div>

        {/* Dashboard cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card><CardContent className="p-4"><div className="flex items-center space-x-2"><BellRing className="h-8 w-8 text-yellow-500" /><div><p className="text-sm text-muted-foreground">Exames a Buscar</p><p className="text-2xl font-bold text-yellow-500">{dashboardData.examesPendentes}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center space-x-2"><CalendarClock className="h-8 w-8 text-blue-600" /><div><p className="text-sm text-muted-foreground">Exames em 3 dias</p><p className="text-2xl font-bold text-blue-600">{dashboardData.examesProximos}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center space-x-2"><RotateCcw className="h-8 w-8 text-orange-600" /><div><p className="text-sm text-muted-foreground">Consultas Canceladas</p><p className="text-2xl font-bold text-orange-600">{dashboardData.cancelamentos}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center space-x-2"><AlertCircle className="h-8 w-8 text-red-600" /><div><p className="text-sm text-muted-foreground">Faturas Atrasadas</p><p className="text-2xl font-bold text-red-600">{dashboardData.faturasAtrasadas}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center space-x-2"><Users className="h-8 w-8 text-green-600" /><div><p className="text-sm text-muted-foreground">Pacientes Conveniados</p><p className="text-2xl font-bold text-green-600">{dashboardData.conveniados}</p></div></div></CardContent></Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filtros de Pesquisa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input placeholder="Nome do paciente..." value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
              <Input placeholder="CPF..." value={filters.cpf} onChange={(e) => setFilters({ ...filters, cpf: e.target.value })} />
              <Input placeholder="Convênio..." value={filters.convenio} onChange={(e) => setFilters({ ...filters, convenio: e.target.value })} />
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline"><Download className="h-4 w-4 mr-2" />Exportar PDF</Button>
              <Button variant="outline"><FileText className="h-4 w-4 mr-2" />Exportar Excel</Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de pacientes */}
        <Card>
          <CardHeader>
            <CardTitle>Pacientes Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Convênio</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Exames Pendentes</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.cpf}</TableCell>
                    <TableCell>{p.convenio}</TableCell>
                    <TableCell><Badge variant={p.status === "ativo" ? "default" : "secondary"}>{p.status === "ativo" ? "Ativo" : "Inativo"}</Badge></TableCell>
                    <TableCell><Badge variant={p.examesPendentes ? "destructive" : "default"}>{p.examesPendentes ? "Sim" : "Não"}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Ver</Button>
                        <Button variant="outline" size="sm">Editar</Button>
                        <Button variant="destructive" size="sm">Excluir</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </HospitalLayout>
  );
};

export default PatientsView;