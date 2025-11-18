
import React, { useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface FormProps {
  onSave: (details: Record<string, any>) => void;
  initialData?: Record<string, any> | null;
  onCancelEdit?: () => void;
}

export const FertilizationForm: React.FC<FormProps> = ({ onSave, initialData, onCancelEdit }) => {
  const getInitialState = () => ({
    date: '',
    pasture: '',
    hectares: '',
    fertilizationType: '',
    formula: '',
    quantityPerHectare: '',
    totalQuantity: '',
    pricePerKg: '',
    totalPrice: '',
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
        {initialData ? 'Editando Lançamento de Adubação' : 'Adicionar Lançamento de Adubação'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input label="Data" type="date" name="date" value={formData.date} onChange={handleChange} required />
        <Input label="Pasto" name="pasture" value={formData.pasture} onChange={handleChange} />
        <Input label="Hectares" type="number" name="hectares" value={formData.hectares} onChange={handleChange} />
        <Input label="Tipo de adubação" name="fertilizationType" value={formData.fertilizationType} onChange={handleChange} />
        <Input label="Fórmula (NPK)" name="formula" value={formData.formula} onChange={handleChange} />
        <Input label="Quantidade por hectare (Kg)" type="number" name="quantityPerHectare" value={formData.quantityPerHectare} onChange={handleChange} />
        <Input label="Quantidade total (Kg)" type="number" name="totalQuantity" value={formData.totalQuantity} onChange={handleChange} />
        <Input label="Valor do Kg (R$)" type="number" name="pricePerKg" value={formData.pricePerKg} onChange={handleChange} />
        <Input label="Valor total (R$)" type="number" name="totalPrice" value={formData.totalPrice} onChange={handleChange} />
      </div>
      <div className="pt-4 flex space-x-2">
        <Button type="submit">{initialData ? 'Atualizar Lançamento' : 'Adicionar Lançamento'}</Button>
        {initialData && onCancelEdit && <Button type="button" variant="secondary" onClick={onCancelEdit}>Cancelar Edição</Button>}
      </div>
    </form>
  );
};