import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Search, Plus, Download, FileText, MonitorSpeaker, Settings, CheckCircle, AlertTriangle } from "lucide-react";

const SurgicalEquipmentView = () => {
  const [filters, setFilters] = useState({
    name: "",
    patrimony: "",
    location: "",
    status: ""
  });

  // Mock data
  const surgicalEquipment = [
    { id: 1, name: "Ventilador Pulmonar", patrimony: "VEN001", location: "UTI 1", status: "Operacional", calibration: "2024-02-15", responsible: "João Silva" },
    { id: 2, name: "Monitor Cardíaco", patrimony: "MON002", location: "CC1", status: "Em manutenção", calibration: "2023-12-20", responsible: "Maria Santos" },
    { id: 3, name: "Desfibrilador", patrimony: "DES003", location: "Emergência", status: "Reservado", calibration: "2024-01-10", responsible: "Pedro Costa" },
  ];

  const dashboardData = {
    inMaintenance: 5,
    availability: "CC1: 85%",
    continuousUse: 8,
    expiredCalibration: 3
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Consultar Equipamentos Cirúrgicos</h1>
            <p className="text-muted-foreground">Gerencie e visualize equipamentos cirúrgicos</p>
          </div>
          <Link to="/surgical-equipment/register">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Novo Equipamento
            </Button>
          </Link>
        </div>

        {/* Mini Dashboards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Settings className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Em Manutenção</p>
                  <p className="text-2xl font-bold text-orange-600">{dashboardData.inMaintenance}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Disponibilidade</p>
                  <p className="text-sm font-bold text-green-600">{dashboardData.availability}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MonitorSpeaker className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Uso Contínuo</p>
                  <p className="text-2xl font-bold text-blue-600">{dashboardData.continuousUse}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Calibração Vencida</p>
                  <p className="text-2xl font-bold text-red-600">{dashboardData.expiredCalibration}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filtros de Pesquisa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                placeholder="Nome do equipamento..."
                value={filters.name}
                onChange={(e) => setFilters({...filters, name: e.target.value})}
              />
              <Input
                placeholder="Código patrimonial..."
                value={filters.patrimony}
                onChange={(e) => setFilters({...filters, patrimony: e.target.value})}
              />
              <Select value={filters.location} onValueChange={(value) => setFilters({...filters, location: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Localização" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uti1">UTI 1</SelectItem>
                  <SelectItem value="uti2">UTI 2</SelectItem>
                  <SelectItem value="cc1">CC1</SelectItem>
                  <SelectItem value="cc2">CC2</SelectItem>
                  <SelectItem value="emergencia">Emergência</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operacional">Operacional</SelectItem>
                  <SelectItem value="manutencao">Em manutenção</SelectItem>
                  <SelectItem value="reservado">Reservado</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Exportar Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle>Equipamentos Cirúrgicos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Patrimônio</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Última Calibração</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {surgicalEquipment.map((equipment) => (
                  <TableRow key={equipment.id}>
                    <TableCell className="font-medium">{equipment.name}</TableCell>
                    <TableCell>{equipment.patrimony}</TableCell>
                    <TableCell>{equipment.location}</TableCell>
                    <TableCell>
                      <Badge variant={
                        equipment.status === "Operacional" ? "default" :
                        equipment.status === "Em manutenção" ? "destructive" :
                        equipment.status === "Reservado" ? "secondary" : "outline"
                      }>
                        {equipment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{equipment.calibration}</TableCell>
                    <TableCell>{equipment.responsible}</TableCell>
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
    </div>
  );
};

export default SurgicalEquipmentView;