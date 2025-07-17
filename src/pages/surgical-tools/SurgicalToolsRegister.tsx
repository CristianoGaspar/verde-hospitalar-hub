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
import { ArrowLeft, Scissors, Trash2, Edit } from "lucide-react";
import { Link } from "react-router-dom";

const surgicalToolSchema = z.object({
  toolName: z.string().min(1, "Nome da ferramenta é obrigatório"),
  purpose: z.string().min(1, "Finalidade é obrigatória"),
  status: z.enum(["available", "sterilizing", "damaged"]),
  associatedRoom: z.string().min(1, "Sala associada é obrigatória"),
  availableQuantity: z.string().min(1, "Quantidade disponível é obrigatória"),
  assetCode: z.string().optional(),
  lastMaintenance: z.string().optional(),
});

type SurgicalToolForm = z.infer<typeof surgicalToolSchema>;

interface SurgicalTool extends SurgicalToolForm {
  id: string;
}

const toolStatuses = [
  { value: "available", label: "Disponível" },
  { value: "sterilizing", label: "Esterilizando" },
  { value: "damaged", label: "Danificada" },
];

const surgicalRooms = [
  "Sala Cirúrgica 1",
  "Sala Cirúrgica 2",
  "Sala Cirúrgica 3",
  "Sala Cirúrgica 4",
  "Centro Cirúrgico",
  "Sala de Emergência",
  "Bloco Obstétrico",
];

export default function SurgicalToolsRegister() {
  const [tools, setTools] = useState<SurgicalTool[]>([]);
  const [editingTool, setEditingTool] = useState<SurgicalTool | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<SurgicalToolForm>({
    resolver: zodResolver(surgicalToolSchema),
    defaultValues: {
      status: "available",
    },
  });

  const onSubmit = (data: SurgicalToolForm) => {
    if (editingTool) {
      setTools(prev => prev.map(t => t.id === editingTool.id ? { ...data, id: editingTool.id } : t));
      toast({ title: "Ferramenta cirúrgica atualizada com sucesso!" });
      setEditingTool(null);
    } else {
      const newTool: SurgicalTool = { ...data, id: Date.now().toString() };
      setTools(prev => [...prev, newTool]);
      toast({ title: "Ferramenta cirúrgica cadastrada com sucesso!" });
    }
    reset();
  };

  const handleEdit = (tool: SurgicalTool) => {
    setEditingTool(tool);
    Object.entries(tool).forEach(([key, value]) => {
      setValue(key as keyof SurgicalToolForm, value);
    });
  };

  const handleDelete = (id: string) => {
    setTools(prev => prev.filter(t => t.id !== id));
    toast({ title: "Ferramenta cirúrgica removida com sucesso!" });
  };

  const handleCancel = () => {
    reset();
    setEditingTool(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "default";
      case "sterilizing": return "secondary";
      case "damaged": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    return toolStatuses.find(s => s.value === status)?.label || status;
  };

  const isMaintenanceOverdue = (lastMaintenance: string) => {
    if (!lastMaintenance) return false;
    const maintenanceDate = new Date(lastMaintenance);
    const today = new Date();
    const diffMonths = (today.getFullYear() - maintenanceDate.getFullYear()) * 12 + 
                       (today.getMonth() - maintenanceDate.getMonth());
    return diffMonths >= 6; // Consider overdue if 6+ months
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
            <h1 className="text-3xl font-bold text-primary">Cadastro de Ferramentas Cirúrgicas</h1>
            <p className="text-muted-foreground">Gerencie o inventário de ferramentas cirúrgicas</p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scissors className="h-5 w-5" />
              {editingTool ? "Editar Ferramenta" : "Nova Ferramenta"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="toolName">Nome da Ferramenta *</Label>
                  <Input id="toolName" {...register("toolName")} />
                  {errors.toolName && <p className="text-destructive text-sm">{errors.toolName.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select onValueChange={(value) => setValue("status", value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      {toolStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="associatedRoom">Sala Associada *</Label>
                  <Select onValueChange={(value) => setValue("associatedRoom", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a sala" />
                    </SelectTrigger>
                    <SelectContent>
                      {surgicalRooms.map((room) => (
                        <SelectItem key={room} value={room}>{room}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.associatedRoom && <p className="text-destructive text-sm">{errors.associatedRoom.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availableQuantity">Quantidade Disponível *</Label>
                  <Input id="availableQuantity" type="number" {...register("availableQuantity")} />
                  {errors.availableQuantity && <p className="text-destructive text-sm">{errors.availableQuantity.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assetCode">Código Patrimonial</Label>
                  <Input id="assetCode" {...register("assetCode")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastMaintenance">Data da Última Manutenção</Label>
                  <Input id="lastMaintenance" type="date" {...register("lastMaintenance")} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Finalidade *</Label>
                <Textarea id="purpose" {...register("purpose")} rows={3} />
                {errors.purpose && <p className="text-destructive text-sm">{errors.purpose.message}</p>}
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  {editingTool ? "Atualizar" : "Salvar"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tools List */}
        {tools.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Ferramentas Cirúrgicas Cadastradas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ferramenta</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sala</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Última Manutenção</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tools.map((tool) => {
                    const maintenanceOverdue = tool.lastMaintenance && isMaintenanceOverdue(tool.lastMaintenance);
                    
                    return (
                      <TableRow key={tool.id}>
                        <TableCell className="font-medium">{tool.toolName}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(tool.status) as any}>
                            {getStatusLabel(tool.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>{tool.associatedRoom}</TableCell>
                        <TableCell>{tool.availableQuantity}</TableCell>
                        <TableCell>{tool.assetCode || "-"}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="text-sm">
                              {tool.lastMaintenance ? 
                                new Date(tool.lastMaintenance).toLocaleDateString('pt-BR') : 
                                "Não informado"
                              }
                            </span>
                            {maintenanceOverdue && (
                              <Badge variant="destructive" className="text-xs">
                                Manutenção vencida
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(tool)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDelete(tool.id)}
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