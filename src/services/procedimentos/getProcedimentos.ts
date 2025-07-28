import { http } from "@/api/http";

export const getAllProcedimentos = async () => {
  const response = await http.get("/procedimentos");
  return response.data;
};
