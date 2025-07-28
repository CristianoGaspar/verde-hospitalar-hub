import { http } from "@/api/http";

export async function createReconsultationRequest(payload: any) {
  const response = await http.post("/doctors/reconsultas", payload);
  return response.data;
}
