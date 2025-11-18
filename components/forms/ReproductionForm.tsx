
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

export const ReproductionForm: React.FC<FormProps> = ({ onSave, categories, initialData, onCancelEdit }) => {
  const getInitialState = () => ({
    date: '',
    lotName: '',
    category: '',
    animalCount: '',
    inseminated: '',
    dgDate: '',
    dgDayInterval: '',
    pregnant: '',
    empty: '',
    missed: '',
    diagnosed: '',
    pregnancyRate: '',
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
         {initialData ? 'Editando Lançamento de Reprodução' : 'Adicionar Lançamento de Reprodução'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input label="Data" type="date" name="date" value={formData.date} onChange={handleChange} required />
        <Input label="Nome do Lote" name="lotName" value={formData.lotName} onChange={handleChange} />
        <Select label="Categoria" name="category" value={formData.category} onChange={handleChange}>
          <option value="">Selecione</option>
          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </Select>
        <Input label="Número de animais" type="number" name="animalCount" value={formData.animalCount} onChange={handleChange} />
        <Input label="Inseminadas" type="number" name="inseminated" value={formData.inseminated} onChange={handleChange} />
        <Input label="Data do DG" type="date" name="dgDate" value={formData.dgDate} onChange={handleChange} />
        <Input label="Intervalo de dias no DG" type="number" name="dgDayInterval" value={formData.dgDayInterval} onChange={handleChange} />
        <Input label="Prenhas" type="number" name="pregnant" value={formData.pregnant} onChange={handleChange} />
        <Input label="Vazias" type="number" name="empty" value={formData.empty} onChange={handleChange} />
        <Input label="Faltaram" type="number" name="missed" value={formData.missed} onChange={handleChange} />
        <Input label="Diagnosticadas" type="number" name="diagnosed" value={formData.diagnosed} onChange={handleChange} />
        <Input label="Taxa de Prenhez (%)" type="number" name="pregnancyRate" value={formData.pregnancyRate} onChange={handleChange} />
      </div>
      <div className="pt-4 flex space-x-2">
        <Button type="submit">{initialData ? 'Atualizar Lançamento' : 'Adicionar Lançamento'}</Button>
        {initialData && onCancelEdit && <Button type="button" variant="secondary" onClick={onCancelEdit}>Cancelar Edição</Button>}
      </div>
    </form>
  );
};