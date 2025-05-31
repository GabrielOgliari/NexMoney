import { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import { Draggable as DraggableItem } from "./components/draggable";

// Página principal de comparação orçamentária
export const BudgetComparisonPage = () => {
  const { data: categories = [], isSuccess: categoriesLoaded } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios({
        method: "get",
        baseURL: import.meta.env.VITE_API,
        url: "/categories",
      });
      return response.data;
    },
  });

  // Carrega as despesas do extrato bancário
  const { data: expenses = [], isSuccess: expensesLoaded } = useQuery({
    queryKey: ["bankStatementExpenses"],
    queryFn: async () => {
      const response = await axios({
        method: "get",
        baseURL: import.meta.env.VITE_API,
        url: "/bankStatementExpenses",
      });
      return response.data;
    },
  });

  // Estado para armazenar as colunas de categorias e extrato
  const [columns, setColumns] = useState({ extrato: [] });

  // Efeito para inicializar as colunas quando as categorias e despesas estiverem carregadas
  useEffect(() => {
    if (categoriesLoaded && expensesLoaded) {
      const initialColumns = categories.reduce(
        (acc, cat) => ({ ...acc, [cat.id]: [] }),
        { extrato: expenses }
      );
      setColumns(initialColumns);
    }
  }, [categoriesLoaded, expensesLoaded, categories, expenses]);

  // Função para lidar com o fim do arrasto
  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    const fromCol = source.droppableId;
    const toCol = destination.droppableId;

    if (fromCol === toCol) {
      const items = Array.from(columns[fromCol]);
      const [movedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, movedItem);
      setColumns((prev) => ({ ...prev, [fromCol]: items }));
    } else {
      const fromItems = Array.from(columns[fromCol]);
      const [movedItem] = fromItems.splice(source.index, 1);
      const toItems = Array.from(columns[toCol] || []);
      toItems.splice(destination.index, 0, movedItem);
      setColumns((prev) => ({
        ...prev,
        [fromCol]: fromItems,
        [toCol]: toItems,
      }));
    }
  };

  // Função para calcular o total de uma categoria
  const getCategoryTotal = (categoryId) => {
    return (columns[categoryId] || []).reduce(
      (sum, item) => sum + item.amount,
      0
    );
  };

  const totalPlanned = categories.reduce((sum, c) => sum + c.planned, 0);
  const totalMapped = categories.reduce(
    (sum, c) => sum + getCategoryTotal(c.id),
    0
  );
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const sobraTotal = totalPlanned - totalMapped;
  const mappedPct =
    totalExpenses > 0 ? Math.round((totalMapped / totalExpenses) * 100) : 0;

  // Função para salvar o mapeamento
  const handleSaveMapping = async () => {
    const mappedExpenses = [];

    categories.forEach((cat) => {
      (columns[cat.id] || []).forEach((item) => {
        mappedExpenses.push({
          expenseId: item.id,
          expenseName: item.name,
          amount: item.amount,
          date: item.date,
          categoryId: cat.id,
          categoryName: cat.name,
        });
      });
    });

    try {
      await axios({
        method: "post",
        baseURL: import.meta.env.VITE_API,
        url: "/mappedExpenses",
        data: mappedExpenses,
      });
      alert("Mapeamento salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar mapeamento:", error);
      alert("Erro ao salvar mapeamento.");
    }
  };

  return (
    <div className="p-4 bg-[#1B2232] text-white min-h-screen flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Comparação Financeira</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#111827] p-4 rounded">
          <h3>Total Planejado</h3>
          <p>R$ {totalPlanned.toLocaleString("pt-BR")}</p>
        </div>
        <div className="bg-[#111827] p-4 rounded">
          <h3>Total do Extrato</h3>
          <p>R$ {totalExpenses.toLocaleString("pt-BR")}</p>
        </div>
        <div className="bg-[#111827] p-4 rounded">
          <h3>Progresso de Mapeamento</h3>
          <p>{mappedPct}%</p>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Coluna Categorias */}
          <Droppable droppableId="categorias" isDropDisabled>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <h3 className="text-lg font-bold mb-2">Categorias</h3>
                {categories.map((cat) => (
                  <div key={cat.id} className="mb-2 p-2 rounded bg-[#111827]">
                    <p className="font-semibold">{cat.name}</p>
                    <p>Meta: R$ {cat.planned}</p>
                    <p>Atual: R$ {getCategoryTotal(cat.id)}</p>
                    <p>Sobra: R$ {cat.planned - getCategoryTotal(cat.id)}</p>
                  </div>
                ))}
                {provided.placeholder}
                <div className="bg-[#111827] p-4 rounded mt-4 font-bold">
                  <p>
                    Total Planejado: R$ {totalPlanned.toLocaleString("pt-BR")}
                  </p>
                  <p>Total Atual: R$ {totalMapped.toLocaleString("pt-BR")}</p>
                  <p>Total Sobra: R$ {sobraTotal.toLocaleString("pt-BR")}</p>
                </div>
              </div>
            )}
          </Droppable>

          {/* Coluna De Para */}
          <div>
            <h3 className="text-lg font-bold mb-2">De Para</h3>
            {categories.map((cat) => (
              <Droppable droppableId={cat.id} key={cat.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-[#111827] p-4 rounded mb-2"
                  >
                    <h4 className="font-semibold">{cat.name}</h4>
                    {(columns[cat.id] || []).map((item, index) => (
                      <Draggable
                        draggableId={item.id}
                        index={index}
                        key={item.id}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <DraggableItem key={item.id} item={item} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>

          {/* Coluna Extrato */}
          <div>
            <h3 className="text-lg font-bold mb-2">Extrato Bancário</h3>

            <Droppable droppableId="extrato">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-[#111827] p-4 rounded"
                >
                  {columns.extrato?.length > 0 ? (
                    columns.extrato.map((item, index) => (
                      <Draggable
                        draggableId={item.id}
                        index={index}
                        key={item.id}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <DraggableItem key={item.id} item={item} />
                          </div>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">
                      Sem despesas no extrato
                    </p>
                  )}
                  {provided.placeholder}
                  <p className="mt-4 font-bold text-yellow-400">
                    Total não mapeado: R${" "}
                    {columns.extrato
                      ?.reduce((s, i) => s + i.amount, 0)
                      ?.toLocaleString("pt-BR") || 0}
                  </p>
                  <button
                    onClick={handleSaveMapping}
                    className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm mt-2"
                  >
                    Salvar Mapeamento
                  </button>
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>

      {/* Tabela Final */}
      <h3 className="text-lg font-bold mt-6">Resumo do Mapeamento</h3>
      <table className="w-full border mt-2">
        <thead className="bg-[#111827] text-white">
          <tr>
            <th className="text-left p-2">Categoria</th>
            <th className="text-left p-2">Planejado</th>
            <th className="text-left p-2">Atual</th>
            <th className="text-left p-2">Diferença</th>
            <th className="text-left p-2">Sobra</th>
            <th className="text-left p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => {
            const actual = getCategoryTotal(cat.id);
            const diff = actual - cat.planned;
            const sobra = cat.planned - actual;
            const status =
              actual > cat.planned
                ? "Acima"
                : actual > 0
                ? "Dentro"
                : "Não Mapeado";
            const statusColor =
              status === "Acima"
                ? "bg-red-600"
                : status === "Dentro"
                ? "bg-yellow-500"
                : "bg-gray-500";
            return (
              <tr key={cat.id} className="border-b border-gray-700">
                <td className="p-2">{cat.name}</td>
                <td className="p-2">
                  R$ {cat.planned.toLocaleString("pt-BR")}
                </td>
                <td className="p-2">R$ {actual.toLocaleString("pt-BR")}</td>
                <td className="p-2 text-green-500">
                  R$ {diff.toLocaleString("pt-BR")}
                </td>
                <td className="p-2 text-blue-500">
                  R$ {sobra.toLocaleString("pt-BR")}
                </td>
                <td className="p-2">
                  <span
                    className={`px-3 py-1 rounded-full text-white ${statusColor}`}
                  >
                    {status}
                  </span>
                </td>
              </tr>
            );
          })}
          <tr className="font-bold bg-[#111827] text-white">
            <td className="p-2">Total</td>
            <td className="p-2">R$ {totalPlanned.toLocaleString("pt-BR")}</td>
            <td className="p-2">R$ {totalMapped.toLocaleString("pt-BR")}</td>
            <td className="p-2 text-green-500">
              R$ {(totalMapped - totalPlanned).toLocaleString("pt-BR")}
            </td>
            <td className="p-2 text-blue-500">
              R$ {(totalPlanned - totalMapped).toLocaleString("pt-BR")}
            </td>
            <td className="p-2">
              <span
                className={`px-3 py-1 rounded-full text-white ${
                  totalMapped > totalPlanned
                    ? "bg-red-600"
                    : totalMapped < totalPlanned
                    ? "bg-green-600"
                    : "bg-blue-600"
                }`}
              >
                {totalMapped > totalPlanned
                  ? "Acima do Orçamento"
                  : totalMapped < totalPlanned
                  ? "Abaixo do Orçamento"
                  : "No Orçamento"}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
