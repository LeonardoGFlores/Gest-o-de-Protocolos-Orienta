import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Farm, Protocol, Category } from '../types';

interface FarmDashboardProps {
  farm: Farm;
  protocols: Protocol[];
  categories: Category[];
  onBack: () => void;
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

const getCategoryName = (id: string, categories: Category[]) => categories.find(c => c.id === id)?.name || 'N/A';

export const FarmDashboard: React.FC<FarmDashboardProps> = ({ farm, protocols, categories, onBack }) => {
  const totalAnimals = farm.animalDistribution.reduce((acc, curr) => acc + curr.quantity, 0);

  const operationsSummary = protocols.reduce((acc, protocol) => {
    const details = protocol.processingDetails;
    if (!details) return acc;

    switch (protocol.type) {
      // FIX: processingDetails is an array. Sum quantities from all detail items.
      case 'purchases':
        details.forEach(d => {
          acc.purchased += parseInt(d.quantity, 10) || 0;
        });
        break;
      // FIX: processingDetails is an array. Sum quantities from all detail items.
      case 'sales':
        details.forEach(d => {
          acc.sold += parseInt(d.quantity, 10) || 0;
        });
        break;
      // FIX: Each detail item represents one birth.
      case 'births':
        acc.born += details.length;
        break;
      // FIX: Each detail item represents one death.
      case 'deaths':
        acc.died += details.length;
        break;
    }
    return acc;
  }, { purchased: 0, sold: 0, born: 0, died: 0 });

  // FIX: Updated getProtocolChangeText to correctly access properties from the processingDetails array, which contains an object for each record.
  // This function now handles cases with single or multiple detail entries for a more accurate summary.
  const getProtocolChangeText = (protocol: Protocol): string => {
    const details = protocol.processingDetails;
    if (!details || details.length === 0) return "Dados não registrados";
    
    const firstDetail = details[0];

    switch (protocol.type) {
      case 'purchases':
        if (details.length === 1) {
            return `+${firstDetail.quantity} ${firstDetail.category}`;
        }
        const totalPurchased = details.reduce((sum, d) => sum + (parseInt(d.quantity, 10) || 0), 0);
        return `+${totalPurchased} animais em ${details.length} lotes`;
      case 'sales':
        if (details.length === 1) {
            return `-${firstDetail.quantity} ${firstDetail.category}`;
        }
        const totalSold = details.reduce((sum, d) => sum + (parseInt(d.quantity, 10) || 0), 0);
        return `-${totalSold} animais em ${details.length} lotes`;
      case 'deaths':
        if (details.length === 1) {
            return `-1 ${firstDetail.category}`;
        }
        return `-${details.length} mortes`;
      case 'births':
        if (details.length === 1) {
            return `+1 ${firstDetail.sex === 'Macho' ? 'Bezerro' : 'Bezerra'}`;
        }
        return `+${details.length} nascimentos`;
       case 'transfers':
        if (details.length === 1) {
            return `${firstDetail.animalCount} ${firstDetail.category} para ${firstDetail.destinationFarm}`;
        }
        const totalTransferred = details.reduce((sum, d) => sum + (parseInt(d.animalCount, 10) || 0), 0);
        return `${totalTransferred} animais transferidos`;
      default:
        return "Sem impacto no inventário";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-brand-green">{farm.name}</h2>
          <p className="text-brand-gray">{farm.city}</p>
        </div>
        <Button onClick={onBack} variant="secondary">Voltar para a Lista</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <h3 className="text-md font-semibold text-brand-gray">Animais Comprados</h3>
            <p className="text-3xl font-bold text-brand-green">{operationsSummary.purchased}</p>
          </Card>
          <Card>
            <h3 className="text-md font-semibold text-brand-gray">Animais Vendidos</h3>
            <p className="text-3xl font-bold text-brand-green">{operationsSummary.sold}</p>
          </Card>
          <Card>
            <h3 className="text-md font-semibold text-brand-gray">Nascimentos</h3>
            <p className="text-3xl font-bold text-brand-green">{operationsSummary.born}</p>
          </Card>
          <Card>
            <h3 className="text-md font-semibold text-brand-gray">Mortes</h3>
            <p className="text-3xl font-bold text-brand-green">{operationsSummary.died}</p>
          </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <h3 className="text-xl font-semibold text-brand-green mb-4">Inventário de Animais</h3>
          {farm.animalDistribution.length > 0 ? (
            <ul className="space-y-2">
              {farm.animalDistribution.map(dist => (
                <li key={dist.categoryId} className="flex justify-between items-center text-brand-gray">
                  <span>{getCategoryName(dist.categoryId, categories)}</span>
                  <span className="font-bold text-brand-green">{dist.quantity}</span>
                </li>
              ))}
              <li className="flex justify-between items-center text-brand-green font-bold border-t pt-2 mt-2">
                  <span>TOTAL</span>
                  <span>{totalAnimals}</span>
              </li>
            </ul>
          ) : (
            <p className="text-brand-gray">Nenhum animal no inventário.</p>
          )}
        </Card>
        
        <Card className="lg:col-span-2">
          <h3 className="text-xl font-semibold text-brand-green mb-4">Histórico de Protocolos da Fazenda</h3>
          {protocols.length > 0 ? (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-brand-light-gray">
                    <th className="py-2 px-2 text-sm font-semibold text-brand-gray">Data</th>
                    <th className="py-2 px-2 text-sm font-semibold text-brand-gray">Tipo</th>
                    <th className="py-2 px-2 text-sm font-semibold text-brand-gray">Código</th>
                    <th className="py-2 px-2 text-sm font-semibold text-brand-gray">Alteração no Inventário</th>
                  </tr>
                </thead>
                <tbody>
                  {protocols.map(protocol => (
                    <tr key={protocol.id} className="border-b border-brand-light-gray last:border-b-0">
                      <td className="py-3 px-2 text-sm text-brand-gray">{new Date(protocol.updatedAt || protocol.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-2 text-sm text-brand-gray">{dispatchTypeToLabel[protocol.type] || protocol.type}</td>
                      <td className="py-3 px-2 text-sm font-medium text-brand-gold">{protocol.code}</td>
                      <td className="py-3 px-2 text-sm font-medium text-brand-green">{getProtocolChangeText(protocol)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-brand-gray">Nenhum protocolo aprovado para esta fazenda ainda.</p>
          )}
        </Card>
      </div>
    </div>
  );
};
