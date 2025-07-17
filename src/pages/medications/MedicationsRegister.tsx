import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Pill, Trash2, Edit, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const medicationSchema = z.object({
  commercialName: z.string().min(1, "Nome comercial é obrigatório"),
  activeIngredient: z.string().min(1, "Princípio ativo é obrigatório"),
  dosage: z.string().min(1, "Dosagem é obrigatória"),
  type: z.string().min(1, "Tipo é obrigatório"),
  stockQuantity: z.string().min(1, "Quantidade em estoque é obrigatória"),
  expirationDate: z.string().min(1, "Data de validade é obrigatória"),
  storageLocation: z.string().min(1, "Local de armazenamento é obrigatório"),
  internalCode: z.string().min(1, "Código interno é obrigatório"),
});

type MedicationForm = z.infer<typeof medicationSchema>;

interface Medication extends MedicationForm {
  id: string;
}

const medicationTypes = [
  "Comprimido",
  "Cápsula",
  "Xarope",
  "Injetável",
  "Pomada",
  "Gel",
  "Spray",
  "Gotas",
  "Supositório",
];

export default function MedicationsRegister() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<MedicationForm>({
    resolver: zodResolver(medicationSchema),
  });

  const onSubmit = (data: MedicationForm) => {
    if (editingMedication) {
      setMedications(prev => prev.map(m => m.id === editingMedication.id ? { ...data, id: editingMedication.id } : m));
      toast({ title: "Medicamento atualizado com sucesso!" });
      setEditingMedication(null);
    } else {
      const newMedication: Medication = { ...data, id: Date.now().toString() };
      setMedications(prev => [...prev, newMedication]);
      toast({ title: "Medicamento cadastrado com sucesso!" });
    }
    reset();
  };

  const handleEdit = (medication: Medication) => {
    setEditingMedication(medication);
    Object.entries(medication).forEach(([key, value]) => {
      setValue(key as keyof MedicationForm, value);
    });
  };

  const handleDelete = (id: string) => {
    setMedications(prev => prev.filter(m => m.id !== id));
    toast({ title: "Medicamento removido com sucesso!" });
  };

  const handleCancel = () => {
    reset();
    setEditingMedication(null);
  };

  const isExpiringSoon = (expirationDate: string) => {
    const expDate = new Date(expirationDate);
    const today = new Date();
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };

  const isExpired = (expirationDate: string) => {
    const expDate = new Date(expirationDate);
    const today = new Date();
    return expDate < today;
  };

  const getStockStatus = (quantity: string) => {
    const qty = parseInt(quantity);
    if (qty === 0) return { label: "Sem estoque", variant: "destructive" as const };
    if (qty <= 10) return { label: "Estoque baixo", variant: "secondary" as const };
    return { label: "Em estoque", variant: "default" as const };
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
            <h1 className="text-3xl font-bold text-primary">Cadastro de Medicamentos</h1>
            <p className="text-muted-foreground">Gerencie o estoque de medicamentos do hospital</p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5" />
              {editingMedication ? "Editar Medicamento" : "Novo Medicamento"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="commercialName">Nome Comercial *</Label>
                  <Input id="commercialName" {...register("commercialName")} />
                  {errors.commercialName && <p className="text-destructive text-sm">{errors.commercialName.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activeIngredient">Princípio Ativo *</Label>
                  <Input id="activeIngredient" {...register("activeIngredient")} />
                  {errors.activeIngredient && <p className="text-destructive text-sm">{errors.activeIngredient.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosagem *</Label>
                  <Input id="dosage" placeholder="ex: 500mg" {...register("dosage")} />
                  {errors.dosage && <p className="text-destructive text-sm">{errors.dosage.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo *</Label>
                  <Select onValueChange={(value) => setValue("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicationTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-destructive text-sm">{errors.type.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stockQuantity">Quantidade em Estoque *</Label>
                  <Input id="stockQuantity" type="number" {...register("stockQuantity")} />
                  {errors.stockQuantity && <p className="text-destructive text-sm">{errors.stockQuantity.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expirationDate">Data de Validade *</Label>
                  <Input id="expirationDate" type="date" {...register("expirationDate")} />
                  {errors.expirationDate && <p className="text-destructive text-sm">{errors.expirationDate.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storageLocation">Local de Armazenamento *</Label>
                  <Input id="storageLocation" placeholder="ex: Farmácia - Prateleira A1" {...register("storageLocation")} />
                  {errors.storageLocation && <p className="text-destructive text-sm">{errors.storageLocation.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="internalCode">Código Interno *</Label>
                  <Input id="internalCode" {...register("internalCode")} />
                  {errors.internalCode && <p className="text-destructive text-sm">{errors.internalCode.message}</p>}
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  {editingMedication ? "Atualizar" : "Salvar"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Medications List */}
        {medications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Medicamentos Cadastrados</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome Comercial</TableHead>
                    <TableHead>Princípio Ativo</TableHead>
                    <TableHead>Tipo/Dosagem</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead>Validade</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medications.map((medication) => {
                    const stockStatus = getStockStatus(medication.stockQuantity);
                    const expired = isExpired(medication.expirationDate);
                    const expiringSoon = isExpiringSoon(medication.expirationDate);
                    
                    return (
                      <TableRow key={medication.id}>
                        <TableCell className="font-medium">{medication.commercialName}</TableCell>
                        <TableCell>{medication.activeIngredient}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{medication.type}</div>
                            <div className="text-muted-foreground">{medication.dosage}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{medication.stockQuantity}</span>
                            <Badge variant={stockStatus.variant}>
                              {stockStatus.label}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {new Date(medication.expirationDate).toLocaleDateString('pt-BR')}
                            </span>
                            {(expired || expiringSoon) && (
                              <AlertTriangle className="h-4 w-4 text-destructive" />
                            )}
                          </div>
                          {expired && (
                            <Badge variant="destructive" className="text-xs">Vencido</Badge>
                          )}
                          {expiringSoon && !expired && (
                            <Badge variant="secondary" className="text-xs">Vence em breve</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">{medication.storageLocation}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(medication)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDelete(medication.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}