import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, UserPlus, Trash2, Edit } from "lucide-react";
import { Link } from "react-router-dom";

const doctorSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  crm: z.string().regex(/^\d{4,6}\/[A-Z]{2}$/, "CRM deve ter o formato: 12345/SP"),
  specialty: z.string().min(1, "Especialidade é obrigatória"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  status: z.enum(["active", "inactive"]),
  shiftDays: z.array(z.string()).min(1, "Selecione pelo menos um dia"),
  startTime: z.string().min(1, "Horário de entrada é obrigatório"),
  endTime: z.string().min(1, "Horário de saída é obrigatório"),
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

export default function DoctorsRegister() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const { toast } = useToast();

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
      shiftDays: [],
      status: "active",
    },
  });

  const watchedShiftDays = watch("shiftDays");

  const onSubmit = (data: DoctorForm) => {
    if (editingDoctor) {
      setDoctors(prev => prev.map(d => d.id === editingDoctor.id ? { ...data, id: editingDoctor.id } : d));
      toast({ title: "Médico atualizado com sucesso!" });
      setEditingDoctor(null);
    } else {
      const newDoctor: Doctor = { ...data, id: Date.now().toString() };
      setDoctors(prev => [...prev, newDoctor]);
      toast({ title: "Médico cadastrado com sucesso!" });
    }
    reset();
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

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-primary">Cadastro de Médicos</h1>
            <p className="text-muted-foreground">Gerencie o cadastro dos médicos do hospital</p>
          </div>
        </div>

        {/* Form */}
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
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input id="name" {...register("name")} />
                  {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="crm">CRM *</Label>
                  <Input id="crm" placeholder="12345/SP" {...register("crm")} />
                  {errors.crm && <p className="text-destructive text-sm">{errors.crm.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialty">Especialidade *</Label>
                  <Input id="specialty" {...register("specialty")} />
                  {errors.specialty && <p className="text-destructive text-sm">{errors.specialty.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input id="email" type="email" {...register("email")} />
                  {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input id="phone" {...register("phone")} />
                  {errors.phone && <p className="text-destructive text-sm">{errors.phone.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select onValueChange={(value) => setValue("status", value as "active" | "inactive")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startTime">Horário de Entrada *</Label>
                  <Input id="startTime" type="time" {...register("startTime")} />
                  {errors.startTime && <p className="text-destructive text-sm">{errors.startTime.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">Horário de Saída *</Label>
                  <Input id="endTime" type="time" {...register("endTime")} />
                  {errors.endTime && <p className="text-destructive text-sm">{errors.endTime.message}</p>}
                </div>
              </div>

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
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  {editingDoctor ? "Atualizar" : "Salvar"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Doctors List */}
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
                    <TableHead>Plantão</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell className="font-medium">{doctor.name}</TableCell>
                      <TableCell>{doctor.crm}</TableCell>
                      <TableCell>{doctor.specialty}</TableCell>
                      <TableCell>
                        <Badge variant={doctor.status === "active" ? "default" : "secondary"}>
                          {doctor.status === "active" ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>{doctor.startTime} - {doctor.endTime}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(doctor)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(doctor.id)}
                          >
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
    </div>
  );
}