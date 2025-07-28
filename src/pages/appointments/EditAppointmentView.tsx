import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import HospitalLayout from "@/components/HospitalLayout";
import { getAppointmentById, updateAppointment } from "@/services/appointments/editAppointment";

const EditAppointmentView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState(null);
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm();

    const status = watch("status");

useEffect(() => {
    register("status", { required: true });

    const fetchAppointment = async () => {
        const data = await getAppointmentById(id);
        setAppointment(data);

        setValue("status", data.status);
        setValue("nova_data", "");
        setValue("motivo", data.motivo_cancelamento || "");
    };

    fetchAppointment();
}, [id, setValue, register]);


const onSubmit = async (formData) => {
    // Captura o status corretamente mesmo se não foi alterado no Select
    const status = formData.status || watch("status");

    const payload = {
        status: status,
        data_finalizacao:
            ["realizada", "cancelada", "confirmada"].includes(status)
                ? new Date().toISOString()
                : status === "remarcada"
                ? formData.nova_data || null
                : null,
        motivo_cancelamento: formData.motivo,
        consulta_finalizada:
            ["realizada", "cancelada", "confirmada","finalizada"].includes(status)
                ? new Date().toISOString()
                : null,
    };

    try {
        console.log("Payload enviado:", { id, payload }); // log claro
        await updateAppointment(id, payload);
        alert("Consulta atualizada com sucesso!");
        navigate("/appointments");
    } catch (error) {
        console.error("Erro ao atualizar:", error);
        alert("Erro ao atualizar a consulta. Tente novamente.");
    }
};


    if (!appointment) return <div>Carregando...</div>;

    return (
        <HospitalLayout currentPage="agendamentos" onPageChange={() => { }}>
            <div className="max-w-2xl mx-auto mt-6 p-4 space-y-6">
                <h1 className="text-2xl font-bold text-hospital-dark">Gerenciar Consulta</h1>

                <Button variant="secondary" onClick={() => navigate("/appointments")}>
                    Voltar
                </Button>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label>Status da Consulta</Label>
                        <Select
                            onValueChange={(value) => setValue("status", value)}
                            defaultValue={appointment.status}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="confirmada">Confirmada</SelectItem>
                                <SelectItem value="realizada">Realizada</SelectItem>
                                <SelectItem value="cancelada">Cancelada</SelectItem>
                                <SelectItem value="remarcada">Remarcada</SelectItem>
                                <SelectItem value="finalizada">Finalizada</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {status === "remarcada" && (
                        <div>
                            <Label>Qual a nova data de Agendamento da consulta??</Label>
                            <Input
                                type="datetime-local"
                                {...register("nova_data", {
                                    required: status === "remarcada" ? "Informe a nova data" : false,
                                })}
                            />
                            {errors.nova_data && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.nova_data.message?.toString()}
                                </p>
                            )}
                        </div>
                    )}

                    <div>
                        <Label>Motivo</Label>
                        <Textarea
                            placeholder="Descreva o motivo da alteração"
                            {...register("motivo", { required: "Motivo é obrigatório" })}
                        />
                        {errors.motivo && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.motivo.message?.toString()}
                            </p>
                        )}
                    </div>

                    <Button type="submit" className="bg-hospital-primary hover:bg-hospital-dark">
                        Salvar Alterações
                    </Button>
                </form>
            </div>
        </HospitalLayout>
    );
};

export default EditAppointmentView;
