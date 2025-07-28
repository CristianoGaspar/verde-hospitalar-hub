// src/services/appointments/getConsultasAgendadas.ts

import { http } from "@/api/http"; // Ajuste para seu cliente HTTP

export const getConsultasAgendadas = async () => {
  const response = await http.get("/appointments/consultas-agendadas");
  return response.data;
};
