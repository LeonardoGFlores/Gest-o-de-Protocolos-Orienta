import React, { useState, useEffect } from 'react';
import { Company } from '../types';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface CompanyManagementProps {
  companies: Company[];
  addCompany: (company: Omit<Company, 'id' | 'userId'>) => void;
  updateCompany: (id: string, company: Omit<Company, 'id' | 'userId'>) => void;
  deleteCompany: (id: string) => void;
}

export const CompanyManagement: React.FC<CompanyManagementProps> = ({ companies, addCompany, updateCompany, deleteCompany }) => {
  const [formData, setFormData] = useState({ name: '', city: '' });
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  useEffect(() => {
    if (editingCompany) {
      setFormData({ name: editingCompany.name, city: editingCompany.city });
    } else {
      setFormData({ name: '', city: '' });
    }
  }, [editingCompany]);

  const handleCancelEdit = () => {
    setEditingCompany(null);
    setFormData({ name: '', city: '' });
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.city.trim()) {
        if (editingCompany) {
            updateCompany(editingCompany.id, formData);
        } else {
            addCompany(formData);
        }
        handleCancelEdit();
    }
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta empresa?')) {
        deleteCompany(id);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold text-brand-green mb-4">
            {editingCompany ? 'Editar Empresa' : 'Adicionar Nova Empresa'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nome da Empresa" id="companyName" name="name" value={formData.name} onChange={handleChange} required />
          <Input label="Cidade" id="companyCity" name="city" value={formData.city} onChange={handleChange} required />
          <div className="flex space-x-2">
            <Button type="submit">{editingCompany ? 'Salvar Alterações' : 'Adicionar Empresa'}</Button>
            {editingCompany && <Button type="button" variant="secondary" onClick={handleCancelEdit}>Cancelar</Button>}
          </div>
        </form>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-brand-green mb-4">Empresas Cadastradas</h2>
        {companies.length > 0 ? (
          <ul className="divide-y divide-brand-light-gray">
            {companies.map((company) => (
              <li key={company.id} className="py-4 flex justify-between items-start">
                <div>
                  <p className="font-semibold text-brand-green">{company.name} - {company.city}</p>
                </div>
                 <div className="flex space-x-2 flex-shrink-0 mt-1">
                    <Button onClick={() => setEditingCompany(company)} variant="secondary" className="px-3 py-1 text-xs">Editar</Button>
                    <Button onClick={() => handleDelete(company.id)} variant="secondary" className="px-3 py-1 text-xs !bg-red-100 !text-red-700 hover:!bg-red-200">Excluir</Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-brand-gray">Nenhuma empresa cadastrada ainda.</p>
        )}
      </Card>
    </div>
  );
};