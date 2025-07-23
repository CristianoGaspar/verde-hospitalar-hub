import { http } from "@/api/http";




export const getInsurances = async () => {
  const response = await http.get("/appointments/insurances");
  return response.data;
};
