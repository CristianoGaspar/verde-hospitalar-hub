import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Search, Plus, Download, FileText, Package, TrendingUp, Building, AlertTriangle } from "lucide-react";

const HospitalSuppliesView = () => {
  const [filters, setFilters] = useState({
    name: "",
    category: "",
    stock: "",
    supplier: ""
  });

  // Mock data
  const supplies = [
    { id: 1, name: "Seringa 10ml", category: "Injetáveis", stock: 500, minStock: 100, unit: "Unidade", location: "Almoxarifado A", supplier: "MedSupplies", critical: false },
    { id: 2, name: "Luva Cirúrgica", category: "EPI", stock: 50, minStock: 200, unit: "Caixa", location: "Almoxarifado B", supplier: "SafeMed", critical: true },
    { id: 3, name: "Gaze Estéril", category: "Curativo", stock: 300, minStock: 150, unit: "Pacote", location: "Almoxarifado A", supplier: "HealCare", critical: false },
  ];

  const dashboardData = {
    belowMinimum: 8,
    highUsage: 15,
    topSector: "UTI (45%)",
    alerts: 5
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Consultar Material Hospitalar</h1>
            <p className="text-muted-foreground">Gerencie e visualize materiais hospitalares</p>
          </div>
          <Link to="/hospital-supplies/register">
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
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Abaixo do Mínimo</p>
                  <p className="text-2xl font-bold text-red-600">{dashboardData.belowMinimum}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Uso Alto (Mês)</p>
                  <p className="text-2xl font-bold text-orange-600">{dashboardData.highUsage}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Building className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Setor Destaque</p>
                  <p className="text-sm font-bold text-primary">{dashboardData.topSector}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Package className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Alertas Insumos</p>
                  <p className="text-2xl font-bold text-yellow-600">{dashboardData.alerts}</p>
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
                placeholder="Nome do material..."
                value={filters.name}
                onChange={(e) => setFilters({...filters, name: e.target.value})}
              />
              <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="injetaveis">Injetáveis</SelectItem>
                  <SelectItem value="epi">EPI</SelectItem>
                  <SelectItem value="curativo">Curativo</SelectItem>
                  <SelectItem value="descartaveis">Descartáveis</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Estoque atual..."
                value={filters.stock}
                onChange={(e) => setFilters({...filters, stock: e.target.value})}
              />
              <Select value={filters.supplier} onValueChange={(value) => setFilters({...filters, supplier: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medsupplies">MedSupplies</SelectItem>
                  <SelectItem value="safemed">SafeMed</SelectItem>
                  <SelectItem value="healcare">HealCare</SelectItem>
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
            <CardTitle>Materiais Hospitalares</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Mín. Estoque</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {supplies.map((supply) => (
                  <TableRow key={supply.id}>
                    <TableCell className="font-medium">{supply.name}</TableCell>
                    <TableCell>{supply.category}</TableCell>
                    <TableCell>{supply.stock}</TableCell>
                    <TableCell>{supply.minStock}</TableCell>
                    <TableCell>{supply.unit}</TableCell>
                    <TableCell>{supply.location}</TableCell>
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

export default HospitalSuppliesView;