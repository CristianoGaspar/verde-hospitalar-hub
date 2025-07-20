// getDoctorsCount.ts
import { http } from "@/api/http";

export const getDoctorsCount = async () => {
  const response = await http.get("/doctors/quantity");
    return response.data.total;
};
