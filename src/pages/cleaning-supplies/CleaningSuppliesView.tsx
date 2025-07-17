import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Search, Plus, Download, FileText, Droplets, Building, AlertTriangle, DollarSign } from "lucide-react";

const CleaningSuppliesView = () => {
  const [filters, setFilters] = useState({
    name: "",
    sector: "",
    frequency: "",
    stock: ""
  });

  // Mock data
  const cleaningSupplies = [
    { id: 1, name: "Álcool 70%", type: "Desinfetante", sectors: ["UTI", "CC"], stock: 80, frequency: "Diária", supplier: "CleanMed", critical: false },
    { id: 2, name: "Detergente Hospitalar", type: "Limpeza", sectors: ["Todos"], stock: 15, frequency: "Semanal", supplier: "HygieneMax", critical: true },
    { id: 3, name: "Hipoclorito", type: "Desinfetante", sectors: ["CC", "CME"], stock: 45, frequency: "Diária", supplier: "CleanMed", critical: false },
  ];

  const dashboardData = {
    multiSector: "Álcool 70% (8 setores)",
    criticalStock: 6,
    expiredAlerts: 3,
    monthlyCost: "R$ 15.240"
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Consultar Material de Limpeza</h1>
            <p className="text-muted-foreground">Gerencie e visualize materiais de limpeza</p>
          </div>
          <Link to="/cleaning-supplies/register">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Novo Material
            </Button>
          </Link>
        </div>

        {/* Mini Dashboards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Building className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Usado por + Setores</p>
                  <p className="text-sm font-bold text-primary">{dashboardData.multiSector}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Estoque Crítico</p>
                  <p className="text-2xl font-bold text-red-600">{dashboardData.criticalStock}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Droplets className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Alertas Validade</p>
                  <p className="text-2xl font-bold text-orange-600">{dashboardData.expiredAlerts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Gastos (30 dias)</p>
                  <p className="text-lg font-bold text-green-600">{dashboardData.monthlyCost}</p>
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
                placeholder="Nome do produto..."
                value={filters.name}
                onChange={(e) => setFilters({...filters, name: e.target.value})}
              />
              <Select value={filters.sector} onValueChange={(value) => setFilters({...filters, sector: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Setor de uso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uti">UTI</SelectItem>
                  <SelectItem value="cc">Centro Cirúrgico</SelectItem>
                  <SelectItem value="cme">CME</SelectItem>
                  <SelectItem value="internacao">Internação</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.frequency} onValueChange={(value) => setFilters({...filters, frequency: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Frequência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diaria">Diária</SelectItem>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="mensal">Mensal</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Estoque atual..."
                value={filters.stock}
                onChange={(e) => setFilters({...filters, stock: e.target.value})}
              />
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
            <CardTitle>Materiais de Limpeza</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Setores</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Frequência</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cleaningSupplies.map((supply) => (
                  <TableRow key={supply.id}>
                    <TableCell className="font-medium">{supply.name}</TableCell>
                    <TableCell>{supply.type}</TableCell>
                    <TableCell>{supply.sectors.join(", ")}</TableCell>
                    <TableCell>{supply.stock}</TableCell>
                    <TableCell>{supply.frequency}</TableCell>
                    <TableCell>{supply.supplier}</TableCell>
                    <TableCell>
                      <Badge variant={supply.critical ? "destructive" : "default"}>
                        {supply.critical ? "Crítico" : "Normal"}
                      </Badge>
                    </TableCell>
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

export default CleaningSuppliesView;