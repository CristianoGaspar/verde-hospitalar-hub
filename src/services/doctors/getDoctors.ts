import { http } from "@/api/http";

export const getDoctors = async () => {
  const response = await http.get("/doctors");
  return response.data;
};
