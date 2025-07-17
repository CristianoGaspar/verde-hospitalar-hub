import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { Search, Plus, Download, FileText, Pill, Calendar, AlertTriangle, TrendingDown } from "lucide-react";

const MedicationsView = () => {
  const [filters, setFilters] = useState({
    name: "",
    type: "",
    expiry: "",
    criticalStock: false
  });

  // Mock data
  const medications = [
    { id: 1, name: "Paracetamol", type: "Comprimido", stock: 150, expiry: "2024-06-15", location: "Farmácia A", critical: false },
    { id: 2, name: "Dipirona", type: "Injetável", stock: 25, expiry: "2024-02-20", location: "Farmácia B", critical: true },
    { id: 3, name: "Amoxicilina", type: "Cápsula", stock: 200, expiry: "2024-12-30", location: "Farmácia A", critical: false },
  ];

  const dashboardData = {
    expiring30Days: 8,
    criticalStock: 5,
    excess: 12,
    excessiveUsage: 3
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Consultar Medicamentos</h1>
            <p className="text-muted-foreground">Gerencie e visualize estoque de medicamentos</p>
          </div>
          <Link to="/medications/register">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Novo Medicamento
            </Button>
          </Link>
        </div>

        {/* Mini Dashboards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Vencendo 30 dias</p>
                  <p className="text-2xl font-bold text-orange-600">{dashboardData.expiring30Days}</p>
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
                <TrendingDown className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Itens em Excesso</p>
                  <p className="text-2xl font-bold text-blue-600">{dashboardData.excess}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Pill className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Uso Excessivo</p>
                  <p className="text-2xl font-bold text-purple-600">{dashboardData.excessiveUsage}</p>
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
                placeholder="Nome do medicamento..."
                value={filters.name}
                onChange={(e) => setFilters({...filters, name: e.target.value})}
              />
              <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comprimido">Comprimido</SelectItem>
                  <SelectItem value="injetavel">Injetável</SelectItem>
                  <SelectItem value="capsula">Cápsula</SelectItem>
                  <SelectItem value="xarope">Xarope</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                placeholder="Validade antes de..."
                value={filters.expiry}
                onChange={(e) => setFilters({...filters, expiry: e.target.value})}
              />
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="criticalStock"
                  checked={filters.criticalStock}
                  onCheckedChange={(checked) => setFilters({...filters, criticalStock: checked as boolean})}
                />
                <label htmlFor="criticalStock" className="text-sm">Estoque abaixo do mínimo</label>
              </div>
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
            <CardTitle>Medicamentos Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medications.map((medication) => (
                  <TableRow key={medication.id}>
                    <TableCell className="font-medium">{medication.name}</TableCell>
                    <TableCell>{medication.type}</TableCell>
                    <TableCell>{medication.stock}</TableCell>
                    <TableCell>{medication.expiry}</TableCell>
                    <TableCell>{medication.location}</TableCell>
                    <TableCell>
                      <Badge variant={medication.critical ? "destructive" : "default"}>
                        {medication.critical ? "Crítico" : "Normal"}
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

export default MedicationsView;