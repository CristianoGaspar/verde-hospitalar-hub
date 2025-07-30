import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {  Select,  SelectContent,  SelectItem,  SelectTrigger,  SelectValue} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/ui/back-button";
import {  Dialog,  DialogTrigger,  DialogContent,  DialogHeader,  DialogTitle} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import Calendar from "@/components/ui/CalendarIcon";
import Users from "@/components/ui/UsersIcon";
import HospitalLayout from "@/components/HospitalLayout";
import { HeartPulse, Activity, Edit, Trash2, Plus, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { getProcedimentos } from "@/services/procedimentos/getProcedimentos";
import { getDoctors } from "@/services/doctors/getDoctors";
import { getPatients } from "@/services/patients/getPatients";
import { getInsurances } from "@/services/appointments/getInsurances";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { createProcedureRequest } from "@/services/doctors/createProcedureRequest";


const Procedimentos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [doctors, setDoctors] = useState<any[]>([]);
        const [insurances, setInsurances] = useState<any[]>([]);
        const [patients, setPatients] = useState<any[]>([]);
  const [procedures, setProcedures] = useState<any[]>([]);
  
      const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
      const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);

   console.log("Procedures", procedures); // <-- Aqui

        const navigate = useNavigate(); // INSTÂNCIA

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

const formatarTempo = (tempo: string) => {
  const [horas, minutos, segundos] = tempo.split(":");

  const h = parseInt(horas);
  const m = parseInt(minutos);

  if (h > 0 && m === 0) return `${h} hora${h > 1 ? "s" : ""}`;
  if (h > 0 && m > 0) return `${h}h ${m}min`;
  return `${m} min`;
};


//para listar Medicos, Pacientes e especialidades
   useEffect(() => {
        const fetchConvenios = async () => {
            try {
                const data = await getInsurances();
                const convFormatted = data.map((nome, idx) => ({ id: idx + 1, nome }));
                setInsurances(convFormatted);
            } catch (error) {
                console.error("Erro ao buscar convênios:", error);
            }
        };

        const fetchPatients = async () => {
            try {
                const data = await getPatients();
                setPatients(data);
            } catch (err) {
                console.error("Erro ao buscar pacientes:", err);
            }
        };

        const fetchDoctors = async () => {
            try {
                const data = await getDoctors();
                setDoctors(data);
            } catch (err) {
                console.error("Erro ao buscar médicos:", err);
            }
        };

        fetchPatients();
        fetchDoctors();
        fetchConvenios();
    }, []);

        const {
            register,
            handleSubmit,
            formState: { errors },
            reset,
            setValue,
        } = useForm({
            resolver: zodResolver(z.any()),
        });

     const onSubmitProc = async (data: any) => {
  
          const payload = {
              paciente_id: Number(data.patientName),
              medico_id: selectedDoctorId,
              procedimento_codigo: data.cid,
              nome_procedimento: data.nome_procedimento,
              nome_especialidade: data.nome_especialidade,
              tipo: data.consultationType === "surgical_procedure" ? "cirurgia" : "laboratorial",
              data_agendada: data.date,
              hora_procedimento: data.time,
              status: data.status,
              data_realizacao: null,
              convenio: Number(data.insurance),
              motivo_cancelamento: "em_aberto",
              observacoes: data.observations,
              leito: "a_definir",
          };

          
         
  
          console.log("🚀 Enviando payload para backend:", payload);
          // Aqui você faria uma chamada para salvar o payload na API/backend
          try {
              if (!selectedPatientId) {
                  toast({ title: "Selecione um paciente válido", variant: "destructive" });
                  return;
              }
  
              if (!selectedDoctorId) {
                  toast({ title: "Selecione um médico válido", variant: "destructive" });
                  return;
              }
              const response = await createProcedureRequest(payload);
              toast({
                  title: "Sucesso!",
                  description: "Procedimento agendado com sucesso.",
              });
              console.log("✅ Resposta do backend:", response);
              // Você pode exibir toast de sucesso aqui se quiser
              toast({
                  title: "Sucesso!",
                  description: "Procedimento agendado com sucesso.",
              });
  
  
              // Espera 2 segundos para o toast aparecer antes de navegar
              await new Promise(resolve => setTimeout(resolve, 2000));
              console.log("✅ ja passei pelo toast:", response);
              navigate("/dashboard");
          } catch (error) {
              console.error("❌ Erro ao enviar procedimento:", error);
              // Você pode exibir toast de erro aqui também
          }
      };

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
                <form onSubmit={handleSubmit(onSubmitProc)}>
                <DialogHeader>
                  <DialogTitle>Criar Novo Procedimento</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Procedimento</Label>
                <Input id="name" placeholder="Ex: Apendicectomia" {...register("nome_procedimento")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Código / CID</Label>
                  <Input id="code" placeholder="Ex: 40.19" {...register("cid")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cirurgia">Cirurgia</SelectItem>
                        <SelectItem value="Laboratorial">Laboratorial</SelectItem>
                        <SelectItem value="Exame">Exame</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                                    <div className="space-y-2">
                    <Label htmlFor="category">Paciente</Label>
                     <Select onValueChange={(value) => {
                                                    const selected = patients.find(p => p.cliente_id === Number(value));
                                                    setSelectedPatientId(selected?.cliente_id ?? null);
                                                    setValue("patientName", value);
                                                }}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o paciente" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {patients.map((patient) => (
                                                            <SelectItem key={patient.cliente_id} value={patient.cliente_id.toString()}>
                                                                {patient.nome_cliente}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                  </div>
                  
                                    <div className="space-y-2">
                    <Label htmlFor="category">Convênio</Label>
                    <Select onValueChange={(value) => setValue("insurance", value)}>
  <SelectTrigger>
    <SelectValue placeholder="Selecione o convênio" />
  </SelectTrigger>
  <SelectContent>
    {insurances.map((insurance) => (
      <SelectItem key={`conv-${insurance.id}`} value={insurance.id.toString()}>
        {insurance.nome}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
                  </div>
                                    <div className="space-y-2">
                    <Label htmlFor="category">Médico</Label>
                                                                    <Select onValueChange={(value) => {
                                                    const doctor = doctors.find(d => d.full_name === value);
                                                    setSelectedDoctorId(doctor?.id ?? null);
                                                    setValue("doctorName", value);
                                                }}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o médico" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {doctors.map((doctor) => (
                                                            <SelectItem key={doctor.id} value={doctor.full_name}>
                                                                {doctor.full_name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Especialidade</Label>
           <Input id="category" placeholder="Ex: Cirurgia Geral" {...register("nome_especialidade")} />
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
                    <Label htmlFor="time">Data Consulta</Label>
                  <Input id="time" type="date" {...register("date")} />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="time">Horário</Label>
                    <Input id="time" type="time" {...register("time")}  placeholder="Ex: 60 min" />
                  </div>
                    <div className="space-y-2">
                    <Label htmlFor="time">Prioridade</Label>
                    <Select onValueChange={(value) => setValue("status", value)}>
  <SelectTrigger>
    <SelectValue placeholder="Selecionar prioridade" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="Alta">Alta </SelectItem>
    <SelectItem value="Média">Média</SelectItem>
    <SelectItem value="Baixa">Baixa</SelectItem>
  </SelectContent>
</Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Tempo Estimado</Label>
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
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                <Textarea id="description" {...register("observations")} placeholder="Descrição detalhada do procedimento" rows={3} />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button   onClick={handleSubmit(onSubmitProc)}>Salvar Procedimento</Button>
                </div>
              </form>
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
                      <span className="text-sm">{formatarTempo(procedure.tempo_estimado)}</span>
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
