// src/services/faturamento/getFaturamento.ts
import { http } from "@/api/http";

export const buscarFaturamentoPorData = async (dataInicio: string, dataFim: string) => {
  const response = await http.get("/faturamento-consulta", {
    params: { dataInicio: dataInicio, dataFim: dataFim }
  });
  return response.data;
};
