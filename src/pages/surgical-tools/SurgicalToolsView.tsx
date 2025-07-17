import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Search, Plus, Download, FileText, Wrench, Star, Settings, AlertTriangle } from "lucide-react";

const SurgicalToolsView = () => {
  const [filters, setFilters] = useState({
    name: "",
    status: "",
    room: "",
    lastMaintenance: ""
  });

  // Mock data
  const surgicalTools = [
    { id: 1, name: "Bisturi Elétrico", purpose: "Corte e coagulação", status: "Disponível", room: "CC1", quantity: 3, patrimony: "BIS001", lastMaintenance: "2024-01-10" },
    { id: 2, name: "Fórceps Kelly", purpose: "Hemostasia", status: "Esterilizando", room: "CC2", quantity: 5, patrimony: "FOR002", lastMaintenance: "2023-12-15" },
    { id: 3, name: "Pinça Anatômica", purpose: "Manipulação tecidos", status: "Danificada", room: "CC1", quantity: 2, patrimony: "PIN003", lastMaintenance: "2023-11-20" },
  ];

  const dashboardData = {
    mostUsed: "Bisturi Elétrico (120x)",
    inMaintenance: 8,
    pendingSterilization: 15,
    unregisteredUse: 3
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Consultar Ferramentas Cirúrgicas</h1>
            <p className="text-muted-foreground">Gerencie e visualize ferramentas cirúrgicas</p>
          </div>
          <Link to="/surgical-tools/register">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Nova Ferramenta
            </Button>
          </Link>
        </div>

        {/* Mini Dashboards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Mais Usada</p>
                  <p className="text-sm font-bold text-primary">{dashboardData.mostUsed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

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
                <Wrench className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Esterilizando</p>
                  <p className="text-2xl font-bold text-blue-600">{dashboardData.pendingSterilization}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Uso Não Registrado</p>
                  <p className="text-2xl font-bold text-red-600">{dashboardData.unregisteredUse}</p>
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
                placeholder="Nome da ferramenta..."
                value={filters.name}
                onChange={(e) => setFilters({...filters, name: e.target.value})}
              />
              <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponivel">Disponível</SelectItem>
                  <SelectItem value="esterilizando">Esterilizando</SelectItem>
                  <SelectItem value="manutencao">Manutenção</SelectItem>
                  <SelectItem value="danificada">Danificada</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.room} onValueChange={(value) => setFilters({...filters, room: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sala" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cc1">CC1</SelectItem>
                  <SelectItem value="cc2">CC2</SelectItem>
                  <SelectItem value="cc3">CC3</SelectItem>
                  <SelectItem value="cme">CME</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                placeholder="Última manutenção..."
                value={filters.lastMaintenance}
                onChange={(e) => setFilters({...filters, lastMaintenance: e.target.value})}
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
            <CardTitle>Ferramentas Cirúrgicas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Finalidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sala</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Patrimônio</TableHead>
                  <TableHead>Última Manutenção</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {surgicalTools.map((tool) => (
                  <TableRow key={tool.id}>
                    <TableCell className="font-medium">{tool.name}</TableCell>
                    <TableCell>{tool.purpose}</TableCell>
                    <TableCell>
                      <Badge variant={
                        tool.status === "Disponível" ? "default" :
                        tool.status === "Esterilizando" ? "secondary" :
                        tool.status === "Danificada" ? "destructive" : "outline"
                      }>
                        {tool.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{tool.room}</TableCell>
                    <TableCell>{tool.quantity}</TableCell>
                    <TableCell>{tool.patrimony}</TableCell>
                    <TableCell>{tool.lastMaintenance}</TableCell>
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

export default SurgicalToolsView;