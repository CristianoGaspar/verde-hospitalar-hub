// src/services/patients/createPatient.ts
import { http } from "@/api/http"; // ajuste conforme seu projeto

interface CreatePatientPayload {
  nome: string;
  data_nascimento: string;
  cpf: string;
  possui_convenio: "sim" | "nao";
  convenio_id?: number | null;
}

export const createPatient = async (data: CreatePatientPayload) => {
  const response = await http.post("/clientes", data);
  return response.data;
};
