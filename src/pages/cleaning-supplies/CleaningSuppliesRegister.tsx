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
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Droplets, Trash2, Edit, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const cleaningSupplySchema = z.object({
  productName: z.string().min(1, "Nome do produto é obrigatório"),
  type: z.string().min(1, "Tipo é obrigatório"),
  recommendedUse: z.string().min(1, "Uso recomendado é obrigatório"),
  sectors: z.array(z.string()).min(1, "Selecione pelo menos um setor"),
  stockQuantity: z.string().min(1, "Quantidade em estoque é obrigatória"),
  replenishmentFrequency: z.string().min(1, "Frequência de reposição é obrigatória"),
  supplier: z.string().min(1, "Fornecedor é obrigatório"),
});

type CleaningSupplyForm = z.infer<typeof cleaningSupplySchema>;

interface CleaningSupply extends CleaningSupplyForm {
  id: string;
}

const productTypes = [
  "Desinfetante",
  "Sabão",
  "Álcool",
  "Detergente",
  "Água sanitária",
  "Desodorizante",
  "Removedor",
  "Cera",
];

const hospitalSectors = [
  { id: "emergency", label: "Emergência" },
  { id: "surgery", label: "Centro Cirúrgico" },
  { id: "icu", label: "UTI" },
  { id: "pediatrics", label: "Pediatria" },
  { id: "maternity", label: "Maternidade" },
  { id: "cardiology", label: "Cardiologia" },
  { id: "orthopedics", label: "Ortopedia" },
  { id: "reception", label: "Recepção" },
  { id: "corridors", label: "Corredores" },
  { id: "bathrooms", label: "Banheiros" },
];

const frequencies = [
  "Diário",
  "Semanal",
  "Quinzenal",
  "Mensal",
  "Bimestral",
  "Trimestral",
];

export default function CleaningSuppliesRegister() {
  const [supplies, setSupplies] = useState<CleaningSupply[]>([]);
  const [editingSupply, setEditingSupply] = useState<CleaningSupply | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CleaningSupplyForm>({
    resolver: zodResolver(cleaningSupplySchema),
    defaultValues: {
      sectors: [],
    },
  });

  const watchedSectors = watch("sectors");

  const onSubmit = (data: CleaningSupplyForm) => {
    if (editingSupply) {
      setSupplies(prev => prev.map(s => s.id === editingSupply.id ? { ...data, id: editingSupply.id } : s));
      toast({ title: "Material de limpeza atualizado com sucesso!" });
      setEditingSupply(null);
    } else {
      const newSupply: CleaningSupply = { ...data, id: Date.now().toString() };
      setSupplies(prev => [...prev, newSupply]);
      toast({ title: "Material de limpeza cadastrado com sucesso!" });
    }
    reset();
  };

  const handleEdit = (supply: CleaningSupply) => {
    setEditingSupply(supply);
    Object.entries(supply).forEach(([key, value]) => {
      setValue(key as keyof CleaningSupplyForm, value);
    });
  };

  const handleDelete = (id: string) => {
    setSupplies(prev => prev.filter(s => s.id !== id));
    toast({ title: "Material de limpeza removido com sucesso!" });
  };

  const handleCancel = () => {
    reset();
    setEditingSupply(null);
  };

  const handleSectorChange = (sectorId: string, checked: boolean) => {
    const currentSectors = watchedSectors || [];
    if (checked) {
      setValue("sectors", [...currentSectors, sectorId]);
    } else {
      setValue("sectors", currentSectors.filter(s => s !== sectorId));
    }
  };

  const getSectorLabels = (sectorIds: string[]) => {
    return sectorIds.map(id => hospitalSectors.find(s => s.id === id)?.label).filter(Boolean).join(", ");
  };

  const getStockStatus = (quantity: string) => {
    const qty = parseInt(quantity);
    if (qty === 0) return { label: "Sem estoque", variant: "destructive" as const };
    if (qty <= 5) return { label: "Estoque baixo", variant: "secondary" as const };
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
            <h1 className="text-3xl font-bold text-primary">Cadastro de Material de Limpeza</h1>
            <p className="text-muted-foreground">Gerencie o estoque de materiais de limpeza e higienização</p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5" />
              {editingSupply ? "Editar Material" : "Novo Material"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Nome do Produto *</Label>
                  <Input id="productName" {...register("productName")} />
                  {errors.productName && <p className="text-destructive text-sm">{errors.productName.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo *</Label>
                  <Select onValueChange={(value) => setValue("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {productTypes.map((type) => (
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
                  <Label htmlFor="replenishmentFrequency">Frequência de Reposição *</Label>
                  <Select onValueChange={(value) => setValue("replenishmentFrequency", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a frequência" />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencies.map((freq) => (
                        <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.replenishmentFrequency && <p className="text-destructive text-sm">{errors.replenishmentFrequency.message}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="supplier">Fornecedor *</Label>
                  <Input id="supplier" {...register("supplier")} />
                  {errors.supplier && <p className="text-destructive text-sm">{errors.supplier.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recommendedUse">Uso Recomendado *</Label>
                <Textarea id="recommendedUse" {...register("recommendedUse")} rows={3} />
                {errors.recommendedUse && <p className="text-destructive text-sm">{errors.recommendedUse.message}</p>}
              </div>

              <div className="space-y-3">
                <Label>Setores de Utilização *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {hospitalSectors.map((sector) => (
                    <div key={sector.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={sector.id}
                        checked={watchedSectors?.includes(sector.id) || false}
                        onCheckedChange={(checked) => handleSectorChange(sector.id, checked as boolean)}
                      />
                      <Label htmlFor={sector.id} className="text-sm">{sector.label}</Label>
                    </div>
                  ))}
                </div>
                {errors.sectors && <p className="text-destructive text-sm">{errors.sectors.message}</p>}
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  {editingSupply ? "Atualizar" : "Salvar"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Supplies List */}
        {supplies.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Materiais de Limpeza Cadastrados</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead>Reposição</TableHead>
                    <TableHead>Setores</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supplies.map((supply) => {
                    const stockStatus = getStockStatus(supply.stockQuantity);
                    
                    return (
                      <TableRow key={supply.id}>
                        <TableCell className="font-medium">{supply.productName}</TableCell>
                        <TableCell>{supply.type}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{supply.stockQuantity}</span>
                            {parseInt(supply.stockQuantity) <= 5 && (
                              <AlertTriangle className="h-4 w-4 text-destructive" />
                            )}
                            <Badge variant={stockStatus.variant}>
                              {stockStatus.label}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{supply.replenishmentFrequency}</TableCell>
                        <TableCell className="text-sm max-w-xs truncate">
                          {getSectorLabels(supply.sectors)}
                        </TableCell>
                        <TableCell>{supply.supplier}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(supply)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDelete(supply.id)}
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