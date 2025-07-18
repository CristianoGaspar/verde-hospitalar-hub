// src/services/doctors/createDoctor.ts
import { http } from "../../api/http"; // ajuste o caminho relativo correto


export const createDoctor = async (data: any) => {
  const response = await http.post("/doctors", data);
  return response.data;
};
