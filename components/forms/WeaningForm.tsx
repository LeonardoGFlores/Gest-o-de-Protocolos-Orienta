
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

export const WeaningForm: React.FC<FormProps> = ({ onSave, categories, initialData, onCancelEdit }) => {
  const getInitialState = () => ({
    date: '',
    animalCount: '',
    sex: '',
    totalWeight: '',
    avgWeight: '',
    cowCategory: '',
    weaningLot: '',
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
        {initialData ? 'Editando Lançamento de Desmame' : 'Adicionar Lançamento de Desmame'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input label="Data" type="date" name="date" value={formData.date} onChange={handleChange} required />
        <Input label="Número de animais" type="number" name="animalCount" value={formData.animalCount} onChange={handleChange} />
        <Select label="Sexo" name="sex" value={formData.sex} onChange={handleChange}>
          <option value="">Selecione</option>
          <option value="Macho">Macho</option>
          <option value="Fêmea">Fêmea</option>
          <option value="Misto">Misto</option>
        </Select>
        <Input label="Peso total" type="number" name="totalWeight" value={formData.totalWeight} onChange={handleChange} />
        <Input label="Peso médio" type="number" name="avgWeight" value={formData.avgWeight} onChange={handleChange} />
        <Select label="Categoria da vaca" name="cowCategory" value={formData.cowCategory} onChange={handleChange}>
          <option value="">Selecione</option>
          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </Select>
        <Input label="Lote de desmame" name="weaningLot" value={formData.weaningLot} onChange={handleChange} />
      </div>
      <div className="pt-4 flex space-x-2">
        <Button type="submit">{initialData ? 'Atualizar Lançamento' : 'Adicionar Lançamento'}</Button>
        {initialData && onCancelEdit && <Button type="button" variant="secondary" onClick={onCancelEdit}>Cancelar Edição</Button>}
      </div>
    </form>
  );
};