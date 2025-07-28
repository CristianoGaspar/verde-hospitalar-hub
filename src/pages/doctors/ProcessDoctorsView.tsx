
// Arquivo ajustado completo do ProcessDoctorsView.tsx

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, Trash2, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { getPatients } from "@/services/patients/getPatients";
import { getDoctors } from "@/services/doctors/getDoctors";
import { createAppointment } from "@/services/appointments/createAppointment";
import { getInsuranceByPatientId } from "@/services/patients/getInsuranceByPatientId";
import { getInsurances } from "@/services/appointments/getInsurances";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import HospitalLayout from "@/components/HospitalLayout";
import { createProcedureRequest } from "@/services/doctors/createProcedureRequest";
import { createPrescriptionRequest } from "@/services/doctors/createPrescriptionRequest";
import { createReconsultationRequest } from "@/services/doctors/createReconsultationRequest";




export default function ProcessDoctorsView() {
    const [insurances, setInsurances] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
    const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
    const [tab, setTab] = useState("procedimento");

    const { toast } = useToast();

    const {
        register: registerMed,
        handleSubmit: handleSubmitMed,
        setValue: setValueMed,
        getValues: getValuesMed, // <- se quiser acessar depois
        formState: { errors: errorsMed },
    } = useForm({
        resolver: zodResolver(z.any()),
    });

    const {
        register: registerRec,
        handleSubmit: handleSubmitRec,
        setValue: setValueRec,
        getValues: getValuesRec, // <- se quiser acessar depois
        formState: { errors: errorsRec },
    } = useForm({
        resolver: zodResolver(z.any()),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm({
        resolver: zodResolver(z.any()),
    });

    useEffect(() => {
        const fetchConvenios = async () => {
            try {
                const data = await getInsurances();
                const convFormatted = data.map((nome, idx) => ({ id: idx + 1, nome }));
                setInsurances(convFormatted);
            } catch (error) {
                console.error("Erro ao buscar convênios:", error);
            }
        };

        const fetchPatients = async () => {
            try {
                const data = await getPatients();
                setPatients(data);
            } catch (err) {
                console.error("Erro ao buscar pacientes:", err);
            }
        };

        const fetchDoctors = async () => {
            try {
                const data = await getDoctors();
                setDoctors(data);
            } catch (err) {
                console.error("Erro ao buscar médicos:", err);
            }
        };

        fetchPatients();
        fetchDoctors();
        fetchConvenios();
    }, []);

    const navigate = useNavigate(); // INSTÂNCIA


    const onSubmitMed = async (data: any) => {

        const payload = {
            cod_medicamento: Number(data.cod_medicamento),
            data_receita: data.date,
            paciente_id: Number(data.idPaciente),
            medico_id: Number(data.idDoctor),
            convenio: Number(data.insurance),
            nome_medicamento: data.nome_medicamento,
            posologia: data.posologia,
            quantidade: data.quantidade,
            quantidade_dias_retorno: data.quantidade_dias_retorno,
            apresentar_exames: data.apresentar_exames,
            status: data.status
        };

        console.log("🚀 Enviando payload para backend medicamento:", payload);
        // Aqui você faria uma chamada para salvar o payload na API/backend
        try {
            if (!selectedPatientId) {
                toast({ title: "Selecione um paciente válido", variant: "destructive" });
                return;
            }

            if (!selectedDoctorId) {
                toast({ title: "Selecione um médico válido", variant: "destructive" });
                return;
            }
            const response = await createPrescriptionRequest(payload);
            toast({
                title: "Sucesso!",
                description: "Medicaento solicitado com sucesso.",
            });
            console.log("✅ Resposta do backend Medicaento:", response);
            // Você pode exibir toast de sucesso aqui se quiser
            toast({
                title: "Sucesso!",
                description: "Medicaento agendado com sucesso.",
            });


            // Espera 2 segundos para o toast aparecer antes de navegar
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log("✅ ja passei pelo toast:", response);
            navigate("/dashboard");
        } catch (error) {
            console.error("❌ Erro ao enviar procedimento:", error);
            // Você pode exibir toast de erro aqui também
        }
    };

    const onSubmitRec = async (data: any) => {

        const payload = {
            tipo_reconsulta: data.tipo_reconsulta,
            data_receita: data.date,
            paciente_id: Number(data.idPaciente),
            medico_id: Number(data.idDoctor),
            convenio: Number(data.insurance),
            quantidade: data.quantidade,
            quantidade_dias_retorno: data.quantidade_dias_retorno,
            status: data.status
        };

        console.log("🚀 Enviando payload para backend medicamento:", payload);
        // Aqui você faria uma chamada para salvar o payload na API/backend
        try {
            if (!selectedPatientId) {
                toast({ title: "Selecione um paciente válido", variant: "destructive" });
                return;
            }

            if (!selectedDoctorId) {
                toast({ title: "Selecione um médico válido", variant: "destructive" });
                return;
            }
            const response = await createReconsultationRequest(payload);
            toast({
                title: "Sucesso!",
                description: "Medicaento solicitado com sucesso.",
            });
            console.log("✅ Resposta do backend Medicaento:", response);
            // Você pode exibir toast de sucesso aqui se quiser
            toast({
                title: "Sucesso!",
                description: "Medicaento agendado com sucesso.",
            });


            // Espera 2 segundos para o toast aparecer antes de navegar
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log("✅ ja passei pelo toast:", response);
            navigate("/dashboard");
        } catch (error) {
            console.error("❌ Erro ao enviar procedimento:", error);
            // Você pode exibir toast de erro aqui também
        }
    };

    const onSubmitProc = async (data: any) => {

        const payload = {
            paciente_id: Number(data.patientName),
            medico_id: selectedDoctorId,
            procedimento_codigo: data.cid,
            nome_procedimento: data.nome_procedimento,
            nome_especialidade: data.nome_especialidade,
            tipo: data.consultationType === "surgical_procedure" ? "cirurgia" : "laboratorial",
            data_agendada: data.date,
            hora_procedimento: data.time,
            status: data.status,
            data_realizacao: null,
            convenio: Number(data.insurance),
            motivo_cancelamento: "em_aberto",
            observacoes: data.observations,
            leito: "a_definir",
        };

        console.log("🚀 Enviando payload para backend:", payload);
        // Aqui você faria uma chamada para salvar o payload na API/backend
        try {
            if (!selectedPatientId) {
                toast({ title: "Selecione um paciente válido", variant: "destructive" });
                return;
            }

            if (!selectedDoctorId) {
                toast({ title: "Selecione um médico válido", variant: "destructive" });
                return;
            }
            const response = await createProcedureRequest(payload);
            toast({
                title: "Sucesso!",
                description: "Procedimento agendado com sucesso.",
            });
            console.log("✅ Resposta do backend:", response);
            // Você pode exibir toast de sucesso aqui se quiser
            toast({
                title: "Sucesso!",
                description: "Procedimento agendado com sucesso.",
            });


            // Espera 2 segundos para o toast aparecer antes de navegar
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log("✅ ja passei pelo toast:", response);
            navigate("/dashboard");
        } catch (error) {
            console.error("❌ Erro ao enviar procedimento:", error);
            // Você pode exibir toast de erro aqui também
        }
    };

    const consultationTypes = [
        { value: "surgical_procedure", label: "Procedimento cirúrgico" },
        { value: "laboratory_procedure", label: "Procedimento laboratorial" },
    ];

    const statusOptions = [
        { value: "agendado", label: "Emergência" },
        { value: "cancelado", label: "Urgência" },
        { value: "pendente", label: "Eletivo" },
        { value: "em espera", label: "Em espera" },
        { value: "a confirmar", label: "A confirmar" },
    ];

    return (
        <HospitalLayout currentPage="process" onPageChange={() => { }}>
            <div className="p-6 w-full">

                <Card className="w-full shadow-md border">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-primary">
                            Requisições Médicas
                        </CardTitle>
                        <CardDescription>
                            Selecione a ação médica para o paciente após a consulta.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={tab} onValueChange={setTab} className="space-y-4">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="procedimento" className={tab === "procedimento" ? "bg-blue-100" : ""}>Procedimento</TabsTrigger>
                                <TabsTrigger value="medicamento" className={tab === "medicamento" ? "bg-blue-100" : ""}>Medicamento</TabsTrigger>
                                <TabsTrigger value="reconsulta" className={tab === "reconsulta" ? "bg-blue-100" : ""}>Reconsulta</TabsTrigger>
                            </TabsList>

                            <TabsContent value="procedimento">
                                <form onSubmit={handleSubmit(onSubmitProc)}>
                                    <div className="grid gap-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="font-bold" >Procedimento</Label>
                                                <Input {...register("nome_procedimento")} placeholder="Ex: Raio-X" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold" >CID</Label>
                                                <Input {...register("cid")} placeholder="Ex: 10101012" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="font-bold" >Especialidade</Label>
                                                <Input {...register("nome_especialidade")} placeholder="Ex: Cardiologia" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold" >Dias Recuperação/Internação</Label>
                                                <Input placeholder="Ex: 3" type="number" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="font-bold" htmlFor="patientName">Paciente *</Label>
                                                <Select onValueChange={(value) => {
                                                    const selected = patients.find(p => p.cliente_id === Number(value));
                                                    setSelectedPatientId(selected?.cliente_id ?? null);
                                                    setValue("patientName", value);
                                                }}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o paciente" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {patients.map((patient) => (
                                                            <SelectItem key={patient.cliente_id} value={patient.cliente_id.toString()}>
                                                                {patient.nome_cliente}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="font-bold" htmlFor="doctorName">Médico *</Label>
                                                <Select onValueChange={(value) => {
                                                    const doctor = doctors.find(d => d.full_name === value);
                                                    setSelectedDoctorId(doctor?.id ?? null);
                                                    setValue("doctorName", value);
                                                }}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o médico" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {doctors.map((doctor) => (
                                                            <SelectItem key={doctor.id} value={doctor.full_name}>
                                                                {doctor.full_name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="font-bold" htmlFor="date">Data da Consulta *</Label>
                                                <Input id="date" type="date" {...register("date")} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="font-bold" htmlFor="time">Horário *</Label>
                                                <Input id="time" type="time" {...register("time")} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="font-bold" htmlFor="insurance">Convênio *</Label>
                                                <Select onValueChange={(value) => setValue("insurance", value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o convênio" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {insurances.map((insurance) => (
                                                            <SelectItem key={`conv-${insurance.id}`} value={insurance.id.toString()}>
                                                                {insurance.nome}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="font-bold" htmlFor="consultationType">Tipo de Procedimento *</Label>
                                                <Select onValueChange={(value) => setValue("consultationType", value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o tipo" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {consultationTypes.map((type) => (
                                                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="font-bold" htmlFor="status">Prioridade *</Label>
                                                <Select onValueChange={(value) => setValue("status", value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {statusOptions.map((status) => (
                                                            <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <Label className="font-bold" >Observações</Label>
                                        <Textarea placeholder="Informações adicionais" {...register("observations")} />

                                        <Button className="w-full mt-4" onClick={handleSubmit(onSubmitProc)}>
                                            Encaminhar Procedimento
                                        </Button>
                                    </div>
                                </form>
                            </TabsContent>

                            <TabsContent value="medicamento" >
                                <form onSubmit={handleSubmitMed(onSubmitMed)}>
                                    <div className="grid gap-4">

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="font-bold" >Medicamento</Label>
                                                <Select onValueChange={(value) => setValueMed("nome_medicamento", value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o medicamento" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="dipirona">Dipirona</SelectItem>
                                                        <SelectItem value="ibuprofeno">Ibuprofeno</SelectItem>
                                                        <SelectItem value="amoxicilina">Amoxicilina</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold" >Codigo medicamento</Label>
                                                <Input {...registerMed("cod_medicamento")} placeholder="Ex: 1234-0" />
                                            </div>
                                        </div>

                                        <Label className="font-bold" >Posologia</Label>
                                        <Input {...registerMed("posologia")} placeholder="Ex: 1 comprimido de 8 em 8h" />

                                        <Label className="font-bold" >Quantidade</Label>
                                        <Input {...registerMed("quantidade")} type="number" placeholder="Ex: 10" />


                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="font-bold" htmlFor="patientName">Paciente *</Label>
                                                <Select onValueChange={(value) => {
                                                    const selected = patients.find(p => p.cliente_id === Number(value));
                                                    setSelectedPatientId(selected?.cliente_id ?? null);
                                                    setValueMed("idPaciente", value); // ✅ garantir que vai para react-hook-form
                                                }}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o paciente" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {patients.map((patient) => (
                                                            <SelectItem key={patient.cliente_id} value={patient.cliente_id.toString()}>
                                                                {patient.nome_cliente}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.patientName?.message && (
                                                    <p className="text-destructive text-sm">{String(errors.patientName.message)}</p>
                                                )}

                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold" htmlFor="doctorName">Médico *</Label>
                                                <Select onValueChange={(value) => {
                                                    const doctor = doctors.find(d => d.full_name === value);
                                                    setSelectedDoctorId(doctor?.id ?? null);
                                                    setValueMed("idDoctor", doctor?.id?.toString() ?? ""); // ✅ setar o ID corretamente
                                                }}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o médico" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {doctors.map((doctor) => (
                                                            <SelectItem key={doctor.id} value={doctor.full_name}>
                                                                {doctor.full_name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="font-bold" htmlFor="doctorName">Convênio *</Label>
                                                <Select onValueChange={(value) => setValueMed("insurance", value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o convênio" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {insurances.map((insurance) => (
                                                            <SelectItem key={`conv-${insurance.id}`} value={insurance.id}>
                                                                {insurance.nome}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.doctorName?.message && (<p className="text-destructive text-sm">{String(errors.doctorName.message)}</p>)}

                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="font-bold" >Quantidade de dias para retorno</Label>
                                                <Input {...registerMed("quantidade_dias_retorno")} type="number" placeholder="Ex: 10" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold" >Trazer exames</Label>
                                                <Select onValueChange={(value) => setValueMed("apresentar_exames", value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecionar obs" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="sim">Sim</SelectItem>
                                                        <SelectItem value="nao">Não</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="font-bold" htmlFor="date">Data da Receita *</Label>
                                                <Input id="date" type="date" {...registerMed("date")} />

                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold" >Status de Receita</Label>
                                                <Select onValueChange={(value) => setValueMed("status", value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecionar obs" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="receita_indicada"> Receita Indicada</SelectItem>
                                                        <SelectItem value="receita_entregue"> Receita Entregue</SelectItem>
                                                        <SelectItem value="receita_fora_prazo"> Receita Fora prazo</SelectItem>
                                                        <SelectItem value="receita_em_espera"> Receita em Espera</SelectItem>
                                                        <SelectItem value="receita_retorno"> Receita Retorno </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                        </div>
                                        <Label className="font-bold" >Observações</Label>
                                        <Textarea placeholder="Informações adicionais" {...register("observacoes")} />
                                        <Button className="w-full mt-4" type="submit">Receitar Medicamento</Button>
                                    </div>
                                </form>
                            </TabsContent>


                            <TabsContent value="reconsulta">
                                <form onSubmit={handleSubmitRec(onSubmitRec)}>
                                    <div className="grid gap-4">
                                        <Label className="font-bold" >Tipo de Reconsulta</Label>
                                        <Select onValueChange={(value) => setValueRec("tipo_reconsulta", value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="unica">Única</SelectItem>
                                                <SelectItem value="recorrente">Recorrente</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Label className="font-bold" >Quantidade (se recorrente)</Label>
                                        <Input type="number" {...registerRec("quantidade")} placeholder="Ex: 3" />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="font-bold" htmlFor="patientName">Paciente *</Label>
                                                <Select onValueChange={(value) => {
                                                    const selected = patients.find(p => p.cliente_id === Number(value));
                                                    setSelectedPatientId(selected?.cliente_id ?? null);
                                                    setValueRec("idPaciente", value); // ✅ garantir que vai para react-hook-form
                                                }}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o paciente" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {patients.map((patient) => (
                                                            <SelectItem key={patient.cliente_id} value={patient.cliente_id.toString()}>
                                                                {patient.nome_cliente}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.patientName?.message && (
                                                    <p className="text-destructive text-sm">{String(errors.patientName.message)}</p>
                                                )}

                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold" htmlFor="doctorName">Médico *</Label>
                                                <Select onValueChange={(value) => {
                                                    const doctor = doctors.find(d => d.full_name === value);
                                                    setSelectedDoctorId(doctor?.id ?? null);
                                                    setValueRec("idDoctor", doctor?.id?.toString() ?? ""); // ✅ setar o ID corretamente
                                                }}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o médico" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {doctors.map((doctor) => (
                                                            <SelectItem key={doctor.id} value={doctor.full_name}>
                                                                {doctor.full_name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2"><Label className="font-bold">Data da Receita</Label>
                                                    <Input type="date" {...registerRec("date")} />
                                                </div>
                                               <div className="space-y-2">
  <Label className="font-bold" htmlFor="insurance">Convênio *</Label>
  <Select
    onValueChange={(value) => setValueRec("insurance", value)}
  >
    <SelectTrigger>
      <SelectValue
        placeholder="Selecione o convênio"
        defaultValue={getValuesRec("insurance")}
      />
    </SelectTrigger>
    <SelectContent>
      {insurances.map((insurance) => (
        <SelectItem
          key={`conv-${insurance.id}`}
          value={insurance.id.toString()}
        >
          {insurance.nome}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>


                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="font-bold" >Quantidade de dias para retorno</Label>
                                                    <Input {...registerRec("quantidade_dias_retorno")} type="number" placeholder="Ex: 10" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold">Status da Reconsulta</Label>
                                                    <Select onValueChange={(value) => setValueRec("status", value)}>
                                                        <SelectTrigger><SelectValue placeholder="Selecione o status" /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="reconsulta_indicada">Reconsulta Indicada</SelectItem>
                                                            <SelectItem value="reconsulta_confirmada">Reconsulta Confirmada</SelectItem>
                                                            <SelectItem value="reconsulta_cancelada">Reconsulta Cancelada</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                        <Label className="font-bold">Observações</Label>
                                        <Textarea {...registerRec("observacoes")} placeholder="Detalhes adicionais" />


                                        <Button className="w-full mt-4">Agendar Reconsulta(s)</Button>
                                    </div>
                                </form>
                            </TabsContent>

                        </Tabs>
                    </CardContent>
                </Card>

            </div>
        </HospitalLayout>
    );
}
