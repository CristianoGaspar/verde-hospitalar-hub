import { http } from "@/api/http";

export const getInsuranceByPatientId = async (patientId: number) => {
  const response = await http.get(`/clients/${patientId}/insurance`);
  return response.data;
};



export const getAllInsurances = async (): Promise<string[]> => {
  const response = await http.get("/appointments/insurances");
  return response.data;
};
