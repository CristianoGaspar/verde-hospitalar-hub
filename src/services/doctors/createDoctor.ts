import { http } from "../../api/http";

export const createDoctor = async (data: any) => {
  console.log("📨 Enviando requisição POST para /doctors...");
  try {
    const response = await http.post("/doctors", data);
    console.log("📥 RESPOSTA RECEBIDA:", response.status, response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ ERRO AO ENVIAR:", error.message);
    if (error.response) {
      console.error("📄 Erro (body):", error.response.data);
      console.error("📊 Status:", error.response.status);
    }
    throw error;
  }
};

export const createProcedureRequest = async (data: any) => {
  console.log("🔼 Enviando payload para backend:", data);
  const response = await http.post("/procedures", data); // <-- aqui tem que ser /procedures
  return response.data;
};
