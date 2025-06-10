import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    telefone: "",
    nascimento: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.senha === form.confirmarSenha) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
      <div className="bg-[#0f172a] p-10 rounded-lg shadow-md w-full max-w-lg border border-gray-700">
        <h1 className="text-white text-2xl font-semibold text-center">
          Criar uma conta
        </h1>
        <p className="text-gray-400 text-center text-sm mb-6">
          Digite suas informações para começar
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-white block mb-1">
              Nome Completo
            </label>
            <input
              name="nome"
              type="text"
              value={form.nome}
              onChange={handleChange}
              placeholder="João Silva"
              className="w-full px-4 py-2 rounded bg-[#1e293b] text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-sm text-white block mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="nome@exemplo.com"
              className="w-full px-4 py-2 rounded bg-[#1e293b] text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white block mb-1">Senha</label>
              <input
                name="senha"
                type="password"
                value={form.senha}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-[#1e293b] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-sm text-white block mb-1">
                Confirmar Senha
              </label>
              <input
                name="confirmarSenha"
                type="password"
                value={form.confirmarSenha}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-[#1e293b] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white block mb-1">Telefone</label>
              <input
                name="telefone"
                type="tel"
                value={form.telefone}
                onChange={handleChange}
                placeholder="(11) 98765-4321"
                className="w-full px-4 py-2 rounded bg-[#1e293b] text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm text-white block mb-1">
                Data de Nascimento
              </label>
              <input
                name="nascimento"
                type="date"
                value={form.nascimento}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-[#1e293b] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition-colors"
          >
            Cadastrar
          </button>
        </form>
        <div className="text-center text-sm text-gray-400 mt-4">
          Já tem uma conta?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Entrar
          </a>
        </div>
      </div>
    </div>
  );
};
