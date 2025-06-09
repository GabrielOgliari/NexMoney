import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Box,
} from "@mui/material";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { useQuery } from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Draggable as DraggableItem } from "./components/draggable";
import { NumericFormat } from "react-number-format";

// Página principal de comparação orçamentária
export const BudgetComparisonPage = () => {
  // Carrega as categorias do banco
  const { data: categories = [], isSuccess: categoriesLoaded } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get("/categories");
      return response.data;
    },
  });

  // Carrega as despesas do extrato bancário
  const { data: expenses = [], isSuccess: expensesLoaded } = useQuery({
    queryKey: ["bankStatementExpenses"],
    queryFn: async () => {
      const response = await api.get("/bankStatementExpenses");
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

  // Função para calcular o total de uma categoria (usando valor absoluto das despesas)
  const getCategoryTotal = (categoryId) => {
    return (columns[categoryId] || []).reduce((sum, item) => {
      const value = Number(item.amount) || 0;
      return value < 0 ? sum + Math.abs(value) : sum;
    }, 0);
  };

  // Total planejado: soma dos valores definidos nas categorias
  const totalPlanned = categories.reduce(
    (sum, c) => sum + (Number(c.planned) || 0),
    0
  );

  // Total mapeado: soma das despesas alocadas nas categorias
  const totalMapped = categories.reduce(
    (sum, c) => sum + getCategoryTotal(c.id),
    0
  );

  // Total de despesas no extrato (ignora receitas)
  const totalExpenses = expenses.reduce((sum, e) => {
    const value = Number(e.amount) || 0;
    return value < 0 ? sum + Math.abs(value) : sum;
  }, 0);

  // Sobra total entre o planejado e o que foi mapeado
  const sobraTotal = totalPlanned - totalMapped;
  const mappedPct =
    totalExpenses > 0 ? Math.round((totalMapped / totalExpenses) * 100) : 0;

  // Função para salvar o mapeamento
  const handleSaveMapping = async () => {
    const mappedExpenses = [];

    categories.forEach((cat) => {
      (columns[cat.id] || []).forEach((item) => {
        mappedExpenses.push({
          id: item.id,
          categoryId: cat.id,
          mapped: true,
          category: cat.name,
        });
      });
    });

    try {
      await api.put("/bankStatementExpenses", mappedExpenses);
    } catch (error) {
      console.error("Erro ao salvar mapeamento:", error);
    }
  };

  return (
    <div className="p-4 bg-[#1B2232] text-white min-h-screen flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Comparação Financeira</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { title: "Total Planejado", value: totalPlanned },
          { title: "Total do Extrato", value: totalExpenses },
        ].map((card, i) => (
          <div key={i} className="bg-[#111827] p-4 rounded">
            <h3>{card.title}</h3>
            <NumericFormat
              value={card.value}
              displayType="text"
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              decimalScale={2}
              fixedDecimalScale
            />
          </div>
        ))}
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
              <Droppable droppableId={String(cat.id)} key={cat.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-[#111827] p-4 rounded mb-2"
                  >
                    <h4 className="font-semibold">{cat.name}</h4>
                    {(columns[cat.id] || []).map((item, index) => (
                      <Draggable
                        draggableId={String(item.id)}
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
                        draggableId={String(item.id)}
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
                    Total não mapeado:{" "}
                    <NumericFormat
                      value={columns.extrato?.reduce(
                        (s, i) => s + (parseFloat(i.amount) || 0),
                        0
                      )}
                      displayType="text"
                      thousandSeparator="."
                      decimalSeparator=","
                      prefix="R$ "
                      decimalScale={2}
                      fixedDecimalScale
                    />
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
      <Box sx={{ overflowX: "auto" }}>
        <Table
          sx={{
            minWidth: 650,
            backgroundColor: "#111827",
            color: "white",
            borderCollapse: "collapse",
          }}
        >
          <TableHead>
            <TableRow sx={{ backgroundColor: "#111827" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Categoria
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Planejado
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Atual
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Diferença
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Sobra
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
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
                  ? "#dc2626"
                  : status === "Dentro"
                  ? "#facc15"
                  : "#6b7280";
              return (
                <TableRow
                  key={cat.id}
                  sx={{ borderBottom: "1px solid #374151" }}
                >
                  <TableCell sx={{ color: "white" }}>{cat.name}</TableCell>
                  <TableCell sx={{ color: "white" }}>
                    R$ {cat.planned.toLocaleString("pt-BR")}
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    R$ {actual.toLocaleString("pt-BR")}
                  </TableCell>
                  <TableCell sx={{ color: "#22c55e" }}>
                    R$ {diff.toLocaleString("pt-BR")}
                  </TableCell>
                  <TableCell sx={{ color: "#3b82f6" }}>
                    R$ {sobra.toLocaleString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        backgroundColor: statusColor,
                        color: "white",
                        px: 2,
                        py: 0.5,
                        borderRadius: "999px",
                        fontWeight: "bold",
                        textAlign: "center",
                        display: "inline-block",
                      }}
                    >
                      {status}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow sx={{ backgroundColor: "#111827", fontWeight: "bold" }}>
              <TableCell sx={{ color: "white" }}>Total</TableCell>
              <TableCell sx={{ color: "white" }}>
                R$ {totalPlanned.toLocaleString("pt-BR")}
              </TableCell>
              <TableCell sx={{ color: "white" }}>
                R$ {totalMapped.toLocaleString("pt-BR")}
              </TableCell>
              <TableCell sx={{ color: "#22c55e" }}>
                R$ {(totalMapped - totalPlanned).toLocaleString("pt-BR")}
              </TableCell>
              <TableCell sx={{ color: "#3b82f6" }}>
                R$ {(totalPlanned - totalMapped).toLocaleString("pt-BR")}
              </TableCell>
              <TableCell>
                <Box
                  sx={{
                    backgroundColor:
                      totalMapped > totalPlanned
                        ? "#dc2626"
                        : totalMapped < totalPlanned
                        ? "#16a34a"
                        : "#3b82f6",
                    color: "white",
                    px: 2,
                    py: 0.5,
                    borderRadius: "999px",
                    fontWeight: "bold",
                    textAlign: "center",
                    display: "inline-block",
                  }}
                >
                  {totalMapped > totalPlanned
                    ? "Acima do Orçamento"
                    : totalMapped < totalPlanned
                    ? "Abaixo do Orçamento"
                    : "No Orçamento"}
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </div>
  );
};
