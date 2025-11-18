
import React, { useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Category } from '../../types';

interface FormProps {
  onSave: (details: Record<string, any>) => void;
  categories: Category[];
  initialData?: Record<string, any> | null;
  onCancelEdit?: () => void;
}

export const SaleForm: React.FC<FormProps> = ({ onSave, categories, initialData, onCancelEdit }) => {
  const getInitialState = () => ({
    date: '',
    pasture: '',
    owner: '',
    buyer: '',
    category: '',
    quantity: '',
    sex: '',
    avgWeight: '',
    totalWeight: '',
    pricePerKg: '',
    commissionPercentage: '',
    commissioned: '',
    commissionValue: '',
    pricePerUnit: '',
    totalPrice: '',
    finalPricePerKg: '',
    invoiceNumber: '',
    productionSystem: '',
  });

  const [formData, setFormData] = useState(getInitialState());

   useEffect(() => {
    if (initialData) {
      const completeInitialData = { ...getInitialState(), ...initialData };
      setFormData(completeInitialData);
    } else {
      setFormData(getInitialState());
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    if (!initialData) {
      setFormData(getInitialState());
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold text-brand-green mb-4">
        {initialData ? 'Editando Lançamento de Venda' : 'Adicionar Lançamento de Venda'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input label="Data" type="date" name="date" value={formData.date} onChange={handleChange} required />
        <Input label="Pasto" name="pasture" value={formData.pasture} onChange={handleChange} />
        <Input label="Proprietário" name="owner" value={formData.owner} onChange={handleChange} />
        <Input label="Comprador" name="buyer" value={formData.buyer} onChange={handleChange} />
        <Select label="Categoria" name="category" value={formData.category} onChange={handleChange}>
          <option value="">Selecione</option>
          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </Select>
        <Input label="Quantidade" type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
        <Select label="Sexo" name="sex" value={formData.sex} onChange={handleChange}>
          <option value="">Selecione</option>
          <option value="Macho">Macho</option>
          <option value="Fêmea">Fêmea</option>
        </Select>
        <Input label="P. médio" type="number" name="avgWeight" value={formData.avgWeight} onChange={handleChange} />
        <Input label="P. total" type="number" name="totalWeight" value={formData.totalWeight} onChange={handleChange} />
        <Input label="R$ (Kg)" type="number" name="pricePerKg" value={formData.pricePerKg} onChange={handleChange} />
        <Input label="Comissão (%)" type="number" name="commissionPercentage" value={formData.commissionPercentage} onChange={handleChange} />
        <Input label="Comissionado" name="commissioned" value={formData.commissioned} onChange={handleChange} />
        <Input label="Comissão (R$)" type="number" name="commissionValue" value={formData.commissionValue} onChange={handleChange} />
        <Input label="R$ (Un)" type="number" name="pricePerUnit" value={formData.pricePerUnit} onChange={handleChange} />
        <Input label="R$ (Total)" type="number" name="totalPrice" value={formData.totalPrice} onChange={handleChange} />
        <Input label="R$ (Kg/Final)" type="number" name="finalPricePerKg" value={formData.finalPricePerKg} onChange={handleChange} />
        <Input label="Nº NFs°" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} />
        <Select label="Sistema de Produção" name="productionSystem" value={formData.productionSystem} onChange={handleChange}>
            <option value="">Selecione</option>
            <option value="Cria">Cria</option>
            <option value="Recria">Recria</option>
            <option value="Engorda">Engorda</option>
        </Select>
      </div>
      <div className="pt-4 flex space-x-2">
        <Button type="submit">{initialData ? 'Atualizar Lançamento' : 'Adicionar Lançamento'}</Button>
        {initialData && onCancelEdit && <Button type="button" variant="secondary" onClick={onCancelEdit}>Cancelar Edição</Button>}
      </div>
    </form>
  );
};