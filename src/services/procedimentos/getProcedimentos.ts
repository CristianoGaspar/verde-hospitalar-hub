import { http } from "@/api/http";


type Params = {
  page?: number;
  limit?: number;
  orderBy?: string;
  statusFilter?: string;
  tipo?: string | null;
};

export async function getProcedimentos(params: Params = {}) {
  const { page = 1, limit = 6, orderBy, statusFilter, tipo } = params;

  const query = new URLSearchParams();
  query.append("page", String(page));
  query.append("limit", String(limit));
  if (orderBy) query.append("orderBy", orderBy);
  if (statusFilter) query.append("statusFilter", statusFilter);
  if (tipo) query.append("tipo", tipo);

  const response = await http.get(`/procedimentos?${query.toString()}`);
  return response.data;
}