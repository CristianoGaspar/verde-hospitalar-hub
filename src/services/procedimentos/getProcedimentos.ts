import { http } from "@/api/http";

export async function getAllProcedimentos(page = 1, limit = 6) {
  const response = await http.get(`/procedimentos?page=${page}&limit=${limit}`);
  return response.data;
}
