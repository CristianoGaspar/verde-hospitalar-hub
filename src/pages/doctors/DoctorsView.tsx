
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Search, Plus, Download, FileText, Users, UserCheck, UserX, Stethoscope, AlertTriangle } from "lucide-react";
import HospitalLayout from "@/components/HospitalLayout";

const DoctorsView = () => {
  const [filters, setFilters] = useState({
    name: "",
    crm: "",
    specialty: "",
    status: "",
    shift: "",
    present: ""
  });

  const doctors = [
    { id: 1, name: "Dr. Maria Silva", crm: "CRM/SP 123456", specialty: "Cardiologia", status: "Ativo", present: true, shift: "Manhã" },
    { id: 2, name: "Dr. João Santos", crm: "CRM/SP 789012", specialty: "Pediatria", status: "Ativo", present: false, shift: "Tarde" },
    { id: 3, name: "Dr. Ana Costa", crm: "CRM/SP 345678", specialty: "Neurologia", status: "Inativo", present: false, shift: "Noite" },
  ];

  const dashboardData = {
    affiliated: 45,
    onDuty: 12,
    absent: 3,
    inSurgery: 5,
    pendingSurgeries: 2
  };

  return (
    <HospitalLayout currentPage="medicos" onPageChange={() => {}}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-hospital-dark">Consultar Médicos</h1>
            <p className="text-muted-foreground">Gerencie e visualize informações dos médicos</p>
          </div>
          <Link to="/doctors/register">
            <Button className="bg-hospital-primary hover:bg-hospital-dark">
              <Plus className="h-4 w-4 mr-2" />
              Novo Médico
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card><CardContent className="p-4"><div className="flex items-center space-x-2"><Users className="h-8 w-8 text-hospital-primary" /><div><p className="text-sm text-muted-foreground">Médicos Conveniados</p><p className="text-2xl font-bold text-hospital-primary">{dashboardData.affiliated}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center space-x-2"><UserCheck className="h-8 w-8 text-green-600" /><div><p className="text-sm text-muted-foreground">De Plantão Ativos</p><p className="text-2xl font-bold text-green-600">{dashboardData.onDuty}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center space-x-2"><UserX className="h-8 w-8 text-yellow-600" /><div><p className="text-sm text-muted-foreground">Ausentes</p><p className="text-2xl font-bold text-yellow-600">{dashboardData.absent}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center space-x-2"><Stethoscope className="h-8 w-8 text-blue-600" /><div><p className="text-sm text-muted-foreground">Em Cirurgia</p><p className="text-2xl font-bold text-blue-600">{dashboardData.inSurgery}</p></div></div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="flex items-center space-x-2"><AlertTriangle className="h-8 w-8 text-red-600" /><div><p className="text-sm text-muted-foreground">Cirurgias Pendentes</p><p className="text-2xl font-bold text-red-600">{dashboardData.pendingSurgeries}</p></div></div></CardContent></Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filtros de Pesquisa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Input placeholder="Nome do médico..." value={filters.name} onChange={(e) => setFilters({...filters, name: e.target.value})} />
              <Input placeholder="CRM..." value={filters.crm} onChange={(e) => setFilters({...filters, crm: e.target.value})} />
              <Select value={filters.specialty} onValueChange={(value) => setFilters({...filters, specialty: value})}>
                <SelectTrigger><SelectValue placeholder="Especialidade" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cardiologia">Cardiologia</SelectItem>
                  <SelectItem value="pediatria">Pediatria</SelectItem>
                  <SelectItem value="neurologia">Neurologia</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.shift} onValueChange={(value) => setFilters({...filters, shift: value})}>
                <SelectTrigger><SelectValue placeholder="Plantão" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="manha">Manhã</SelectItem>
                  <SelectItem value="tarde">Tarde</SelectItem>
                  <SelectItem value="noite">Noite</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.present} onValueChange={(value) => setFilters({...filters, present: value})}>
                <SelectTrigger><SelectValue placeholder="Presente" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sim">Sim</SelectItem>
                  <SelectItem value="nao">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline"><Download className="h-4 w-4 mr-2" />Exportar PDF</Button>
              <Button variant="outline"><FileText className="h-4 w-4 mr-2" />Exportar Excel</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Médicos Cadastrados</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CRM</TableHead>
                  <TableHead>Especialidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Presente</TableHead>
                  <TableHead>Plantão</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell className="font-medium">{doctor.name}</TableCell>
                    <TableCell>{doctor.crm}</TableCell>
                    <TableCell>{doctor.specialty}</TableCell>
                    <TableCell><Badge variant={doctor.status === "Ativo" ? "default" : "secondary"}>{doctor.status}</Badge></TableCell>
                    <TableCell><Badge variant={doctor.present ? "default" : "destructive"}>{doctor.present ? "Sim" : "Não"}</Badge></TableCell>
                    <TableCell>{doctor.shift}</TableCell>
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

export default DoctorsView;
