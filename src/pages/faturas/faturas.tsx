import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  CreditCard,
  DollarSign,
  FileText,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock
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
import { Separator } from "@/components/ui/separator"
import { BackButton } from "@/components/ui/BackButton"

interface Invoice {
  id: string
  patientName: string
  patientId: string
  surgeryId: string
  procedure: string
  surgeon: string
  surgeryDate: string
  issueDate: string
  dueDate: string
  amount: number
  status: "Pendente" | "Pago" | "Vencida" | "Cancelada"
  paymentMethod?: string
  paymentDate?: string
  notes?: string
}

const Faturas = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  const invoices: Invoice[] = [
    {
      id: "FAT001",
      patientName: "João Silva",
      patientId: "PAC001",
      surgeryId: "CIR001",
      procedure: "Apendicectomia",
      surgeon: "Dr. Maria Santos",
      surgeryDate: "2024-01-15",
      issueDate: "2024-01-15",
      dueDate: "2024-02-15",
      amount: 3000,
      status: "Pago",
      paymentMethod: "Cartão de Crédito",
      paymentDate: "2024-01-20"
    },
    {
      id: "FAT002",
      patientName: "Ana Costa",
      patientId: "PAC002",
      surgeryId: "CIR002",
      procedure: "Colecistectomia Laparoscópica",
      surgeon: "Dr. Carlos Lima",
      surgeryDate: "2024-01-16",
      issueDate: "2024-01-16",
      dueDate: "2024-02-16",
      amount: 5850,
      status: "Pendente"
    },
    {
      id: "FAT003",
      patientName: "Pedro Oliveira",
      patientId: "PAC003",
      surgeryId: "CIR003",
      procedure: "Hernioplastia Inguinal",
      surgeon: "Dr. Maria Santos",
      surgeryDate: "2024-01-17",
      issueDate: "2024-01-17",
      dueDate: "2024-01-10",
      amount: 3500,
      status: "Vencida"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pago":
        return "bg-green-100 text-green-800"
      case "Pendente":
        return "bg-yellow-100 text-yellow-800"
      case "Vencida":
        return "bg-red-100 text-red-800"
      case "Cancelada":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pago":
        return CheckCircle
      case "Pendente":
        return Clock
      case "Vencida":
        return XCircle
      case "Cancelada":
        return XCircle
      default:
        return Clock
    }
  }

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.procedure.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || invoice.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0)
  const paidAmount = filteredInvoices
    .filter(invoice => invoice.status === "Pago")
    .reduce((sum, invoice) => sum + invoice.amount, 0)
  const pendingAmount = filteredInvoices
    .filter(invoice => invoice.status === "Pendente")
    .reduce((sum, invoice) => sum + invoice.amount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Faturas</h1>
          <p className="text-muted-foreground">
            Gerenciar faturas e cobranças de procedimentos
          </p>
        </div>
        <div className="flex gap-2">
          <BackButton />
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Fatura
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Geral</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalAmount.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              {filteredInvoices.length} faturas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valores Pagos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {paidAmount.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              {filteredInvoices.filter(i => i.status === "Pago").length} faturas pagas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valores Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              R$ {pendingAmount.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              {filteredInvoices.filter(i => i.status === "Pendente").length} faturas pendentes
            </p>
          </CardContent>
        </Card>
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
                  placeholder="Buscar por paciente, ID ou procedimento..."
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
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Pago">Pago</SelectItem>
                <SelectItem value="Vencida">Vencida</SelectItem>
                <SelectItem value="Cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredInvoices.map((invoice) => {
          const StatusIcon = getStatusIcon(invoice.status)
          return (
            <Card key={invoice.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{invoice.id}</CardTitle>
                    <p className="text-muted-foreground">
                      {invoice.patientName} • {invoice.procedure}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedInvoice(invoice)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Detalhes da Fatura - {invoice.id}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Paciente</Label>
                              <p className="text-sm">{invoice.patientName}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">ID do Paciente</Label>
                              <p className="text-sm">{invoice.patientId}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Procedimento</Label>
                              <p className="text-sm">{invoice.procedure}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Cirurgião</Label>
                              <p className="text-sm">{invoice.surgeon}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Data da Cirurgia</Label>
                              <p className="text-sm">{new Date(invoice.surgeryDate).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Data de Emissão</Label>
                              <p className="text-sm">{new Date(invoice.issueDate).toLocaleDateString('pt-BR')}</p>
                            </div>
                          </div>
                          <Separator />
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Valor Total</Label>
                              <p className="text-lg font-bold">R$ {invoice.amount.toLocaleString('pt-BR')}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Data de Vencimento</Label>
                              <p className="text-sm">{new Date(invoice.dueDate).toLocaleDateString('pt-BR')}</p>
                            </div>
                          </div>
                          {invoice.paymentDate && (
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">Data do Pagamento</Label>
                                <p className="text-sm">{new Date(invoice.paymentDate).toLocaleDateString('pt-BR')}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Método de Pagamento</Label>
                                <p className="text-sm">{invoice.paymentMethod}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
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
                    <p className="text-sm">{invoice.surgeon}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Data da Cirurgia:</span>
                    </div>
                    <p className="text-sm">{new Date(invoice.surgeryDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium">Data de Emissão:</span>
                    <p className="text-sm text-muted-foreground">
                      {new Date(invoice.issueDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Vencimento:</span>
                    <p className="text-sm text-muted-foreground">
                      {new Date(invoice.dueDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-lg font-bold">
                      R$ {invoice.amount.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusIcon className="h-4 w-4" />
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </div>
                </div>

                {invoice.status === "Pendente" && (
                  <Button className="w-full">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Registrar Pagamento
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredInvoices.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma fatura encontrada</h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros ou criar uma nova fatura.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Faturas