import { useEffect, useState } from "react";

type Usuario = {
  id: number;
  nome: string;
  sobrenome: string;
  cpf: string;
  data_nascimento: string;
  cargo: string;
  perfil: string;
  ativo: number;
  data_criacao: string;
  data_inativacao: string | null;
};

const UsersView = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/usuarios")
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((err) => console.error("Erro ao buscar usuários:", err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Usuários do Sistema</h1>
      <table className="w-full border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Nome</th>
            <th className="border p-2">Sobrenome</th>
            <th className="border p-2">CPF</th>
            <th className="border p-2">Nascimento</th>
            <th className="border p-2">Cargo</th>
            <th className="border p-2">Perfil</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Data Cadastro</th>
            <th className="border p-2">Inativação</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td className="border p-2">{usuario.nome}</td>
              <td className="border p-2">{usuario.sobrenome}</td>
              <td className="border p-2">{usuario.cpf}</td>
              <td className="border p-2">{usuario.data_nascimento}</td>
              <td className="border p-2">{usuario.cargo}</td>
              <td className="border p-2">{usuario.perfil}</td>
              <td className="border p-2">{usuario.ativo === 0 ? "Ativo" : "Inativo"}</td>
              <td className="border p-2">{new Date(usuario.data_criacao).toLocaleString()}</td>
              <td className="border p-2">
                {usuario.data_inativacao
                  ? new Date(usuario.data_inativacao).toLocaleString()
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersView;
