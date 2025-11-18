
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Protocol, Farm, Company, Category } from '../types';

import { PurchaseForm } from './forms/PurchaseForm';
import { SaleForm } from './forms/SaleForm';
import { DeathForm } from './forms/DeathForm';
import { BirthForm } from './forms/BirthForm';
import { TransferForm } from './forms/TransferForm';
import { ReproductionForm } from './forms/ReproductionForm';
import { WeaningForm } from './forms/WeaningForm';
import { NutritionForm } from './forms/NutritionForm';
import { FertilizationForm } from './forms/FertilizationForm';
import { PastureChangeForm } from './forms/PastureChangeForm';

interface ProcessProtocolProps {
  protocol: Protocol;
  onUpdate: (protocolId: string, updates: Partial<Omit<Protocol, 'id'>>) => void;
  onBack: () => void;
  categories: Category[];
  farms: Farm[];
  companies: Company[];
}

const dispatchTypeToLabel: Record<string, string> = {
  purchases: 'Compra',
  sales: 'Venda',
  deaths: 'Morte',
  births: 'Nascimento',
  transfers: 'Transferência',
  reproductions: 'Reprodução',
  weanings: 'Desmame',
  nutrition: 'Nutrição',
  fertilization: 'Adubação',
  pastureChanges: 'Troca de Pasto',
};

const fieldLabels: Record<string, string> = {
  date: 'Data',
  category: 'Categoria',
  quantity: 'Qtd',
  sex: 'Sexo',
  totalPrice: 'R$ Total',
  animalId: 'ID Animal',
  cause: 'Causa',
  productName: 'Produto',
  totalVolume: 'Volume Total (Kg)',
  originFarm: 'Origem',
  destinationFarm: 'Destino',
  animalCount: 'Animais',
};


export const ProcessProtocol: React.FC<ProcessProtocolProps> = ({ protocol, onUpdate, onBack, categories, farms, companies }) => {
  const [items, setItems] = useState<Record<string, any>[]>([]);
  const [editingItem, setEditingItem] = useState<{ index: number; data: Record<string, any> } | null>(null);
  
  const farm = farms.find(f => f.id === protocol.farmId);
  const company = farm ? companies.find(c => c.id === farm.companyId) : undefined;
  const typeLabel = dispatchTypeToLabel[protocol.type] || 'Desconhecido';

  const handleSaveItem = (data: Record<string, any>) => {
    if (editingItem !== null) {
      const updatedItems = [...items];
      updatedItems[editingItem.index] = data;
      setItems(updatedItems);
      setEditingItem(null);
    } else {
      setItems([...items, data]);
    }
  };

  const handleEditItem = (index: number) => {
    setEditingItem({ index, data: items[index] });
     window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleDeleteItem = (index: number) => {
    if (window.confirm('Tem certeza que deseja remover este lançamento?')) {
        setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleFinalize = () => {
    if (items.length === 0) {
      alert('Adicione pelo menos um lançamento antes de finalizar.');
      return;
    }
    onUpdate(protocol.id, {
      status: 'closed',
      processingDetails: items,
    });
    onBack();
  };


  const renderForm = () => {
    const formProps = {
      onSave: handleSaveItem,
      initialData: editingItem?.data,
      onCancelEdit: () => setEditingItem(null),
      categories,
      farms,
      farm,
    };
    switch (protocol.type) {
        case 'purchases': return <PurchaseForm {...formProps} />;
        case 'sales': return <SaleForm {...formProps} />;
        case 'deaths': return <DeathForm {...formProps} />;
        case 'births': return <BirthForm {...formProps} />;
        case 'transfers': return <TransferForm {...formProps} />;
        case 'reproductions': return <ReproductionForm {...formProps} />;
        case 'weanings': return <WeaningForm {...formProps} />;
        case 'nutrition': return <NutritionForm {...formProps} />;
        case 'fertilization': return <FertilizationForm {...formProps} />;
        case 'pastureChanges': return <PastureChangeForm {...formProps} />;
        default: return <p>Formulário não encontrado para este tipo de protocolo.</p>;
    }
  };
  
  const headers = items.length > 0 ? Object.keys(items[0]).map(key => ({ key, label: fieldLabels[key] || key })).filter(h => fieldLabels[h.key]) : [];


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-green">Registrar Informações do Protocolo</h2>
      </div>
      
      <Card>
        <div className="mb-6 border-b border-brand-light-gray pb-4">
            <p className="text-sm font-medium text-brand-gray">Protocolo</p>
            <p className="text-lg font-semibold text-brand-gold">{protocol.code}</p>
            <p className="text-sm text-brand-gray">{typeLabel} - Criado em {new Date(protocol.createdAt).toLocaleDateString()}</p>
            <p className="text-sm text-brand-gray"><b>Fazenda:</b> {farm?.name} - {farm?.city} ({company?.name})</p>
        </div>
        
        {renderForm()}
      </Card>
      
      {items.length > 0 && (
        <Card>
          <h3 className="text-xl font-semibold text-brand-green mb-4">Lançamentos Adicionados</h3>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-light-gray bg-gray-50">
                  {headers.map(h => <th key={h.key} className="p-2 font-semibold text-brand-gray">{h.label}</th>)}
                  <th className="p-2 font-semibold text-brand-gray text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b border-brand-light-gray last:border-0 hover:bg-gray-50">
                    {headers.map(h => <td key={h.key} className="p-2 text-brand-gray">{item[h.key]}</td>)}
                    <td className="p-2 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button onClick={() => handleEditItem(index)} variant="secondary" className="px-2 py-1 text-xs">Editar</Button>
                        <Button onClick={() => handleDeleteItem(index)} variant="secondary" className="px-2 py-1 text-xs !bg-red-100 !text-red-700 hover:!bg-red-200">Excluir</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <div className="flex justify-end space-x-2 mt-6">
        <Button onClick={onBack} variant="secondary">Voltar</Button>
        <Button onClick={handleFinalize} disabled={items.length === 0}>Finalizar e Aprovar Protocolo</Button>
      </div>
    </div>
  );
};