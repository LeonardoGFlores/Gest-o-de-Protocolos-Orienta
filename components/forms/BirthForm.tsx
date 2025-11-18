
import React, { useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

interface FormProps {
  onSave: (details: Record<string, any>) => void;
  initialData?: Record<string, any> | null;
  onCancelEdit?: () => void;
}

export const BirthForm: React.FC<FormProps> = ({ onSave, initialData, onCancelEdit }) => {
  const getInitialState = () => ({
    date: '',
    pasture: '',
    lot: '',
    mothersEarring: '',
    mothersChip: '',
    mothersIron: '',
    tattoo: '',
    sex: '',
    breed: '',
    birthWeight: '',
    newbornEarring: '',
    newbornChip: '',
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
        {initialData ? 'Editando Lançamento de Nascimento' : 'Adicionar Lançamento de Nascimento'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input label="Data" type="date" name="date" value={formData.date} onChange={handleChange} required />
        <Input label="Pasto" name="pasture" value={formData.pasture} onChange={handleChange} />
        <Input label="Lote" name="lot" value={formData.lot} onChange={handleChange} />
        <Input label="Brinco da Mãe" name="mothersEarring" value={formData.mothersEarring} onChange={handleChange} />
        <Input label="Chip da Mãe" name="mothersChip" value={formData.mothersChip} onChange={handleChange} />
        <Input label="Ferro Mãe" name="mothersIron" value={formData.mothersIron} onChange={handleChange} />
        <Input label="Tatuagem" name="tattoo" value={formData.tattoo} onChange={handleChange} />
        <Select label="Sexo" name="sex" value={formData.sex} onChange={handleChange}>
          <option value="">Selecione</option>
          <option value="Macho">Macho</option>
          <option value="Fêmea">Fêmea</option>
        </Select>
        <Input label="Raça" name="breed" value={formData.breed} onChange={handleChange} />
        <Input label="Peso" type="number" name="birthWeight" value={formData.birthWeight} onChange={handleChange} />
        <Input label="Brinco do Nascido" name="newbornEarring" value={formData.newbornEarring} onChange={handleChange} />
        <Input label="Chip do Nascido" name="newbornChip" value={formData.newbornChip} onChange={handleChange} />
      </div>
      <div className="pt-4 flex space-x-2">
        <Button type="submit">{initialData ? 'Atualizar Lançamento' : 'Adicionar Lançamento'}</Button>
        {initialData && onCancelEdit && <Button type="button" variant="secondary" onClick={onCancelEdit}>Cancelar Edição</Button>}
      </div>
    </form>
  );
};