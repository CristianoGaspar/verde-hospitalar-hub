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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Shield, Trash2, Edit } from "lucide-react";
import { Link } from "react-router-dom";

const insuranceSchema = z.object({
  name: z.string().min(1, "Nome do convênio é obrigatório"),
  cnpj: z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "CNPJ deve ter o formato: 00.000.000/0000-00"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  email: z.string().email("Email inválido"),
  coveredProcedures: z.array(z.string()).min(1, "Selecione pelo menos um procedimento"),
  approvalTime: z.string().min(1, "Tempo de aprovação é obrigatório"),
  observations: z.string().optional(),
});

type InsuranceForm = z.infer<typeof insuranceSchema>;

interface Insurance extends InsuranceForm {
  id: string;
}

const procedures = [
  { id: "consultation", label: "Consultas médicas" },
  { id: "exams", label: "Exames laboratoriais" },
  { id: "imaging", label: "Exames de imagem" },
  { id: "surgery", label: "Cirurgias" },
  { id: "emergency", label: "Atendimento de emergência" },
  { id: "hospitalization", label: "Internação" },
  { id: "physiotherapy", label: "Fisioterapia" },
  { id: "psychology", label: "Psicologia" },
];

export default function InsuranceRegister() {
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [editingInsurance, setEditingInsurance] = useState<Insurance | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<InsuranceForm>({
    resolver: zodResolver(insuranceSchema),
    defaultValues: {
      coveredProcedures: [],
    },
  });

  const watchedProcedures = watch("coveredProcedures");

  const onSubmit = (data: InsuranceForm) => {
    if (editingInsurance) {
      setInsurances(prev => prev.map(i => i.id === editingInsurance.id ? { ...data, id: editingInsurance.id } : i));
      toast({ title: "Convênio atualizado com sucesso!" });
      setEditingInsurance(null);
    } else {
      const newInsurance: Insurance = { ...data, id: Date.now().toString() };
      setInsurances(prev => [...prev, newInsurance]);
      toast({ title: "Convênio cadastrado com sucesso!" });
    }
    reset();
  };

  const handleEdit = (insurance: Insurance) => {
    setEditingInsurance(insurance);
    Object.entries(insurance).forEach(([key, value]) => {
      setValue(key as keyof InsuranceForm, value);
    });
  };

  const handleDelete = (id: string) => {
    setInsurances(prev => prev.filter(i => i.id !== id));
    toast({ title: "Convênio removido com sucesso!" });
  };

  const handleCancel = () => {
    reset();
    setEditingInsurance(null);
  };

  const handleProcedureChange = (procedureId: string, checked: boolean) => {
    const currentProcedures = watchedProcedures || [];
    if (checked) {
      setValue("coveredProcedures", [...currentProcedures, procedureId]);
    } else {
      setValue("coveredProcedures", currentProcedures.filter(p => p !== procedureId));
    }
  };

  const getProcedureLabels = (procedureIds: string[]) => {
    return procedureIds.map(id => procedures.find(p => p.id === id)?.label).filter(Boolean).join(", ");
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
            <h1 className="text-3xl font-bold text-primary">Cadastro de Convênios</h1>
            <p className="text-muted-foreground">Gerencie os convênios médicos aceitos pelo hospital</p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {editingInsurance ? "Editar Convênio" : "Novo Convênio"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Convênio *</Label>
                  <Input id="name" {...register("name")} />
                  {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ *</Label>
                  <Input id="cnpj" placeholder="00.000.000/0000-00" {...register("cnpj")} />
                  {errors.cnpj && <p className="text-destructive text-sm">{errors.cnpj.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input id="phone" {...register("phone")} />
                  {errors.phone && <p className="text-destructive text-sm">{errors.phone.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input id="email" type="email" {...register("email")} />
                  {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="approvalTime">Tempo de Aprovação (dias) *</Label>
                  <Input id="approvalTime" type="number" {...register("approvalTime")} />
                  {errors.approvalTime && <p className="text-destructive text-sm">{errors.approvalTime.message}</p>}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Procedimentos Cobertos *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {procedures.map((procedure) => (
                    <div key={procedure.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={procedure.id}
                        checked={watchedProcedures?.includes(procedure.id) || false}
                        onCheckedChange={(checked) => handleProcedureChange(procedure.id, checked as boolean)}
                      />
                      <Label htmlFor={procedure.id} className="text-sm">{procedure.label}</Label>
                    </div>
                  ))}
                </div>
                {errors.coveredProcedures && <p className="text-destructive text-sm">{errors.coveredProcedures.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="observations">Observações</Label>
                <Textarea id="observations" {...register("observations")} rows={3} />
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  {editingInsurance ? "Atualizar" : "Salvar"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Insurance List */}
        {insurances.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Convênios Cadastrados</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>CNPJ</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Tempo Aprovação</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {insurances.map((insurance) => (
                    <TableRow key={insurance.id}>
                      <TableCell className="font-medium">{insurance.name}</TableCell>
                      <TableCell>{insurance.cnpj}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{insurance.phone}</div>
                          <div className="text-muted-foreground">{insurance.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{insurance.approvalTime} dias</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(insurance)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(insurance.id)}
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