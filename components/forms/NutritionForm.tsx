
import React, { useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface FormProps {
  onSave: (details: Record<string, any>) => void;
  initialData?: Record<string, any> | null;
  onCancelEdit?: () => void;
}

export const NutritionForm: React.FC<FormProps> = ({ onSave, initialData, onCancelEdit }) => {
  const getInitialState = () => ({
    date: '',
    productType: '',
    productName: '',
    companyName: '',
    pasture: '',
    lot: '',
    activity: '',
    quantity: '',
    unit: '',
    unitVolume: '',
    totalVolume: '',
    pricePerKg: '',
    totalPrice: '',
    estimatedConsumption: '',
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
        {initialData ? 'Editando Lançamento de Nutrição' : 'Adicionar Lançamento de Nutrição'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input label="Data" type="date" name="date" value={formData.date} onChange={handleChange} required />
        <Input label="Tipo de produto" name="productType" value={formData.productType} onChange={handleChange} />
        <Input label="Nome do produto" name="productName" value={formData.productName} onChange={handleChange} />
        <Input label="Empresa" name="companyName" value={formData.companyName} onChange={handleChange} />
        <Input label="Pasto" name="pasture" value={formData.pasture} onChange={handleChange} />
        <Input label="Lote" name="lot" value={formData.lot} onChange={handleChange} />
        <Input label="Atividade" name="activity" value={formData.activity} onChange={handleChange} />
        <Input label="Quantidade" type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
        <Input label="Unidade (Sc/Kg...)" name="unit" value={formData.unit} onChange={handleChange} />
        <Input label="Volume da unidade (Kg)" type="number" name="unitVolume" value={formData.unitVolume} onChange={handleChange} />
        <Input label="Volume total (Kg)" type="number" name="totalVolume" value={formData.totalVolume} onChange={handleChange} />
        <Input label="Valor do Kg (R$)" type="number" name="pricePerKg" value={formData.pricePerKg} onChange={handleChange} />
        <Input label="Valor total (R$)" type="number" name="totalPrice" value={formData.totalPrice} onChange={handleChange} />
        <Input label="Consumo estimado (%.P.V)" type="number" name="estimatedConsumption" value={formData.estimatedConsumption} onChange={handleChange} />
      </div>
      <div className="pt-4 flex space-x-2">
        <Button type="submit">{initialData ? 'Atualizar Lançamento' : 'Adicionar Lançamento'}</Button>
        {initialData && onCancelEdit && <Button type="button" variant="secondary" onClick={onCancelEdit}>Cancelar Edição</Button>}
      </div>
    </form>
  );
};