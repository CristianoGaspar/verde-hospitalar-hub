// src/pages/PatientsRegister.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, UserPlus, Trash2, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import HospitalLayout from "@/components/HospitalLayout";


const patientSchema = z.object({
  fullName: z.string().min(1, "Nome completo é obrigatório"),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF deve ter o formato: 000.000.000-00"),
  rg: z.string().min(1, "RG é obrigatório"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  gender: z.enum(["male", "female", "other"]),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  address: z.string().min(1, "Endereço é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório"),
  zipCode: z.string().regex(/^\d{5}-?\d{3}$/, "CEP deve ter o formato: 00000-000"),
  emergencyContact: z.string().min(1, "Contato de emergência é obrigatório"),
  emergencyPhone: z.string().min(10, "Telefone de emergência deve ter pelo menos 10 dígitos"),
  insurance: z.string().min(1, "Convênio é obrigatório"),
  insuranceNumber: z.string().optional(),
  allergies: z.string().optional(),
  medicalHistory: z.string().optional(),
});

type PatientForm = z.infer<typeof patientSchema>;
interface Patient extends PatientForm {
  id: string;
}

const states = [ "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO" ];
const insurances = [ "Unimed", "Bradesco Saúde", "SulAmérica", "Amil", "NotreDame", "Particular" ];

export default function PatientsRegister() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<PatientForm>({ resolver: zodResolver(patientSchema) });

  const onSubmit = (data: PatientForm) => {
    if (editingPatient) {
      setPatients(prev => prev.map(p => p.id === editingPatient.id ? { ...data, id: editingPatient.id } : p));
      toast({ title: "Paciente atualizado com sucesso!" });
      setEditingPatient(null);
    } else {
      const newPatient: Patient = { ...data, id: Date.now().toString() };
      setPatients(prev => [...prev, newPatient]);
      toast({ title: "Paciente cadastrado com sucesso!" });
    }
    reset();
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    Object.entries(patient).forEach(([key, value]) => {
      setValue(key as keyof PatientForm, value);
    });
  };

  const handleDelete = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    toast({ title: "Paciente removido com sucesso!" });
  };

  const handleCancel = () => {
    reset();
    setEditingPatient(null);
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  return (
  
       <HospitalLayout currentPage="pacientes" onPageChange={() => {}}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/patients">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-hospital-dark">Cadastro de Pacientes</h1>
            <p className="text-muted-foreground">Gerencie os pacientes do hospital</p>
          </div>
        </div>

        {/* Formulário de cadastro */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              {editingPatient ? "Editar Paciente" : "Novo Paciente"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {/* Dados pessoais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Nome Completo *</Label><Input {...register("fullName")} />{errors.fullName && <p className="text-destructive text-sm">{errors.fullName.message}</p>}</div>
                <div><Label>CPF *</Label><Input {...register("cpf")} placeholder="000.000.000-00" />{errors.cpf && <p className="text-destructive text-sm">{errors.cpf.message}</p>}</div>
                <div><Label>RG *</Label><Input {...register("rg")} />{errors.rg && <p className="text-destructive text-sm">{errors.rg.message}</p>}</div>
                <div><Label>Data de Nascimento *</Label><Input type="date" {...register("birthDate")} />{errors.birthDate && <p className="text-destructive text-sm">{errors.birthDate.message}</p>}</div>
                <div>
                  <Label>Sexo *</Label>
                  <Select onValueChange={value => setValue("gender", value as "male" | "female" | "other")}>
                    <SelectTrigger><SelectValue placeholder="Selecione o sexo" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Masculino</SelectItem>
                      <SelectItem value="female">Feminino</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-destructive text-sm">{errors.gender.message}</p>}
                </div>
                <div><Label>Telefone *</Label><Input {...register("phone")} />{errors.phone && <p className="text-destructive text-sm">{errors.phone.message}</p>}</div>
                <div><Label>E-mail</Label><Input type="email" {...register("email")} />{errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}</div>
              </div>

              {/* Endereço */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2"><Label>Endereço Completo *</Label><Input {...register("address")} />{errors.address && <p className="text-destructive text-sm">{errors.address.message}</p>}</div>
                <div><Label>Cidade *</Label><Input {...register("city")} />{errors.city && <p className="text-destructive text-sm">{errors.city.message}</p>}</div>
                <div>
                  <Label>Estado *</Label>
                  <Select onValueChange={value => setValue("state", value)}>
                    <SelectTrigger><SelectValue placeholder="Selecione o estado" /></SelectTrigger>
                    <SelectContent>{states.map(uf => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}</SelectContent>
                  </Select>
                  {errors.state && <p className="text-destructive text-sm">{errors.state.message}</p>}
                </div>
                <div><Label>CEP *</Label><Input placeholder="00000-000" {...register("zipCode")} />{errors.zipCode && <p className="text-destructive text-sm">{errors.zipCode.message}</p>}</div>
              </div>

              {/* Contato de emergência */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Contato de Emergência *</Label><Input {...register("emergencyContact")} />{errors.emergencyContact && <p className="text-destructive text-sm">{errors.emergencyContact.message}</p>}</div>
                <div><Label>Telefone de Emergência *</Label><Input {...register("emergencyPhone")} />{errors.emergencyPhone && <p className="text-destructive text-sm">{errors.emergencyPhone.message}</p>}</div>
              </div>

              {/* Convênio */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Convênio *</Label>
                  <Select onValueChange={value => setValue("insurance", value)}>
                    <SelectTrigger><SelectValue placeholder="Selecione o convênio" /></SelectTrigger>
                    <SelectContent>{insurances.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                  </Select>
                  {errors.insurance && <p className="text-destructive text-sm">{errors.insurance.message}</p>}
                </div>
                <div><Label>Número da Carteirinha</Label><Input {...register("insuranceNumber")} /></div>
              </div>

              {/* Informações médicas */}
              <div className="grid grid-cols-1 gap-4">
                <div><Label>Alergias</Label><Textarea {...register("allergies")} rows={2} /></div>
                <div><Label>Histórico Médico</Label><Textarea {...register("medicalHistory")} rows={3} /></div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="bg-hospital-primary hover:bg-hospital-dark">
                  {editingPatient ? "Atualizar" : "Salvar"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Lista de pacientes cadastrados */}
        {patients.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Pacientes Cadastrados</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Idade</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Convênio</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.fullName}</TableCell>
                      <TableCell>{p.cpf}</TableCell>
                      <TableCell>{calculateAge(p.birthDate)} anos</TableCell>
                      <TableCell>{p.phone}</TableCell>
                      <TableCell>{p.insurance}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" onClick={() => handleEdit(p)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="outline" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4" /></Button>
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
