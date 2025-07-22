// getDoctorsCount.ts
import { http } from "@/api/http";

export const getClientesCount = async () => {
  const response = await http.get("/patients/quantity");
    return response.data.total;
};
