
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

export const DeathForm: React.FC<FormProps> = ({ onSave, categories, initialData, onCancelEdit }) => {
  const getInitialState = () => ({
    date: '',
    producer: '',
    sisbovEarring: '',
    animalId: '',
    chip: '',
    breed: '',
    sex: '',
    category: '',
    cause: '',
    pasture: '',
    activity: '',
    lastWeight: '',
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
        {initialData ? 'Editando Lançamento de Morte' : 'Adicionar Lançamento de Morte'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input label="Data" type="date" name="date" value={formData.date} onChange={handleChange} required />
        <Input label="Produtor" name="producer" value={formData.producer} onChange={handleChange} />
        <Input label="Brinco SISBOV" name="sisbovEarring" value={formData.sisbovEarring} onChange={handleChange} />
        <Input label="ID Animal" name="animalId" value={formData.animalId} onChange={handleChange} />
        <Input label="Chip" name="chip" value={formData.chip} onChange={handleChange} />
        <Input label="Raça" name="breed" value={formData.breed} onChange={handleChange} />
        <Select label="Sexo" name="sex" value={formData.sex} onChange={handleChange}>
          <option value="">Selecione</option>
          <option value="Macho">Macho</option>
          <option value="Fêmea">Fêmea</option>
        </Select>
        <Select label="Categoria" name="category" value={formData.category} onChange={handleChange}>
          <option value="">Selecione</option>
          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </Select>
        <Input label="Causa" name="cause" value={formData.cause} onChange={handleChange} />
        <Input label="Pasto" name="pasture" value={formData.pasture} onChange={handleChange} />
        <Input label="Atividade" name="activity" value={formData.activity} onChange={handleChange} />
        <Input label="Último Peso" type="number" name="lastWeight" value={formData.lastWeight} onChange={handleChange} />
      </div>
      <div className="pt-4 flex space-x-2">
        <Button type="submit">{initialData ? 'Atualizar Lançamento' : 'Adicionar Lançamento'}</Button>
        {initialData && onCancelEdit && <Button type="button" variant="secondary" onClick={onCancelEdit}>Cancelar Edição</Button>}
      </div>
    </form>
  );
};