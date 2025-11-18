import React, { useState, useEffect } from 'react';
import { Client } from '../types';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

// FIX: Corrected the types for `addClient` and `updateClient` to `Omit<Client, 'id' | 'userId'>`.
// The `userId` is managed by the parent component (`App.tsx`) when creating/updating a client,
// so this component should only be concerned with the other client properties.
interface ClientManagementProps {
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'userId'>) => void;
  updateClient: (id: string, client: Omit<Client, 'id' | 'userId'>) => void;
  deleteClient: (id: string) => void;
}

export const ClientManagement: React.FC<ClientManagementProps> = ({ clients, addClient, updateClient, deleteClient }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  useEffect(() => {
    if (editingClient) {
      setFormData({ name: editingClient.name, phone: editingClient.phone, address: editingClient.address });
    } else {
      setFormData({ name: '', phone: '', address: '' });
    }
  }, [editingClient]);

  const handleCancelEdit = () => {
    setEditingClient(null);
    setFormData({ name: '', phone: '', address: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id.replace('client', '').toLowerCase()]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.phone.trim() && formData.address.trim()) {
      if (editingClient) {
        updateClient(editingClient.id, formData);
      } else {
        addClient(formData);
      }
      handleCancelEdit();
    }
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
        deleteClient(id);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold text-brand-green mb-4">
          {editingClient ? 'Editar Cliente' : 'Adicionar Novo Cliente'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nome Completo" id="clientName" value={formData.name} onChange={(e) => setFormData(p => ({...p, name: e.target.value}))} required />
          <Input label="Telefone" id="clientPhone" value={formData.phone} onChange={(e) => setFormData(p => ({...p, phone: e.target.value}))} required />
          <Input label="Endereço" id="clientAddress" value={formData.address} onChange={(e) => setFormData(p => ({...p, address: e.target.value}))} required />
          <div className="flex space-x-2">
            <Button type="submit">{editingClient ? 'Salvar Alterações' : 'Adicionar Cliente'}</Button>
            {editingClient && <Button type="button" variant="secondary" onClick={handleCancelEdit}>Cancelar</Button>}
          </div>
        </form>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-brand-green mb-4">Clientes Cadastrados</h2>
        {clients.length > 0 ? (
          <ul className="divide-y divide-brand-light-gray">
            {clients.map((client) => (
              <li key={client.id} className="py-4 flex justify-between items-start">
                <div>
                  <p className="font-semibold text-brand-green">{client.name}</p>
                  <p className="text-sm text-brand-gray">{client.phone}</p>
                  <p className="text-sm text-brand-gray">{client.address}</p>
                </div>
                <div className="flex space-x-2 flex-shrink-0 mt-1">
                    <Button onClick={() => setEditingClient(client)} variant="secondary" className="px-3 py-1 text-xs">Editar</Button>
                    <Button onClick={() => handleDelete(client.id)} variant="secondary" className="px-3 py-1 text-xs !bg-red-100 !text-red-700 hover:!bg-red-200">Excluir</Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-brand-gray">Nenhum cliente cadastrado ainda.</p>
        )}
      </Card>
    </div>
  );
};