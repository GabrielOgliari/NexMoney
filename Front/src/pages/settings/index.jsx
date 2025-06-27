export const SettingsPage = () => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#1B2232] p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Configurações</h1>
      <div className="bg-white text-black rounded-lg shadow-md p-6 w-full max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Informações Pessoais</h2>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div>
            <label className="block mb-1 font-medium">Nome completo</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              placeholder="Digite seu nome"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">E-mail</label>
            <input
              type="email"
              className="w-full border rounded p-2"
              placeholder="email@exemplo.com"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Telefone</label>
            <input
              type="tel"
              className="w-full border rounded p-2"
              placeholder="(99) 99999-9999"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Data de nascimento</label>
            <input type="date" className="w-full border rounded p-2" />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Endereço</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              placeholder="Rua, número, bairro, cidade"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Profissão</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              placeholder="Sua profissão"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Renda mensal</label>
            <input
              type="number"
              className="w-full border rounded p-2"
              placeholder="R$"
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-4 mt-4">
            <button
              type="button"
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
            >
              Salvar alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
