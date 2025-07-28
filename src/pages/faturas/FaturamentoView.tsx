import { useState } from "react";
import HospitalLayout from "@/components/HospitalLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { buscarFaturamentoPorData } from "@/services/faturamento/getFaturamento";

const FaturamentoView = () => {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [faturas, setFaturas] = useState([]);
  const [loading, setLoading] = useState(false);

 const buscarFaturamento = async () => {
    if (!dataInicio || !dataFim) {
      alert("Por favor, preencha as datas inicial e final.");
      return;
    }

    setLoading(true);
    try {
        
      const dados = await buscarFaturamentoPorData(dataInicio,dataFim ); //
      console.log("data inicio",dataInicio)
      setFaturas(dados);
      console.log("teste",dados)
    } catch (error) {
      console.error("Erro ao buscar faturamento:", error);
      alert("Erro ao buscar dados de faturamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <HospitalLayout currentPage="faturamento" onPageChange={() => {}}>
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold text-hospital-dark">
          Faturamento de Consultas
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Data Inicial</Label>
            <Input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </div>
          <div>
            <Label>Data Final</Label>
            <Input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </div>
        </div>

        <Button
          onClick={buscarFaturamento}
          className="bg-hospital-primary hover:bg-hospital-dark"
        >
          Buscar
        </Button>

        <div className="mt-8">
          {loading ? (
            <p className="text-gray-500">Carregando dados...</p>
          ) : faturas.length === 0 ? (
            <p className="text-gray-500">Nenhuma fatura encontrada.</p>
          ) : (
            <table className="w-full text-sm border-collapse border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-left">Paciente</th>
                  <th className="border p-2 text-left">Médico</th>
                  <th className="border p-2 text-left">Convênio</th>
                  <th className="border p-2 text-left">Valor</th>
                  <th className="border p-2 text-left">Data da Fatura</th>
                </tr>
              </thead>
              <tbody>
                {faturas.map((f: any) => (
                  <tr key={f.id}>
                    <td className="border p-2">{f.nome_paciente}</td>
                    <td className="border p-2">{f.nome_medico}</td>
                    <td className="border p-2">{f.nome_convenio}</td>
                    <td className="border p-2">
                      R$ {Number(f.valor_fatura).toFixed(2)}
                    </td>
                    <td className="border p-2">
                      {new Date(f.data_fatura).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </HospitalLayout>
  );
};

export default FaturamentoView;
