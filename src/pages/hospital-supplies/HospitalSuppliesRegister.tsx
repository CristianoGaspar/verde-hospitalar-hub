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
import { ArrowLeft, Package, Trash2, Edit, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const hospitalSupplySchema = z.object({
  itemName: z.string().min(1, "Nome do item é obrigatório"),
  category: z.string().min(1, "Categoria é obrigatória"),
  stockQuantity: z.string().min(1, "Quantidade em estoque é obrigatória"),
  unit: z.string().min(1, "Unidade de medida é obrigatória"),
  minStock: z.string().min(1, "Estoque mínimo é obrigatório"),
  storageLocation: z.string().min(1, "Local de armazenamento é obrigatório"),
  supplier: z.string().min(1, "Fornecedor é obrigatório"),
});

type HospitalSupplyForm = z.infer<typeof hospitalSupplySchema>;

interface HospitalSupply extends HospitalSupplyForm {
  id: string;
}

const categories = [
  "Curativo",
  "Seringa",
  "Luva",
  "Gaze",
  "Algodão",
  "Atadura",
  "Cateter",
  "Sonda",
  "Agulha",
  "Termômetro",
];

const units = [
  "Unidade",
  "Caixa",
  "Pacote",
  "Frasco",
  "Ampola",
  "Tubo",
  "Kit",
  "Rolo",
];

export default function HospitalSuppliesRegister() {
  const [supplies, setSupplies] = useState<HospitalSupply[]>([]);
  const [editingSupply, setEditingSupply] = useState<HospitalSupply | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<HospitalSupplyForm>({
    resolver: zodResolver(hospitalSupplySchema),
  });

  const onSubmit = (data: HospitalSupplyForm) => {
    if (editingSupply) {
      setSupplies(prev => prev.map(s => s.id === editingSupply.id ? { ...data, id: editingSupply.id } : s));
      toast({ title: "Material hospitalar atualizado com sucesso!" });
      setEditingSupply(null);
    } else {
      const newSupply: HospitalSupply = { ...data, id: Date.now().toString() };
      setSupplies(prev => [...prev, newSupply]);
      toast({ title: "Material hospitalar cadastrado com sucesso!" });
    }
    reset();
  };

  const handleEdit = (supply: HospitalSupply) => {
    setEditingSupply(supply);
    Object.entries(supply).forEach(([key, value]) => {
      setValue(key as keyof HospitalSupplyForm, value);
    });
  };

  const handleDelete = (id: string) => {
    setSupplies(prev => prev.filter(s => s.id !== id));
    toast({ title: "Material hospitalar removido com sucesso!" });
  };

  const handleCancel = () => {
    reset();
    setEditingSupply(null);
  };

  const isLowStock = (current: string, minimum: string) => {
    return parseInt(current) <= parseInt(minimum);
  };

  const getStockStatus = (current: string, minimum: string) => {
    const currentQty = parseInt(current);
    const minQty = parseInt(minimum);
    
    if (currentQty === 0) return { label: "Sem estoque", variant: "destructive" as const };
    if (currentQty <= minQty) return { label: "Estoque baixo", variant: "secondary" as const };
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
            <h1 className="text-3xl font-bold text-primary">Cadastro de Material Hospitalar</h1>
            <p className="text-muted-foreground">Gerencie o estoque de materiais hospitalares</p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {editingSupply ? "Editar Material" : "Novo Material"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="itemName">Nome do Item *</Label>
                  <Input id="itemName" {...register("itemName")} />
                  {errors.itemName && <p className="text-destructive text-sm">{errors.itemName.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select onValueChange={(value) => setValue("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-destructive text-sm">{errors.category.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stockQuantity">Quantidade em Estoque *</Label>
                  <Input id="stockQuantity" type="number" {...register("stockQuantity")} />
                  {errors.stockQuantity && <p className="text-destructive text-sm">{errors.stockQuantity.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Unidade de Medida *</Label>
                  <Select onValueChange={(value) => setValue("unit", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a unidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.unit && <p className="text-destructive text-sm">{errors.unit.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minStock">Estoque Mínimo *</Label>
                  <Input id="minStock" type="number" {...register("minStock")} />
                  {errors.minStock && <p className="text-destructive text-sm">{errors.minStock.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storageLocation">Local de Armazenamento *</Label>
                  <Input id="storageLocation" placeholder="ex: Almoxarifado - Setor A" {...register("storageLocation")} />
                  {errors.storageLocation && <p className="text-destructive text-sm">{errors.storageLocation.message}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="supplier">Fornecedor *</Label>
                  <Input id="supplier" {...register("supplier")} />
                  {errors.supplier && <p className="text-destructive text-sm">{errors.supplier.message}</p>}
                </div>
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
              <CardTitle>Materiais Hospitalares Cadastrados</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supplies.map((supply) => {
                    const stockStatus = getStockStatus(supply.stockQuantity, supply.minStock);
                    const lowStock = isLowStock(supply.stockQuantity, supply.minStock);
                    
                    return (
                      <TableRow key={supply.id}>
                        <TableCell className="font-medium">{supply.itemName}</TableCell>
                        <TableCell>{supply.category}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{supply.stockQuantity}</span>
                            {lowStock && <AlertTriangle className="h-4 w-4 text-destructive" />}
                            <Badge variant={stockStatus.variant}>
                              {stockStatus.label}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Mín: {supply.minStock}
                          </div>
                        </TableCell>
                        <TableCell>{supply.unit}</TableCell>
                        <TableCell>{supply.supplier}</TableCell>
                        <TableCell className="text-sm">{supply.storageLocation}</TableCell>
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