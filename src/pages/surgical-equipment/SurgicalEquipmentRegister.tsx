import { useState } from "react";
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
import { ArrowLeft, Monitor, Trash2, Edit, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const surgicalEquipmentSchema = z.object({
  equipmentName: z.string().min(1, "Nome do equipamento é obrigatório"),
  assetCode: z.string().min(1, "Código de patrimônio é obrigatório"),
  currentLocation: z.string().min(1, "Localização atual é obrigatória"),
  status: z.enum(["operational", "maintenance", "reserved"]),
  lastCalibration: z.string().optional(),
  technicalResponsible: z.string().min(1, "Responsável técnico é obrigatório"),
  observations: z.string().optional(),
});

type SurgicalEquipmentForm = z.infer<typeof surgicalEquipmentSchema>;

interface SurgicalEquipment extends SurgicalEquipmentForm {
  id: string;
}

const equipmentStatuses = [
  { value: "operational", label: "Operacional" },
  { value: "maintenance", label: "Em Manutenção" },
  { value: "reserved", label: "Reservado" },
];

const locations = [
  "Sala Cirúrgica 1",
  "Sala Cirúrgica 2",
  "Sala Cirúrgica 3",
  "Sala Cirúrgica 4",
  "Centro Cirúrgico",
  "UTI",
  "Emergência",
  "Depósito de Equipamentos",
  "Manutenção",
];

export default function SurgicalEquipmentRegister() {
  const [equipment, setEquipment] = useState<SurgicalEquipment[]>([]);
  const [editingEquipment, setEditingEquipment] = useState<SurgicalEquipment | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<SurgicalEquipmentForm>({
    resolver: zodResolver(surgicalEquipmentSchema),
    defaultValues: {
      status: "operational",
    },
  });

  const onSubmit = (data: SurgicalEquipmentForm) => {
    if (editingEquipment) {
      setEquipment(prev => prev.map(e => e.id === editingEquipment.id ? { ...data, id: editingEquipment.id } : e));
      toast({ title: "Equipamento cirúrgico atualizado com sucesso!" });
      setEditingEquipment(null);
    } else {
      const newEquipment: SurgicalEquipment = { ...data, id: Date.now().toString() };
      setEquipment(prev => [...prev, newEquipment]);
      toast({ title: "Equipamento cirúrgico cadastrado com sucesso!" });
    }
    reset();
  };

  const handleEdit = (equipmentItem: SurgicalEquipment) => {
    setEditingEquipment(equipmentItem);
    Object.entries(equipmentItem).forEach(([key, value]) => {
      setValue(key as keyof SurgicalEquipmentForm, value);
    });
  };

  const handleDelete = (id: string) => {
    setEquipment(prev => prev.filter(e => e.id !== id));
    toast({ title: "Equipamento cirúrgico removido com sucesso!" });
  };

  const handleCancel = () => {
    reset();
    setEditingEquipment(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational": return "default";
      case "maintenance": return "destructive";
      case "reserved": return "secondary";
      default: return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    return equipmentStatuses.find(s => s.value === status)?.label || status;
  };

  const isCalibrationOverdue = (lastCalibration: string) => {
    if (!lastCalibration) return false;
    const calibrationDate = new Date(lastCalibration);
    const today = new Date();
    const diffMonths = (today.getFullYear() - calibrationDate.getFullYear()) * 12 + 
                       (today.getMonth() - calibrationDate.getMonth());
    return diffMonths >= 12; // Consider overdue if 12+ months
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
            <h1 className="text-3xl font-bold text-primary">Cadastro de Equipamentos Cirúrgicos</h1>
            <p className="text-muted-foreground">Gerencie o inventário de equipamentos cirúrgicos</p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              {editingEquipment ? "Editar Equipamento" : "Novo Equipamento"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="equipmentName">Nome do Equipamento *</Label>
                  <Input id="equipmentName" {...register("equipmentName")} />
                  {errors.equipmentName && <p className="text-destructive text-sm">{errors.equipmentName.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assetCode">Código de Patrimônio *</Label>
                  <Input id="assetCode" {...register("assetCode")} />
                  {errors.assetCode && <p className="text-destructive text-sm">{errors.assetCode.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentLocation">Localização Atual *</Label>
                  <Select onValueChange={(value) => setValue("currentLocation", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a localização" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.currentLocation && <p className="text-destructive text-sm">{errors.currentLocation.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select onValueChange={(value) => setValue("status", value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipmentStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastCalibration">Data da Última Calibração</Label>
                  <Input id="lastCalibration" type="date" {...register("lastCalibration")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="technicalResponsible">Responsável Técnico *</Label>
                  <Input id="technicalResponsible" {...register("technicalResponsible")} />
                  {errors.technicalResponsible && <p className="text-destructive text-sm">{errors.technicalResponsible.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observations">Observações</Label>
                <Textarea id="observations" {...register("observations")} rows={3} />
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  {editingEquipment ? "Atualizar" : "Salvar"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Equipment List */}
        {equipment.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Equipamentos Cirúrgicos Cadastrados</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipamento</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Última Calibração</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipment.map((equipmentItem) => {
                    const calibrationOverdue = equipmentItem.lastCalibration && 
                      isCalibrationOverdue(equipmentItem.lastCalibration);
                    
                    return (
                      <TableRow key={equipmentItem.id}>
                        <TableCell className="font-medium">{equipmentItem.equipmentName}</TableCell>
                        <TableCell>{equipmentItem.assetCode}</TableCell>
                        <TableCell>{equipmentItem.currentLocation}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(equipmentItem.status) as any}>
                            {getStatusLabel(equipmentItem.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>{equipmentItem.technicalResponsible}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">
                                {equipmentItem.lastCalibration ? 
                                  new Date(equipmentItem.lastCalibration).toLocaleDateString('pt-BR') : 
                                  "Não informado"
                                }
                              </span>
                              {calibrationOverdue && (
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                              )}
                            </div>
                            {calibrationOverdue && (
                              <Badge variant="destructive" className="text-xs">
                                Calibração vencida
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(equipmentItem)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDelete(equipmentItem.id)}
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