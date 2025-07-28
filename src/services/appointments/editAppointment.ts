import { http } from "@/api/http";

// Buscar uma consulta por ID
export async function getAppointmentById(id: string) {
  const response = await http.get(`/appointments/${id}`);
  return response.data;
}

// Atualizar uma consulta
export async function updateAppointment(id: string, payload: any) {
  const response = await http.put(`/appointments/${id}`, payload);
  return response.data;
}
