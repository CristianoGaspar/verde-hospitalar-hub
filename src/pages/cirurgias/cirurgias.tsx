import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Plus,
  Filter,
  Edit,
  Trash2,
  Activity,
  DollarSign,
  Clock,
  User,
  Download
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BackButton } from "@/components/ui/BackButton"

interface Surgery {
  id: string
  patientName: string
  patientId: string
  procedure: string
  surgeon: string
  date: string
  time: string
  complexity: "Baixa" | "Média" | "Alta"
  baseValue: number
  complexityMultiplier: number
  finalValue: number
  status: "Agendada" | "Em Andamento" | "Concluída" | "Cancelada"
  room: string
  duration: string
  notes?: string
}

const Cirurgias = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const surgeries: Surgery[] = [
    {
      id: "CIR001",
      patientName: "João Silva",
      patientId: "PAC001",
      procedure: "Apendicectomia",
      surgeon: "Dr. Maria Santos",
      date: "2024-01-15",
      time: "08:00",
      complexity: "Baixa",
      baseValue: 3000,
      complexityMultiplier: 1.0,
      finalValue: 3000,
      status: "Concluída",
      room: "Centro Cirúrgico 1",
      duration: "60 min"
    },
    {
      id: "CIR002",
      patientName: "Ana Costa",
      patientId: "PAC002",
      procedure: "Colecistectomia Laparoscópica",
      surgeon: "Dr. Carlos Lima",
      date: "2024-01-16",
      time: "10:30",
      complexity: "Média",
      baseValue: 4500,
      complexityMultiplier: 1.3,
      finalValue: 5850,
      status: "Agendada",
      room: "Centro Cirúrgico 2",
      duration: "90 min"
    },
    {
      id: "CIR003",
      patientName: "Pedro Oliveira",
      patientId: "PAC003",
      procedure: "Hernioplastia Inguinal",
      surgeon: "Dr. Maria Santos",
      date: "2024-01-17",
      time: "14:00",
      complexity: "Baixa",
      baseValue: 3500,
      complexityMultiplier: 1.0,
      finalValue: 3500,
      status: "Em Andamento",
      room: "Centro Cirúrgico 1",
      duration: "75 min"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Agendada":
        return "bg-blue-100 text-blue-800"
      case "Em Andamento":
        return "bg-yellow-100 text-yellow-800"
      case "Concluída":
        return "bg-green-100 text-green-800"
      case "Cancelada":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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

  const filteredSurgeries = surgeries.filter(surgery => {
    const matchesSearch = 
      surgery.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surgery.procedure.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surgery.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || surgery.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cirurgias</h1>
          <p className="text-muted-foreground">
            Gerenciar agendamentos e procedimentos cirúrgicos
          </p>
        </div>
        <div className="flex gap-2">
          <BackButton />
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Cirurgia
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Agendar Nova Cirurgia</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patient">Paciente</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PAC001">João Silva</SelectItem>
                      <SelectItem value="PAC002">Ana Costa</SelectItem>
                      <SelectItem value="PAC003">Pedro Oliveira</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="procedure">Procedimento</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar procedimento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PROC001">Apendicectomia</SelectItem>
                      <SelectItem value="PROC002">Colecistectomia</SelectItem>
                      <SelectItem value="PROC003">Hernioplastia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surgeon">Cirurgião</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar cirurgião" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dr1">Dr. Maria Santos</SelectItem>
                      <SelectItem value="dr2">Dr. Carlos Lima</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="room">Sala</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar sala" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cc1">Centro Cirúrgico 1</SelectItem>
                      <SelectItem value="cc2">Centro Cirúrgico 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Horário</Label>
                  <Input id="time" type="time" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Observações adicionais sobre a cirurgia"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>
                  Agendar Cirurgia
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
                  placeholder="Buscar por paciente, procedimento ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="Agendada">Agendada</SelectItem>
                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                <SelectItem value="Concluída">Concluída</SelectItem>
                <SelectItem value="Cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Surgeries List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSurgeries.map((surgery) => (
          <Card key={surgery.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{surgery.procedure}</CardTitle>
                  <p className="text-muted-foreground">
                    {surgery.id} • {surgery.patientName}
                  </p>
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
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Cirurgião:</span>
                  </div>
                  <p className="text-sm">{surgery.surgeon}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Data/Hora:</span>
                  </div>
                  <p className="text-sm">
                    {new Date(surgery.date).toLocaleDateString('pt-BR')} às {surgery.time}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium">Sala:</span>
                  <p className="text-sm text-muted-foreground">{surgery.room}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Duração:</span>
                  <p className="text-sm text-muted-foreground">{surgery.duration}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-semibold">
                    R$ {surgery.finalValue.toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Badge className={getComplexityColor(surgery.complexity)}>
                    {surgery.complexity}
                  </Badge>
                  <Badge className={getStatusColor(surgery.status)}>
                    {surgery.status}
                  </Badge>
                </div>
              </div>

              {surgery.notes && (
                <div className="pt-2 border-t">
                  <span className="text-sm font-medium">Observações:</span>
                  <p className="text-sm text-muted-foreground mt-1">{surgery.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSurgeries.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma cirurgia encontrada</h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros ou agendar uma nova cirurgia.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Cirurgias