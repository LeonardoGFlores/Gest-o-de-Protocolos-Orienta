import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Farm, Company, Category, FarmCategory } from '../types';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';

interface FarmManagementProps {
  farms: Farm[];
  companies: Company[];
  categories: Category[];
  addFarm: (farm: Omit<Farm, 'id'>) => void;
  updateFarm: (id: string, farm: Omit<Farm, 'id'>) => void;
  deleteFarm: (id: string) => void;
  onViewFarmDashboard: (farmId: string) => void;
}

export const FarmManagement: React.FC<FarmManagementProps> = ({ farms, companies, categories, addFarm, updateFarm, deleteFarm, onViewFarmDashboard }) => {
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  
  const [companyId, setCompanyId] = useState<string>('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [size, setSize] = useState('');
  const [productionSystem, setProductionSystem] = useState('');
  const [animalDistribution, setAnimalDistribution] = useState<Record<string, number>>({});

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editingFarm) {
        setCompanyId(editingFarm.companyId);
        setName(editingFarm.name);
        setCity(editingFarm.city);
        setSize(editingFarm.size.toString());
        setProductionSystem(editingFarm.productionSystem);
        const distribution = editingFarm.animalDistribution.reduce((acc, curr) => {
            acc[curr.categoryId] = curr.quantity;
            return acc;
        }, {} as Record<string, number>);
        setAnimalDistribution(distribution);
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
        resetForm();
    }
  }, [editingFarm]);


  const handleDistributionChange = (categoryId: string, quantity: string) => {
    const numQuantity = parseInt(quantity, 10) || 0;
    setAnimalDistribution(prev => ({ ...prev, [categoryId]: numQuantity }));
  };
  
  const totalAnimals = useMemo(() => {
    return Object.values(animalDistribution).reduce((sum: number, qty: number) => sum + qty, 0);
  }, [animalDistribution]);

  const resetForm = () => {
    setCompanyId('');
    setName('');
    setCity('');
    setSize('');
    setProductionSystem('');
    setAnimalDistribution({});
    setEditingFarm(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyId && name.trim() && city.trim() && size && productionSystem.trim()) {
      const formattedDistribution = Object.entries(animalDistribution).map(([categoryId, quantity]) => ({
        categoryId,
        quantity
      }));
      const farmData = { 
        companyId,
        name,
        city, 
        size: parseFloat(size), 
        productionSystem, 
        animalDistribution: formattedDistribution 
      };

      if (editingFarm) {
        updateFarm(editingFarm.id, farmData);
      } else {
        addFarm(farmData);
      }
      resetForm();
    }
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta fazenda? Esta ação não pode ser desfeita.')) {
        deleteFarm(id);
    }
  };

  const getCompanyDetails = (id: string) => {
      const company = companies.find(c => c.id === id);
      return { name: company?.name || 'Empresa não encontrada' };
  };

  return (
    <div className="space-y-6">
      <Card ref={formRef}>
        <h2 className="text-xl font-semibold text-brand-green mb-4">
            {editingFarm ? 'Editar Fazenda' : 'Adicionar Nova Fazenda'}
        </h2>
        {companies.length > 0 && categories.length > 0 ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label="Empresa" id="farmCompany" value={companyId} onChange={(e) => setCompanyId(e.target.value)} required>
            <option value="">Selecione uma empresa</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>{getCompanyDetails(company.id).name}</option>
            ))}
          </Select>
          <Input label="Nome da Fazenda" id="farmName" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Cidade" id="farmCity" value={city} onChange={(e) => setCity(e.target.value)} required />
          <Input label="Tamanho da Fazenda (hectares)" type="number" id="farmSize" value={size} onChange={(e) => setSize(e.target.value)} required />
          <Input label="Sistema de Produção" id="farmProdSystem" value={productionSystem} onChange={(e) => setProductionSystem(e.target.value)} placeholder="Ex: Confinamento" required />
          
          <div>
            <h3 className="text-lg font-medium text-brand-green mt-6 mb-2">Inventário de Animais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map(cat => (
                <Input 
                  key={cat.id}
                  label={cat.name}
                  id={`cat-${cat.id}`}
                  type="number"
                  value={animalDistribution[cat.id] || ''}
                  onChange={(e) => handleDistributionChange(cat.id, e.target.value)}
                />
              ))}
            </div>
            <p className="mt-4 text-brand-gray font-semibold">Total de Animais: {totalAnimals}</p>
          </div>

          <div className="flex space-x-2 pt-2">
            <Button type="submit" className="mt-4">{editingFarm ? 'Salvar Alterações' : 'Adicionar Fazenda'}</Button>
            {editingFarm && <Button type="button" variant="secondary" className="mt-4" onClick={resetForm}>Cancelar</Button>}
          </div>
        </form>
        ) : (
          <p className="text-brand-gray">Por favor, cadastre uma empresa e pelo menos uma categoria de animal antes de adicionar uma fazenda.</p>
        )}
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-brand-green mb-4">Minhas Fazendas</h2>
        {farms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {farms.map((farm) => (
              <div key={farm.id} className="p-4 space-y-2 border border-brand-light-gray rounded-lg hover:shadow-md transition-shadow duration-200 group">
                <div onClick={() => onViewFarmDashboard(farm.id)} className="cursor-pointer">
                    <p className="font-semibold text-brand-green text-lg group-hover:text-brand-gold transition-colors">{farm.name} - {farm.city}</p>
                    <p className="text-sm text-brand-gray">Empresa: {getCompanyDetails(farm.companyId).name}</p>
                    <p className="text-sm text-brand-gray">Total de Animais: <span className="font-bold">{farm.animalDistribution.reduce((acc, curr) => acc + curr.quantity, 0)}</span></p>
                </div>
                <div className="flex space-x-2 pt-2 border-t border-brand-light-gray">
                    <Button onClick={() => setEditingFarm(farm)} variant="secondary" className="px-3 py-1 text-xs">Editar</Button>
                    <Button onClick={() => handleDelete(farm.id)} variant="secondary" className="px-3 py-1 text-xs !bg-red-100 !text-red-700 hover:!bg-red-200">Excluir</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-brand-gray">Nenhuma fazenda cadastrada ainda.</p>
        )}
      </Card>
      
    </div>
  );
};