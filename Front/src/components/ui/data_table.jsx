export const DataTable = ({
  columns = [],
  data = [],
  onRowClick,
  searchPlaceholder = "Buscar...",
  exportFileName = "data",
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-md border border-border bg-card text-card-foreground">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 border-b border-border">
          <tr>
            {columns.map((col) => (
              <th key={col.header} className="px-4 py-3 text-left font-semibold text-sm">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-center text-muted-foreground">
                Nenhum dado encontrado.
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={item.id || index}
                onClick={() => onRowClick?.(item)}
                className="hover:bg-muted transition-colors border-b border-border cursor-pointer"
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-4 py-2">
                    {typeof col.cell === "function"
                      ? col.cell({ row: { original: item } })
                      : item[col.accessorKey]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
