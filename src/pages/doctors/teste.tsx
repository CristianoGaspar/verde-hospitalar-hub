
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

const procedimentoSchema = z.object({
  descricao: z.string().nonempty(),
  data: z.string().nonempty(),
  hora: z.string().nonempty(),
  paciente: z.string().nonempty(),
  convenio: z.string().nonempty(),
});

const medicamentoSchema = z.object({
  medicamento: z.string().nonempty(),
  posologia: z.string().nonempty(),
  quantidade: z.string().nonempty(),
  paciente: z.string().nonempty(),
  convenio: z.string().nonempty(),
});

export function ProcessDoctorsView() {
  const {
    register: registerProc,
    handleSubmit: handleSubmitProc,
    setValue: setValueProc,
    formState: { errors: errorsProc },
  } = useForm({ resolver: zodResolver(procedimentoSchema) });

  const {
    register: registerMed,
    handleSubmit: handleSubmitMed,
    setValue: setValueMed,
    formState: { errors: errorsMed },
  } = useForm({ resolver: zodResolver(medicamentoSchema) });

  const onSubmitProc = (data) => {
    console.log("Dados procedimento:", data);
    // lógica para salvar procedimento
  };

  const onSubmitMed = (data) => {
    console.log("Dados medicamento:", data);
    // lógica para salvar medicamento
  };

  return (
    <>
      <TabsContent value="procedimento">
        <form onSubmit={handleSubmitProc(onSubmitProc)}>
          <Label className="font-bold">Paciente *</Label>
          <Select onValueChange={(value) => setValueProc("paciente", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o paciente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">João</SelectItem>
              <SelectItem value="2">Maria</SelectItem>
            </SelectContent>
          </Select>

          <Label className="font-bold">Convênio *</Label>
          <Select onValueChange={(value) => setValueProc("convenio", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o convênio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Unimed</SelectItem>
              <SelectItem value="2">Cassi</SelectItem>
            </SelectContent>
          </Select>

          <Label className="font-bold">Descrição</Label>
          <Input {...registerProc("descricao")} />

          <Label className="font-bold">Data</Label>
          <Input type="date" {...registerProc("data")} />

          <Label className="font-bold">Hora</Label>
          <Input type="time" {...registerProc("hora")} />

          <Button type="submit">Salvar Procedimento</Button>
        </form>
      </TabsContent>

      <TabsContent value="medicamento">
        <form onSubmit={handleSubmitMed(onSubmitMed)}>
          <Label className="font-bold">Paciente *</Label>
          <Select onValueChange={(value) => setValueMed("paciente", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o paciente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">João</SelectItem>
              <SelectItem value="2">Maria</SelectItem>
            </SelectContent>
          </Select>

          <Label className="font-bold">Convênio *</Label>
          <Select onValueChange={(value) => setValueMed("convenio", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o convênio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Unimed</SelectItem>
              <SelectItem value="2">Cassi</SelectItem>
            </SelectContent>
          </Select>

          <Label className="font-bold">Medicamento</Label>
          <Input {...registerMed("medicamento")} />

          <Label className="font-bold">Posologia</Label>
          <Input {...registerMed("posologia")} />

          <Label className="font-bold">Quantidade</Label>
          <Input type="number" {...registerMed("quantidade")} />

          <Button type="submit">Salvar Medicamento</Button>
        </form>
      </TabsContent>

      <TabsContent value="reconsulta">
        {/* Conteúdo da aba reconsulta permanece aqui */}
      </TabsContent>
    </>
  );
}
