
import React, { useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Category, Farm } from '../../types';

interface FormProps {
  onSave: (details: Record<string, any>) => void;
  categories: Category[];
  farms: Farm[];
  farm?: Farm;
  initialData?: Record<string, any> | null;
  onCancelEdit?: () => void;
}

export const PastureChangeForm: React.FC<FormProps> = ({ onSave, categories, farms, farm, initialData, onCancelEdit }) => {
  const getInitialState = () => ({
    date: '',
    animalCount: '',
    category: '',
    activity: '',
    originPasture: '',
    destinationFarmId: '',
    destinationPasture: '',
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
    const destFarm = farms.find(f => f.id === formData.destinationFarmId);
    onSave({
      ...formData,
      originFarm: farm ? `${farm.name} - ${farm.city}`: 'N/A',
      destinationFarm: destFarm ? `${destFarm.name} - ${destFarm.city}` : 'N/A'
    });
     if (!initialData) {
      setFormData(getInitialState());
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold text-brand-green mb-4">
        {initialData ? 'Editando Lançamento de Troca de Pasto' : 'Adicionar Lançamento de Troca de Pasto'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input label="Data" type="date" name="date" value={formData.date} onChange={handleChange} required />
        <Input label="Número de animais" type="number" name="animalCount" value={formData.animalCount} onChange={handleChange} />
        <Select label="Categoria" name="category" value={formData.category} onChange={handleChange}>
          <option value="">Selecione</option>
          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </Select>
        <Input label="Atividade" name="activity" value={formData.activity} onChange={handleChange} />
        <Input label="Pasto origem" name="originPasture" value={formData.originPasture} onChange={handleChange} />
        <Select label="Fazenda destino" name="destinationFarmId" value={formData.destinationFarmId} onChange={handleChange}>
           <option value="">Selecione</option>
           {farms.filter(f => f.id !== farm?.id).map(f => <option key={f.id} value={f.id}>{f.name} - {f.city}</option>)}
        </Select>
        <Input label="Pasto destino" name="destinationPasture" value={formData.destinationPasture} onChange={handleChange} />
      </div>
      <div className="pt-4 flex space-x-2">
        <Button type="submit">{initialData ? 'Atualizar Lançamento' : 'Adicionar Lançamento'}</Button>
        {initialData && onCancelEdit && <Button type="button" variant="secondary" onClick={onCancelEdit}>Cancelar Edição</Button>}
      </div>
    </form>
  );
};