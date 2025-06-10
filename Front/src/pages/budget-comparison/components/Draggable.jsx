import { NumericFormat } from "react-number-format";

// estilo basico de um item arrastavel
export const Draggable = ({ item }) => {
  return (
    <div className="border border-white rounded-lg p-4 bg-[#1B2232] text-white mb-2">
      <p className="text-lg font-bold">{item.name}</p>
      <p className="text-lg">{item.person_name}</p>
      <p className="text-lg">{item.type}</p>
      <p className="text-sm">
        {new Date(item.date).toLocaleDateString("pt-BR")}
      </p>
      <NumericFormat
        value={item.amount}
        displayType="text"
        thousandSeparator="."
        decimalSeparator=","
        prefix="R$ "
        decimalScale={2}
        fixedDecimalScale
        className="text-lg font-semibold"
      />
      {item.suggestedCategory && (
        <p className="text-sm text-gray-400">
          Categoria sugerida: {item.suggestedCategory}
        </p>
      )}
    </div>
  );
};
