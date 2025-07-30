import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/ui/back-button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import Calendar from "@/components/ui/CalendarIcon";
import Users from "@/components/ui/UsersIcon";
import HospitalLayout from "@/components/HospitalLayout";
import { HeartPulse, Activity, Edit, Trash2, Plus, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { getProcedimentos } from "@/services/procedimentos/getProcedimentos";



const Procedimentos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [procedures, setProcedures] = useState<any[]>([]);

   console.log("Procedures", procedures); // <-- Aqui

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

const fetchProcedures = async () => {
  try {
    const res = await getProcedimentos({
      page: currentPage,
      limit,
      orderBy: "nome_procedimento",
      statusFilter: "Ativo",
      tipo: filterType !== "all" ? filterType : null,
    });
    console.log("API response:", res);
    setProcedures(res); // recebe o array direto
    setTotalPages(1); // ou calcule baseado na sua lógica de paginação, se existir
  } catch (error) {
    console.error("Erro ao carregar procedimentos:", error);
  }
};


useEffect(() => {
  fetchProcedures();
}, [currentPage, filterType]);


  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Baixa":
        return "bg-green-100 text-green-800";
      case "Média":
        return "bg-yellow-100 text-yellow-800";
      case "Alta":
        return "bg-red-100 text-red-800";
      case "Complexa":
        return "bg-red-600 text-yellow-100";
      case "Moderada":
        return "bg-pink-300 text-silver-100";
      case "Eletiva":
        return "bg-blue-300 text-silver-100";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    return type === "Cirurgia" ? Activity : HeartPulse;
  };

const filteredProcedures = (procedures ?? []).filter((procedure) => {
  const matchesSearch =
    procedure.nome_procedimento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    procedure.procedimento_codigo.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesType = filterType === "all" || procedure.tipo === filterType;
  return matchesSearch && matchesType;
});

  return (
    <HospitalLayout currentPage="procedimentos" onPageChange={() => { }}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Procedimentos</h1>
            <p className="text-muted-foreground">Gerenciar procedimentos médicos e cirúrgicos</p>
          </div>
          <div className="flex gap-2">
            <BackButton />
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Novo Procedimento
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Criar Novo Procedimento</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Procedimento</Label>
                    <Input id="name" placeholder="Ex: Apendicectomia" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Código</Label>
                    <Input id="code" placeholder="Ex: 40.19" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cirurgia">Cirurgia</SelectItem>
                        <SelectItem value="Consulta">Consulta</SelectItem>
                        <SelectItem value="Exame">Exame</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Input id="category" placeholder="Ex: Cirurgia Geral" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complexity">Complexidade</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar complexidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baixa">Baixa</SelectItem>
                        <SelectItem value="Média">Média</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Tempo Estimado</Label>
                    <Input id="time" placeholder="Ex: 60 min" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea id="description" placeholder="Descrição detalhada do procedimento" rows={3} />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setIsDialogOpen(false)}>Salvar Procedimento</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros e Busca</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome ou código..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="Cirurgia">Cirurgia</SelectItem>
                  <SelectItem value="Consulta">Consulta</SelectItem>
                  <SelectItem value="Exame">Exame</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Procedures List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProcedures.map((procedure) => {
            const IconComponent = getTypeIcon(procedure.tipo);
            return (
              <Card key={procedure.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{procedure.nome_procedimento}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {procedure.procedimento_codigo} • {procedure.nome_especialidade}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{procedure.descricao}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Complexidade:</span>
                      <Badge className={getComplexityColor(procedure.complexidade)}>
                        {procedure.complexidade}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Tempo Estimado:</span>
                      <span className="text-sm">{procedure.tempo_estimado}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Status:</span>
                      <Badge variant="secondary">{procedure.status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Paginação */}
        {filteredProcedures.length > 0 && (
          <div className="flex justify-center gap-4 mt-6">
            <Button variant="outline" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>
            <span className="text-sm font-medium mt-2">
              Página {currentPage} de {totalPages}
            </span>
            <Button variant="outline" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
              Próxima
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}

        {filteredProcedures.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <HeartPulse className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum procedimento encontrado</h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros ou criar um novo procedimento.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </HospitalLayout>
  );
};

export default Procedimentos;
