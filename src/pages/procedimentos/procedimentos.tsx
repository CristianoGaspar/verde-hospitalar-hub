import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Package, Trash2, Edit, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const Procedimentos = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const procedures = [
    {
      id: "PROC001",
      name: "Apendicectomia",
      type: "Cirurgia",
      category: "Cirurgia Geral",
      code: "40.19",
      description: "Remoção cirúrgica do apêndice vermiforme",
      complexity: "Baixa",
      estimatedTime: "60 min",
      status: "Ativo"
    },
    {
      id: "PROC002",
      name: "Colecistectomia Laparoscópica",
      type: "Cirurgia",
      category: "Cirurgia Geral",
      code: "51.23",
      description: "Remoção da vesícula biliar por via laparoscópica",
      complexity: "Média",
      estimatedTime: "90 min",
      status: "Ativo"
    },
    {
      id: "PROC003",
      name: "Hernioplastia Inguinal",
      type: "Cirurgia",
      category: "Cirurgia Geral",
      code: "53.05",
      description: "Correção cirúrgica de hérnia inguinal",
      complexity: "Baixa",
      estimatedTime: "75 min",
      status: "Ativo"
    },
    {
      id: "PROC004",
      name: "Consulta Cardiológica",
      type: "Consulta",
      category: "Cardiologia",
      code: "03.01.01",
      description: "Consulta médica especializada em cardiologia",
      complexity: "Baixa",
      estimatedTime: "30 min",
      status: "Ativo"
    }
  ]

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Baixa":
        return "bg-green-100 text-green-800"
      case "Média":
        return "bg-yellow-100 text-yellow-800"
      case "Alta":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    return type === "Cirurgia" ? Activity : Stethoscope
  }

  const filteredProcedures = procedures.filter(procedure => {
    const matchesSearch = procedure.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         procedure.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || procedure.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Procedimentos</h1>
          <p className="text-muted-foreground">
            Gerenciar procedimentos médicos e cirúrgicos
          </p>
        </div>
        <div className="flex gap-2">
          <BackButton />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Procedimento
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
                  <Textarea 
                    id="description" 
                    placeholder="Descrição detalhada do procedimento"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>
                  Salvar Procedimento
                </Button>
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
                <SelectValue />
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
          const IconComponent = getTypeIcon(procedure.type)
          return (
            <Card key={procedure.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{procedure.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {procedure.code} • {procedure.category}
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
                <p className="text-sm text-muted-foreground mb-4">
                  {procedure.description}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Complexidade:</span>
                    <Badge className={getComplexityColor(procedure.complexity)}>
                      {procedure.complexity}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Tempo Estimado:</span>
                    <span className="text-sm">{procedure.estimatedTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge variant="secondary">{procedure.status}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredProcedures.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum procedimento encontrado</h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros ou criar um novo procedimento.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Procedimentos