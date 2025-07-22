import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, Trash2, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import HospitalLayout from "@/components/HospitalLayout";
import { getPatients } from "@/services/patients/getPatients";

const appointmentSchema = z.object({
  patientName: z.string().min(1, "Nome do paciente é obrigatório"),
  doctorName: z.string().min(1, "Médico é obrigatório"),
  date: z.string().min(1, "Data é obrigatória"),
  time: z.string().min(1, "Horário é obrigatório"),
  insurance: z.string().min(1, "Convênio é obrigatório"),
  consultationType: z.enum(["routine", "emergency", "return"]),
  status: z.enum(["scheduled", "confirmed", "cancelled", "completed"]),
  observations: z.string().optional(),
});





type AppointmentForm = z.infer<typeof appointmentSchema>;

interface Appointment extends AppointmentForm {
  id: string;
}

const consultationTypes = [
  { value: "routine", label: "Rotina" },
  { value: "emergency", label: "Emergência" },
  { value: "return", label: "Retorno" },
];

const statusOptions = [
  { value: "scheduled", label: "Agendada" },
  { value: "confirmed", label: "Confirmada" },
  { value: "cancelled", label: "Cancelada" },
  { value: "completed", label: "Realizada" },
];

const mockDoctors = [
  "Dr. João Silva - Cardiologia",
  "Dra. Maria Santos - Pediatria",
  "Dr. Pedro Costa - Ortopedia",
  "Dra. Ana Lima - Dermatologia",
];

const mockInsurances = [
  "SUS",
  "Unimed",
  "Bradesco Saúde",
  "Amil",
  "NotreDame Intermédica",
  //  "Particular",
];

export default function AppointmentsRegister() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const { toast } = useToast();

  // 👉 Aqui está a parte nova, que busca os pacientes do banco:
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getPatients();
        setPatients(data);
      } catch (err) {
        console.error("Erro ao buscar pacientes:", err);
      }
    };

    fetchPatients();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AppointmentForm>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      consultationType: "routine",
      status: "scheduled",
    },
  });

  const onSubmit = (data: AppointmentForm) => {
    if (editingAppointment) {
      setAppointments(prev => prev.map(a => a.id === editingAppointment.id ? { ...data, id: editingAppointment.id } : a));
      toast({ title: "Consulta atualizada com sucesso!" });
      setEditingAppointment(null);
    } else {
      const newAppointment: Appointment = { ...data, id: Date.now().toString() };
      setAppointments(prev => [...prev, newAppointment]);
      toast({ title: "Consulta agendada com sucesso!" });
    }
    reset();
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    Object.entries(appointment).forEach(([key, value]) => {
      setValue(key as keyof AppointmentForm, value);
    });
  };

  const handleDelete = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    toast({ title: "Consulta removida com sucesso!" });
  };

  const handleCancel = () => {
    reset();
    setEditingAppointment(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "default";
      case "scheduled": return "secondary";
      case "cancelled": return "destructive";
      case "completed": return "outline";
      default: return "secondary";
    }
  };

  const getConsultationTypeLabel = (type: string) => {
    return consultationTypes.find(t => t.value === type)?.label || type;
  };

  const getStatusLabel = (status: string) => {
    return statusOptions.find(s => s.value === status)?.label || status;
  };

  return (
    <HospitalLayout currentPage="agendamentos" onPageChange={() => { }}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/appointments">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-hospital-dark">Agendar de Consultas</h1>
            <p className="text-muted-foreground">Gerencie o agendamento de consultas médicas</p>
          </div>
        </div>

        {/* Formulário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {editingAppointment ? "Editar Consulta" : "Nova Consulta"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="doctorName">Paciente *</Label>
                  <Select onValueChange={(value) => setValue("patientName", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.nome_cliente}>
                          {patient.nome_cliente}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {errors.doctorName && <p className="text-destructive text-sm">{errors.doctorName.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doctorName">Médico *</Label>
                  <Select onValueChange={(value) => setValue("doctorName", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o médico" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDoctors.map((doctor) => (
                        <SelectItem key={doctor} value={doctor}>{doctor}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.doctorName && <p className="text-destructive text-sm">{errors.doctorName.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Data da Consulta *</Label>
                  <Input id="date" type="date" {...register("date" as const)} />
                  {errors.date && <p className="text-destructive text-sm">{errors.date.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Horário *</Label>
                  <Input id="time" type="time" {...register("time" as const)} />
                  {errors.time && <p className="text-destructive text-sm">{errors.time.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="insurance">Convênio *</Label>
                  <Select onValueChange={(value) => setValue("insurance", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o convênio" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockInsurances.map((insurance) => (
                        <SelectItem key={insurance} value={insurance}>{insurance}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.insurance && <p className="text-destructive text-sm">{errors.insurance.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consultationType">Tipo de Consulta *</Label>
                  <Select onValueChange={(value) => setValue("consultationType", value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {consultationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select onValueChange={(value) => setValue("status", value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observations">Observações</Label>
                <Textarea id="observations" {...register("observations" as const)} rows={3} />
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="bg-hospital-primary hover:bg-hospital-dark">
                  {editingAppointment ? "Atualizar" : "Salvar"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Consultas */}
        {appointments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Consultas Agendadas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Médico</TableHead>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">{appointment.patientName}</TableCell>
                      <TableCell>{appointment.doctorName}</TableCell>
                      <TableCell>
                        {new Date(appointment.date).toLocaleDateString("pt-BR")} às {appointment.time}
                      </TableCell>
                      <TableCell>{getConsultationTypeLabel(appointment.consultationType)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(appointment.status) as any}>
                          {getStatusLabel(appointment.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" onClick={() => handleEdit(appointment)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleDelete(appointment.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </HospitalLayout>
  );
}
