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
import { getDoctors } from "@/services/doctors/getDoctors";
import { createAppointment } from "@/services/appointments/createAppointment";
import { getInsuranceByPatientId } from "@/services/patients/getInsuranceByPatientId";
import { getInsurances } from "@/services/appointments/getInsurances";
//import { getInsuranceByPatientId } from "@/services/patientService"; // ajuste o path

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

const mockInsurances = [
  "SUS",
  "Unimed",
  "Bradesco Saúde",
  "Amil",
  "NotreDame Intermédica",
];

export default function AppointmentsRegister() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const { toast } = useToast();

  const [insurances, setInsurances] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);

  useEffect(() => {
    const fetchConvenios = async () => {
    try {
      const data = await getInsurances(); // <-- data é um array de strings
      const convFormatted = data.map((nome, idx) => ({
        id: idx + 1,
        nome,
      }));
      console.log("Convênios formatados:", convFormatted);
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
  } = useForm<AppointmentForm>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      consultationType: "routine",
      status: "scheduled",
    },
  });

  const onSubmit = async (data: AppointmentForm) => {
    try {
      if (!selectedPatientId) {
        toast({ title: "Selecione um paciente válido", variant: "destructive" });
        return;
      }

      if (!selectedDoctorId) {
        toast({ title: "Selecione um médico válido", variant: "destructive" });
        return;
      }

      const datetime = `${data.date} ${data.time}:00`;

      await createAppointment({
        paciente_id: selectedPatientId,
        medico_id: selectedDoctorId,
        data_agendada: datetime,
        status: data.status,
        motivo_cancelamento: null,
        data_finalizacao: null,
        observacoes: data.observations || null,
      });

      toast({ title: "Consulta salva com sucesso!" });
      reset();
      setSelectedPatientId(null);
      setSelectedDoctorId(null);
    } catch (error) {
      console.error("Erro ao salvar consulta:", error);
      toast({ title: "Erro ao salvar consulta", variant: "destructive" });
    }
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

  const getConsultationTypeLabel = (type: string) =>
    consultationTypes.find(t => t.value === type)?.label || type;

  const getStatusLabel = (status: string) =>
    statusOptions.find(s => s.value === status)?.label || status;

  return (
    <HospitalLayout currentPage="agendamentos" onPageChange={() => { }}>
      <div className="p-6 space-y-6">
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
                {/* Paciente */}
                <div className="space-y-2">
                  <Label htmlFor="patientName">Paciente *</Label>
                  <Select
                    onValueChange={(value) => {
                      const selected = patients.find(p => p.nome_cliente === value);
                      setSelectedPatientId(selected?.id ?? null);

                      //setSelectedPatientId(id);
                      setValue("patientName", value);

                      //console.log("Paciente selecionado:", value, "| ID:", id); // <-- agora funciona
                    }}
                  >
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
                  {errors.patientName && <p className="text-destructive text-sm">{errors.patientName.message}</p>}
                </div>

                {/* Médico */}
                <div className="space-y-2">
                  <Label htmlFor="doctorName">Médico *</Label>
                  <Select
                    onValueChange={(value) => {
                      const doctor = doctors.find(d => d.full_name === value);
                      setSelectedDoctorId(doctor?.id ?? null);
                      setValue("doctorName", value);
                    }}
                  >
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
                  {errors.doctorName && <p className="text-destructive text-sm">{errors.doctorName.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Data da Consulta *</Label>
                  <Input id="date" type="date" {...register("date")} />
                  {errors.date && <p className="text-destructive text-sm">{errors.date.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Horário *</Label>
                  <Input id="time" type="time" {...register("time")} />
                  {errors.time && <p className="text-destructive text-sm">{errors.time.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="insurance">Convênio *</Label>
                  <Select onValueChange={(value) => setValue("insurance", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o convênio" />
                    </SelectTrigger>
                    <SelectContent>
   {insurances.map((insurance) => (
  <SelectItem key={`conv-${insurance.id}`} value={insurance.nome}>
    {insurance.nome}
  </SelectItem>
))}

                    </SelectContent>
                  </Select>
                  {errors.insurance && (
                    <p className="text-destructive text-sm">{errors.insurance.message}</p>
                  )}
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
                <Textarea id="observations" {...register("observations")} rows={3} />
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
      </div>
    </HospitalLayout>
  );
}
