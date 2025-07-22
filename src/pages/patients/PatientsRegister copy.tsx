import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import HospitalLayout from "@/components/HospitalLayout";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, UserPlus } from "lucide-react";
import { createPatient } from "@/services/patients/createPatient";
import { toast, useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const schema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  data_nascimento: z.string().min(1, "Data de nascimento é obrigatória"),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido"),
  possui_convenio: z.enum(["sim", "nao"]),
  convenio_id: z.union([z.string().min(1), z.literal("")])
    .transform(val => val === "" ? null : Number(val))
    .refine(val => val === null || !isNaN(val), {
      message: "Convênio inválido",
    }),
    
});

type PatientForm = z.infer<typeof schema>;

export default function PatientsRegister() {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<PatientForm>({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();

  const { toast } = useToast(); // 👈 ESTE AQUI

  const onSubmit = async (data: PatientForm) => {
    try {
      const payload = {
        nome: data.nome,
        data_nascimento: data.data_nascimento,
        cpf: data.cpf,
        possui_convenio: data.possui_convenio,
        convenio_id: data.convenio_id,
      };
      await createPatient(payload);
      toast({
        title: "Paciente cadastrado com sucesso!",
        description: "O paciente foi salvo no sistema.",
      });
        setTimeout(() => navigate("/patients"), 5000);
      //navigate("/patients");
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert("Erro ao cadastrar paciente.");
    }
       
  };

  return (
    <HospitalLayout currentPage="pacientes" onPageChange={() => { }}>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/patients">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-hospital-dark">Cadastro de Pacientes</h1>
            <p className="text-muted-foreground">Apenas campos esperados pelo backend</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Nome</Label>
            <Input {...register("nome")} />
            {errors.nome && <p className="text-destructive text-sm">{errors.nome.message}</p>}
          </div>

          <div>
            <Label>Data de Nascimento</Label>
            <Input type="date" {...register("data_nascimento")} />
            {errors.data_nascimento && <p className="text-destructive text-sm">{errors.data_nascimento.message}</p>}
          </div>

          <div>
            <Label>CPF</Label>
            <Input {...register("cpf")} />
            {errors.cpf && <p className="text-destructive text-sm">{errors.cpf.message}</p>}
          </div>

          <div>
            <Label>Possui Convênio</Label>
            <Select onValueChange={value => setValue("possui_convenio", value)} defaultValue={watch("possui_convenio") || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Sim</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
                              <Select onValueChange={(value) => setValue("possui_convenio", value as "active" | "inactive")}>
                    <SelectTrigger><SelectValue placeholder="Selecione o status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
            {errors.possui_convenio && <p className="text-destructive text-sm">{errors.possui_convenio.message}</p>}
          </div>

          <div>
            <Label>ID do Convênio</Label>
            <Input type="number" {...register("convenio_id")} />
            {errors.convenio_id && <p className="text-destructive text-sm">{errors.convenio_id.message}</p>}
          </div>

          <Button type="submit" className="bg-hospital-primary hover:bg-hospital-dark">
            <UserPlus className="h-4 w-4 mr-2" />Salvar
          </Button>
        </form>
      </div>
    </HospitalLayout>
  );
}
