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

const states = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", 
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", 
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const insurances = [
  "Unimed", "Bradesco Saúde", "SulAmérica", "Amil", "NotreDame", "Particular"
];

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
  } = useForm<PatientForm>({
    resolver: zodResolver(patientSchema),
  });

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
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-primary">Cadastro de Pacientes</h1>
            <p className="text-muted-foreground">Gerencie os pacientes do hospital</p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              {editingPatient ? "Editar Paciente" : "Novo Paciente"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Dados Pessoais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome Completo *</Label>
                    <Input id="fullName" {...register("fullName")} />
                    {errors.fullName && <p className="text-destructive text-sm">{errors.fullName.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input id="cpf" placeholder="000.000.000-00" {...register("cpf")} />
                    {errors.cpf && <p className="text-destructive text-sm">{errors.cpf.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rg">RG *</Label>
                    <Input id="rg" {...register("rg")} />
                    {errors.rg && <p className="text-destructive text-sm">{errors.rg.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Data de Nascimento *</Label>
                    <Input id="birthDate" type="date" {...register("birthDate")} />
                    {errors.birthDate && <p className="text-destructive text-sm">{errors.birthDate.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Sexo *</Label>
                    <Select onValueChange={(value) => setValue("gender", value as "male" | "female" | "other")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o sexo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Masculino</SelectItem>
                        <SelectItem value="female">Feminino</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && <p className="text-destructive text-sm">{errors.gender.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input id="phone" {...register("phone")} />
                    {errors.phone && <p className="text-destructive text-sm">{errors.phone.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" {...register("email")} />
                    {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Endereço</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Endereço Completo *</Label>
                    <Input id="address" {...register("address")} />
                    {errors.address && <p className="text-destructive text-sm">{errors.address.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade *</Label>
                    <Input id="city" {...register("city")} />
                    {errors.city && <p className="text-destructive text-sm">{errors.city.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">Estado *</Label>
                    <Select onValueChange={(value) => setValue("state", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.state && <p className="text-destructive text-sm">{errors.state.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">CEP *</Label>
                    <Input id="zipCode" placeholder="00000-000" {...register("zipCode")} />
                    {errors.zipCode && <p className="text-destructive text-sm">{errors.zipCode.message}</p>}
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Contato de Emergência</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Nome do Contato *</Label>
                    <Input id="emergencyContact" {...register("emergencyContact")} />
                    {errors.emergencyContact && <p className="text-destructive text-sm">{errors.emergencyContact.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Telefone de Emergência *</Label>
                    <Input id="emergencyPhone" {...register("emergencyPhone")} />
                    {errors.emergencyPhone && <p className="text-destructive text-sm">{errors.emergencyPhone.message}</p>}
                  </div>
                </div>
              </div>

              {/* Insurance */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Convênio</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="insurance">Convênio *</Label>
                    <Select onValueChange={(value) => setValue("insurance", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o convênio" />
                      </SelectTrigger>
                      <SelectContent>
                        {insurances.map((insurance) => (
                          <SelectItem key={insurance} value={insurance}>
                            {insurance}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.insurance && <p className="text-destructive text-sm">{errors.insurance.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="insuranceNumber">Número da Carteirinha</Label>
                    <Input id="insuranceNumber" {...register("insuranceNumber")} />
                    {errors.insuranceNumber && <p className="text-destructive text-sm">{errors.insuranceNumber.message}</p>}
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Informações Médicas</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="allergies">Alergias</Label>
                    <Textarea id="allergies" {...register("allergies")} rows={2} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medicalHistory">Histórico Médico</Label>
                    <Textarea id="medicalHistory" {...register("medicalHistory")} rows={3} />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  {editingPatient ? "Atualizar" : "Salvar"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Patients List */}
        {patients.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pacientes Cadastrados</CardTitle>
            </CardHeader>
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
                  {patients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.fullName}</TableCell>
                      <TableCell>{patient.cpf}</TableCell>
                      <TableCell>{calculateAge(patient.birthDate)} anos</TableCell>
                      <TableCell>{patient.phone}</TableCell>
                      <TableCell>{patient.insurance}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(patient)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(patient.id)}
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