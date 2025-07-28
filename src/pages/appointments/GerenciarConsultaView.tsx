import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import HospitalLayout from "@/components/HospitalLayout";
import {
  getAppointmentById,
  updateAppointment,
} from "@/services/appointments/editAppointment";

const GerenciarConsultaView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [status, setStatus] = useState("");
  const [novaData, setNovaData] = useState("");
  const [motivo, setMotivo] = useState("");

  useEffect(() => {
    async function fetchData() {
      const data = await getAppointmentById(id);
      setAppointment(data);
      setStatus(data.status);
      setMotivo(data.observacoes || "");
    }
    fetchData();
  }, [id]);

  const handleSave = async () => {
    if (!motivo.trim()) {
      alert("Motivo é obrigatório.");
      return;
    }

    const body = {
      status,
      nova_data: status === "remarcada" ? novaData : null,
      motivo,
      consulta_finalizada:
        status === "realizada" || status === "cancelada"
          ? new Date().toISOString()
          : null,
    };

    try {
      await updateAppointment(id, body);
      alert("Consulta atualizada com sucesso!");
      navigate("/appointments");
    } catch (err) {
      console.error("Erro ao salvar consulta:", err);
      alert("Erro ao salvar. Tente novamente.");
    }
  };

  if (!appointment) return <div>Carregando...</div>;

  return (
    <HospitalLayout currentPage="agendamentos" onPageChange={() => {}}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-hospital-dark">Gerenciar Consulta</h1>
            <p className="text-muted-foreground">Atualize as informações da consulta</p>
          </div>
          <Button onClick={() => navigate("/appointments")} className="bg-hospital-primary">
            Voltar
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Status da Consulta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="confirmada">Confirmada</SelectItem>
                <SelectItem value="realizada">Realizada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
                <SelectItem value="remarcada">Remarcada</SelectItem>
              </SelectContent>
            </Select>

            {status === "remarcada" && (
              <div>
                <Input
                  type="datetime-local"
                  value={novaData}
                  onChange={(e) => setNovaData(e.target.value)}
                />
              </div>
            )}

            <div>
              <Textarea
                placeholder="Motivo da alteração..."
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
              />
            </div>

            <Button onClick={handleSave} className="bg-hospital-primary w-full">
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>
      </div>
    </HospitalLayout>
  );
};

export default GerenciarConsultaView;
