import { http } from "@/api/http";

export const getPatients = async () => {
  const response = await http.get("/patients");
  return response.data;
};
