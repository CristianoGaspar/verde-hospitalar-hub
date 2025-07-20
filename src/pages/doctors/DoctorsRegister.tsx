
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, UserPlus, Trash2, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import HospitalLayout from "@/components/HospitalLayout";
import { createDoctor } from "@/services/doctors/createDoctor";
import { getDoctors } from "@/services/doctors/getDoctors";
import { useEffect, useState } from "react"; // já ajustado
import { useNavigate } from "react-router-dom";



const doctorSchema = z.object({
  full_name: z.string().min(1, "Nome completo é obrigatório"),
  crm: z.string().regex(/^CRM\/[A-Z]{2}\s\d{4,6}$/, "CRM deve ter o formato: CRM/UF 000000"),
  specialty: z.string().min(1, "Especialidade é obrigatória"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  status: z.enum(["active", "inactive"]),
  shiftDays: z.array(z.string()).min(1, "Selecione pelo menos um dia"),
  entryTime: z.string().min(1, "Horário de entrada é obrigatório"),
  exitTime: z.string().min(1, "Horário de saída é obrigatório"),
});

type DoctorForm = z.infer<typeof doctorSchema>;

interface Doctor extends DoctorForm {
  id: string;
}

const weekDays = [
  { id: "monday", label: "Segunda-feira" },
  { id: "tuesday", label: "Terça-feira" },
  { id: "wednesday", label: "Quarta-feira" },
  { id: "thursday", label: "Quinta-feira" },
  { id: "friday", label: "Sexta-feira" },
  { id: "saturday", label: "Sábado" },
  { id: "sunday", label: "Domingo" },
];

const specialties = [
  "Cardiologia", "Dermatologia", "Ginecologia", "Neurologia", "Ortopedia",
  "Pediatria", "Psiquiatria", "Radiologia", "Urologia", "Anestesiologia"
];

export default function DoctorsRegister() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate()

  //  NOVO: carregar médicos na montagem
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data);
      } catch (error) {
        console.error("Erro ao carregar médicos:", error);
        toast({ title: "Erro ao carregar médicos.", variant: "destructive" });
      }
    };

    loadDoctors();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<DoctorForm>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      status: "active",
      shiftDays: [],
    },
  });

  const watchedShiftDays = watch("shiftDays");

  const [isSubmitting, setIsSubmitting] = useState(false); //cria o loading

const onSubmit = async (data: DoctorForm) => {
  setIsSubmitting(true);
  console.log("📤 Enviando dados:", data);

  try {
    const response = await createDoctor(data);
    console.log("✅ Dados recebidos no frontend:", response);

    toast({ title: "Médico cadastrado com sucesso!" });

    setEditingDoctor(null);
    reset();

    setTimeout(() => {
      navigate("/doctors");
    }, 1500);
  } catch (error: any) {
    console.error("❌ Erro final no onSubmit:", error);
    toast({
      title: "Erro ao cadastrar médico.",
      description: error?.message || "Erro desconhecido",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
    console.log("✅ Finalizado submit");
  }
};





  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    Object.entries(doctor).forEach(([key, value]) => {
      setValue(key as keyof DoctorForm, value);
    });
  };

  const handleDelete = (id: string) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
    toast({ title: "Médico removido com sucesso!" });
  };

  const handleCancel = () => {
    reset();
    setEditingDoctor(null);
  };

  const handleShiftDayChange = (dayId: string, checked: boolean) => {
    const currentDays = watchedShiftDays || [];
    if (checked) {
      setValue("shiftDays", [...currentDays, dayId]);
    } else {
      setValue("shiftDays", currentDays.filter(d => d !== dayId));
    }
  };

  const getDayLabels = (dayIds: string[]) => {
    return dayIds
      .map(id => weekDays.find(d => d.id === id)?.label)
      .filter(Boolean)
      .join(", ");
  };

  return (
    <HospitalLayout currentPage="medicos" onPageChange={() => { }}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/doctors">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-hospital-dark">Cadastro de Médicos</h1>
            <p className="text-muted-foreground">Gerencie os médicos do hospital</p>
          </div>
        </div>

        {/* Formulário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              {editingDoctor ? "Editar Médico" : "Novo Médico"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome Completo *</Label>
                  <Input {...register("full_name")} />
                  {errors.full_name && <p className="text-destructive text-sm">{errors.full_name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>CRM *</Label>
                  <Input placeholder="CRM/SP 123456" {...register("crm")} />
                  {errors.crm && <p className="text-destructive text-sm">{errors.crm.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Especialidade *</Label>
                  <Select onValueChange={(value) => setValue("specialty", value)}>
                    <SelectTrigger><SelectValue placeholder="Selecione a especialidade" /></SelectTrigger>
                    <SelectContent>
                      {specialties.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.specialty && <p className="text-destructive text-sm">{errors.specialty.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>E-mail *</Label>
                  <Input type="email" {...register("email")} />
                  {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Telefone *</Label>
                  <Input {...register("phone")} />
                  {errors.phone && <p className="text-destructive text-sm">{errors.phone.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Status *</Label>
                  <Select onValueChange={(value) => setValue("status", value as "active" | "inactive")}>
                    <SelectTrigger><SelectValue placeholder="Selecione o status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && <p className="text-destructive text-sm">{errors.status.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Horário de Entrada *</Label>
                  <Input type="time" {...register("entryTime")} />
                  {errors.entryTime && <p className="text-destructive text-sm">{errors.entryTime.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Horário de Saída *</Label>
                  <Input type="time" {...register("exitTime")} />
                  {errors.exitTime && <p className="text-destructive text-sm">{errors.exitTime.message}</p>}
                </div>
              </div>

              {/* Dias de Plantão */}
              <div className="space-y-3">
                <Label>Dias de Plantão *</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {weekDays.map((day) => (
                    <div key={day.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={day.id}
                        checked={watchedShiftDays?.includes(day.id) || false}
                        onCheckedChange={(checked) => handleShiftDayChange(day.id, checked as boolean)}
                      />
                      <Label htmlFor={day.id} className="text-sm">{day.label}</Label>
                    </div>
                  ))}
                </div>
                {errors.shiftDays && <p className="text-destructive text-sm">{errors.shiftDays.message}</p>}
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="bg-hospital-primary hover:bg-hospital-dark">
                  {editingDoctor ? "Atualizar" : "Salvar"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tabela de médicos */}
        {doctors.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Médicos Cadastrados</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>CRM</TableHead>
                    <TableHead>Especialidade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Plantões</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell>{doctor.full_name}</TableCell>
                      <TableCell>{doctor.crm}</TableCell>
                      <TableCell>{doctor.specialty}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${doctor.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {doctor.status === "active" ? "Ativo" : "Inativo"}
                        </span>
                      </TableCell>
                      <TableCell>{getDayLabels(doctor.shiftDays)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" onClick={() => handleEdit(doctor)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="outline" size="icon" onClick={() => handleDelete(doctor.id)}><Trash2 className="h-4 w-4" /></Button>
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
