import { useState } from "react"
import { FaPlus, FaTrash, FaPencilAlt } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/toast"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert_dialog"
import { DataTable } from "@/components/ui/data_table"

const initialCategories = [
  {
    id: "1",
    name: "Moradia",
    description: "Despesas com aluguel, condomínio",
    type: "expense",
    color: "#3b82f6",
    count: 12,
  },
  {
    id: "2",
    name: "Alimentação",
    description: "Despesas com comida, mercado, etc.",
    type: "expense",
    color: "#10b981",
    count: 8,
  },
]

export const CategoriesPage = () => {
  const [categories, setCategories] = useState(initialCategories)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [current, setCurrent] = useState(null)
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "expense",
    color: "#3b82f6",
  })

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      type: "expense",
      color: "#3b82f6",
    })
  }

  const handleAdd = () => {
    const newCategory = {
      ...form,
      id: String(Date.now()),
      count: 0,
    }
    setCategories((prev) => [...prev, newCategory])
    setDialogOpen(false)
    resetForm()
    toast("Categoria criada com sucesso!")
  }

  const handleEdit = (category) => {
    setCurrent(category)
    setForm({ ...category })
    setEditDialogOpen(true)
  }

  const handleUpdate = () => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === current.id ? { ...cat, ...form } : cat))
    )
    setEditDialogOpen(false)
    toast("Categoria atualizada com sucesso!")
  }

  const handleDelete = (category) => {
    setCurrent(category)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    setCategories((prev) => prev.filter((cat) => cat.id !== current.id))
    setDeleteDialogOpen(false)
    toast("Categoria excluída com sucesso!")
  }

  const columns = [
    {
      header: "Nome",
      accessorKey: "name",
      cell: ({ row }) => {
        const cat = row.original
        return (
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: cat.color }}
            />
            <span>{cat.name}</span>
          </div>
        )
      },
    },
    {
      header: "Tipo",
      accessorKey: "type",
      cell: ({ row }) => {
        const cat = row.original
        return (
          <Badge variant={cat.type === "income" ? "success" : "destructive"}>
            {cat.type === "income" ? "Receita" : "Despesa"}
          </Badge>
        )
      },
    },
    {
      header: "Uso",
      accessorKey: "count",
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.original.count} {row.original.count === 1 ? "item" : "itens"}
        </Badge>
      ),
    },
    {
      header: "Ações",
      accessorKey: "id",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(row.original)}>
            <FaPencilAlt className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(row.original)}>
            <FaTrash className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Categorias</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <FaPlus className="mr-2" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Categoria</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para adicionar uma nova categoria.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-1">
                <Label>Nome</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nome da categoria"
                />
              </div>
              <div className="space-y-1">
                <Label>Descrição</Label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Descrição"
                />
              </div>
              <div className="space-y-1">
                <Label>Tipo</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={form.type === "expense"}
                      onChange={() => setForm({ ...form, type: "expense" })}
                    />
                    Despesa
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={form.type === "income"}
                      onChange={() => setForm({ ...form, type: "income" })}
                    />
                    Receita
                  </label>
                </div>
              </div>
              <div className="space-y-1">
                <Label>Cor</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-10 h-10 rounded"
                  />
                  <Input
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAdd}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Categorias</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={categories} />
        </CardContent>
      </Card>

      {/* Editar Categoria */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Categoria</DialogTitle>
            <DialogDescription>
              Atualize os campos abaixo para editar a categoria.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <Label>Nome</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Descrição</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Tipo</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={form.type === "expense"}
                    onChange={() => setForm({ ...form, type: "expense" })}
                  />
                  Despesa
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={form.type === "income"}
                    onChange={() => setForm({ ...form, type: "income" })}
                  />
                  Receita
                </label>
              </div>
            </div>
            <div className="space-y-1">
              <Label>Cor</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="w-10 h-10 rounded"
                />
                <Input
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdate}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmação de exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Categoria</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a categoria "{current?.name}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
