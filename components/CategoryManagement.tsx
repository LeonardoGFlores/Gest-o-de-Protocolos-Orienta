import React, { useState, useEffect } from 'react';
import { Category } from '../types';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface CategoryManagementProps {
  categories: Category[];
  addCategory: (name: string) => void;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
}

export const CategoryManagement: React.FC<CategoryManagementProps> = ({ categories, addCategory, updateCategory, deleteCategory }) => {
  const [name, setName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
    } else {
      setName('');
    }
  }, [editingCategory]);

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setName('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      if (editingCategory) {
        updateCategory(editingCategory.id, name.trim());
      } else {
        addCategory(name.trim());
      }
      handleCancelEdit();
    }
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      deleteCategory(id);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold text-brand-green mb-4">
          {editingCategory ? 'Editar Categoria' : 'Adicionar Nova Categoria'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome da Categoria"
            id="categoryName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Novilhos"
            required
          />
          <div className="flex space-x-2">
            <Button type="submit">{editingCategory ? 'Salvar Alterações' : 'Adicionar Categoria'}</Button>
            {editingCategory && <Button type="button" variant="secondary" onClick={handleCancelEdit}>Cancelar</Button>}
          </div>
        </form>
      </Card>
      
      <Card>
        <h2 className="text-xl font-semibold text-brand-green mb-4">Categorias Cadastradas</h2>
        {categories.length > 0 ? (
          <ul className="divide-y divide-brand-light-gray">
            {categories.map((cat) => (
              <li key={cat.id} className="py-3 flex justify-between items-center">
                <span className="text-brand-gray font-medium">{cat.name}</span>
                 <div className="flex space-x-2">
                    <Button onClick={() => setEditingCategory(cat)} variant="secondary" className="px-3 py-1 text-xs">Editar</Button>
                    <Button onClick={() => handleDelete(cat.id)} variant="secondary" className="px-3 py-1 text-xs !bg-red-100 !text-red-700 hover:!bg-red-200">Excluir</Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-brand-gray">Nenhuma categoria cadastrada ainda.</p>
        )}
      </Card>
    </div>
  );
};
