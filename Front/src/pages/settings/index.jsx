export const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-blue-700 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Configurações</h1>

      <div className="bg-white text-black rounded-lg shadow-md p-6 max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">Informações Pessoais</h2>

        <form className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Nome completo</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              placeholder="Digite seu nome"
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
            <label className="block mb-1 font-medium">E-mail</label>
            <input
              type="email"
              className="w-full border rounded p-2"
              placeholder="email@exemplo.com"
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            Salvar
          </button>
        </form>
      </div>
    </div>
  );
};
