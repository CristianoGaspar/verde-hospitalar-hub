import { http } from "@/api/http";

export async function getPendingAppointmentsCount() {
  const response = await http.get("/appointments/count/pending");
  return response.data.total;
}

export async function getAppointmentsConfirmed() {
  const response = await http.get("/appointments/count/confirmed");
  return response.data.total;
}

export async function getAppointmentsCancelled() {
  const response = await http.get("/appointments/count/cancelled");
  return response.data.total;
}