import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Search, Plus, Download, FileText, TrendingUp, XCircle, CheckCircle, AlertTriangle } from "lucide-react";

const InsuranceView = () => {
  const [filters, setFilters] = useState({
    name: "",
    cnpj: "",
    procedure: "",
    avgApproval: ""
  });

  // Mock data
  const insurances = [
    { id: 1, name: "Unimed", cnpj: "12.345.678/0001-90", procedures: 150, avgApproval: "3 dias", status: "Ativo", usage: 85 },
    { id: 2, name: "Bradesco Saúde", cnpj: "98.765.432/0001-10", procedures: 120, avgApproval: "5 dias", status: "Ativo", usage: 72 },
    { id: 3, name: "SulAmérica", cnpj: "11.222.333/0001-44", procedures: 90, avgApproval: "4 dias", status: "Inativo", usage: 45 },
  ];

  const dashboardData = {
    highUsage: "Unimed (85%)",
    rejections: "Bradesco (12%)",
    active: 8,
    inactive: 2,
    contractsExpiring: 3
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Consultar Convênios</h1>
            <p className="text-muted-foreground">Gerencie e visualize convênios médicos</p>
          </div>
          <Link to="/insurance/register">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Novo Convênio
            </Button>
          </Link>
        </div>

        {/* Mini Dashboards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Maior Uso</p>
                  <p className="text-sm font-bold text-primary">{dashboardData.highUsage}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Mais Reprovações</p>
                  <p className="text-sm font-bold text-red-600">{dashboardData.rejections}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Convênios Ativos</p>
                  <p className="text-2xl font-bold text-green-600">{dashboardData.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="h-8 w-8 text-gray-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Convênios Inativos</p>
                  <p className="text-2xl font-bold text-gray-600">{dashboardData.inactive}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Contratos Vencendo</p>
                  <p className="text-2xl font-bold text-orange-600">{dashboardData.contractsExpiring}</p>
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
                placeholder="Nome do convênio..."
                value={filters.name}
                onChange={(e) => setFilters({...filters, name: e.target.value})}
              />
              <Input
                placeholder="CNPJ..."
                value={filters.cnpj}
                onChange={(e) => setFilters({...filters, cnpj: e.target.value})}
              />
              <Input
                placeholder="Procedimento coberto..."
                value={filters.procedure}
                onChange={(e) => setFilters({...filters, procedure: e.target.value})}
              />
              <Select value={filters.avgApproval} onValueChange={(value) => setFilters({...filters, avgApproval: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Tempo de aprovação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-3">1-3 dias</SelectItem>
                  <SelectItem value="4-7">4-7 dias</SelectItem>
                  <SelectItem value="8+">8+ dias</SelectItem>
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
            <CardTitle>Convênios Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Procedimentos</TableHead>
                  <TableHead>Tempo Aprovação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Uso (%)</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {insurances.map((insurance) => (
                  <TableRow key={insurance.id}>
                    <TableCell className="font-medium">{insurance.name}</TableCell>
                    <TableCell>{insurance.cnpj}</TableCell>
                    <TableCell>{insurance.procedures}</TableCell>
                    <TableCell>{insurance.avgApproval}</TableCell>
                    <TableCell>
                      <Badge variant={insurance.status === "Ativo" ? "default" : "secondary"}>
                        {insurance.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={insurance.usage > 70 ? "default" : insurance.usage > 40 ? "secondary" : "destructive"}>
                        {insurance.usage}%
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

export default InsuranceView;