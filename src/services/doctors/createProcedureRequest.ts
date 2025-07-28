import { http } from "@/api/http";

export const createProcedureRequest = async (data: any) => {
  console.log("🔼 Enviando payload para backend:", data);
  const response = await http.post("/doctors/procedimento", data);
  return response.data;
};