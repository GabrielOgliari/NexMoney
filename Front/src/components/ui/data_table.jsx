// Simples DataTable para exibir dados com colunas personalizadas
export function DataTable({ columns = [], data = [] }) {
  return (
    <div className="w-full overflow-x-auto rounded border border-border">
      <table className="min-w-full table-auto text-sm">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            {columns.map((col) => (
              <th key={col.accessorKey} className="text-left px-4 py-2 font-medium">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id || index} className="border-t border-border hover:bg-accent/30">
              {columns.map((col) => (
                <td key={col.accessorKey} className="px-4 py-2">
                  {col.cell
                    ? col.cell({ row }) // ✅ Passa o objeto da linha
                    : row[col.accessorKey]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
