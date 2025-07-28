import { http } from "@/api/http";

export async function createPrescriptionRequest(data: any) {
  const response = await http.post("/doctors/prescriptions", data);
  return response.data;
}
