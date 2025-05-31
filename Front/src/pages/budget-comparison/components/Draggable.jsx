// Estilo basico de um item arrastavel
export const Draggable = ({ item }) => {
  return (
    <div className="border border-white rounded-lg p-4 bg-[#1B2232] text-white mb-2">
      <p className="text-lg font-bold">{item.name}</p>
      <p className="text-sm">
        {new Date(item.date).toLocaleDateString("pt-BR")}
      </p>
      <p className="text-lg font-semibold">
        R$ {item.amount.toLocaleString("pt-BR")}
      </p>
      {item.suggestedCategory && (
        <p className="text-sm text-gray-400">
          Categoria sugerida: {item.suggestedCategory}
        </p>
      )}
    </div>
  );
};
