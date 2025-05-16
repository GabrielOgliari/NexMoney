import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa"
import { toast } from "@/components/ui/toast"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert_dialog"
import { DataTable } from "@/components/ui/data_table"

const initialCategories = [
  {
    id: "1",
    name: "Moradia",
    description: "Despesas como aluguel e condomínio",
    type: "expense",
    color: "#3b82f6",
    count: 12,
  },
  {
    id: "2",
    name: "Salário",
    description: "Receita mensal de trabalho",
    type: "income",
    color: "#22c55e",
    count: 5,
  },
]

export const CategoriesPage = () => {
  const [categories, setCategories] = useState(initialCategories)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [current, setCurrent] = useState(null)

  const handleDelete = (category) => {
    setCurrent(category)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    setCategories(categories.filter((c) => c.id !== current.id))
    setDeleteDialogOpen(false)
    toast(`Categoria ${current.name} excluída`)
  }

  const columns = [
    {
      header: "Nome",
      accessorKey: "name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full" style={{ backgroundColor: row.color }} />
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      header: "Tipo",
      accessorKey: "type",
      cell: ({ row }) => (
        <Badge variant={row.type === "income" ? "success" : "destructive"}>
          {row.type === "income" ? "Receita" : "Despesa"}
        </Badge>
      ),
    },
    {
      header: "Uso",
      accessorKey: "count",
      cell: ({ row }) => <Badge variant="outline">{row.count} usos</Badge>,
    },
    {
      header: "Ações",
      accessorKey: "id",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => console.log("edit", row)}>
            <FaEdit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(row)}>
            <FaTrash className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Categorias</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <FaPlus className="mr-2 h-4 w-4" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <h2 className="text-lg font-semibold">Adicionar Categoria</h2>
            {/* Formulário pode ser implementado aqui */}
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Categorias</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={categories} />
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <p>Deseja excluir a categoria "{current?.name}"?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
