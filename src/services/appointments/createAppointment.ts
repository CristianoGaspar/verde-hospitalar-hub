// src/services/appointments/createAppointment.ts
import { http } from "@/api/http";

export const createAppointment = async (data: any) => {
  const response = await http.post("/appointments", data);
  return response.data;
};
