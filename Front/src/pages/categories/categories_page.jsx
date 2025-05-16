import { useState } from "react";
import { FaPlus, FaTrash, FaPencilAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert_dialog";
import { DataTable } from "@/components/ui/data_table";

const initialCategories = [
  {
    id: "1",
    name: "Moradia",
    description: "Despesas relacionadas à moradia, como aluguel e condomínio",
    type: "expense",
    color: "#3b82f6",
    count: 12,
  },
  {
    id: "2",
    name: "Alimentação",
    description: "Despesas com alimentação, como supermercado e restaurantes",
    type: "expense",
    color: "#10b981",
    count: 8,
  },
];

export const CategoriesPage = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "expense",
    color: "#3b82f6",
  });

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      type: "expense",
      color: "#3b82f6",
    });
  };

  const handleAdd = () => {
    if (!form.name) return;
    const newCategory = {
      ...form,
      id: String(Math.random()),
      count: 0,
    };
    setCategories((prev) => [...prev, newCategory]);
    resetForm();
    setIsDialogOpen(false);
    toast("Categoria criada com sucesso!");
  };

  const handleEdit = (category) => {
    setCurrent(category);
    setForm({ ...category });
    setEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!form.name) return;
    const updated = categories.map((cat) =>
      cat.id === current.id ? { ...cat, ...form } : cat
    );
    setCategories(updated);
    setEditDialogOpen(false);
    resetForm();
    setCurrent(null);
    toast("Categoria atualizada com sucesso!");
  };

  const handleDelete = (category) => {
    setCurrent(category);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setCategories((prev) => prev.filter((c) => c.id !== current.id));
    setDeleteDialogOpen(false);
    toast("Categoria removida com sucesso!");
  };

  const columns = [
    {
      header: "Nome",
      accessorKey: "name",
      cell: ({ row }) => {
        const cat = row.original || {};
        return (
          <div className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: cat.color || "#000" }}
            />
            <span className="font-medium">{cat.name}</span>
          </div>
        );
      },
    },
    {
      header: "Tipo",
      accessorKey: "type",
      cell: ({ row }) => {
        const cat = row.original || {};
        return (
          <Badge variant={cat.type === "income" ? "success" : "destructive"}>
            {cat.type === "income" ? "Receita" : "Despesa"}
          </Badge>
        );
      },
    },
    {
      header: "Uso",
      accessorKey: "count",
      cell: ({ row }) => {
        const cat = row.original || {};
        return (
          <Badge variant="outline">
            {cat.count} {cat.count === 1 ? "item" : "itens"}
          </Badge>
        );
      },
    },
    {
      header: "Ações",
      accessorKey: "id",
      cell: ({ row }) => {
        const cat = row.original || {};
        return (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(cat)}>
              <FaPencilAlt className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(cat)}>
              <FaTrash className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciamento de Categorias</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <FaPlus className="mr-2" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Categoria</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para adicionar uma nova categoria.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 mt-4">
              <div className="space-y-1">
                <Label>Nome</Label>
                <Input
                  placeholder="Nome da categoria"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Descrição</Label>
                <Input
                  placeholder="Descrição"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Tipo</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="type"
                      checked={form.type === "expense"}
                      onChange={() => setForm({ ...form, type: "expense" })}
                    />
                    Despesa
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="type"
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
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
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

      {/* Diálogo de edição */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Categoria</DialogTitle>
            <DialogDescription>Atualize os dados da categoria.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 mt-4">
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
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Tipo</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="edit-type"
                    checked={form.type === "expense"}
                    onChange={() => setForm({ ...form, type: "expense" })}
                  />
                  Despesa
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="edit-type"
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
                  onChange={(e) =>
                    setForm({ ...form, color: e.target.value })
                  }
                  className="w-10 h-10 rounded"
                />
                <Input
                  value={form.color}
                  onChange={(e) =>
                    setForm({ ...form, color: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleUpdate}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Categoria</AlertDialogTitle>
          </AlertDialogHeader>
          <p className="mt-2">
            Tem certeza que deseja excluir a categoria{" "}
            <strong>{current?.name}</strong>?
          </p>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
