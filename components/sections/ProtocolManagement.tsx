

import React, { useState, useMemo } from 'react';
import { Card } from '../ui/Card';
import { Protocol, Farm, Company } from '../../types';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

interface ProtocolManagementProps {
  protocols: Protocol[];
  farms: Farm[];
  companies: Company[];
  onViewProtocol: (protocolId: string) => void;
  onProcessProtocol: (protocolId: string) => void;
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

export const ProtocolManagement: React.FC<ProtocolManagementProps> = ({ protocols, farms, companies, onViewProtocol, onProcessProtocol }) => {
  const [filterFarm, setFilterFarm] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  const availableYears = useMemo(() => {
    const years = new Set(protocols.map(p => new Date(p.createdAt).getFullYear().toString()));
    // FIX: Explicitly typed the sort callback parameters `a` and `b` as strings to resolve TypeScript error where they were inferred as `unknown`.
    return Array.from(years).sort((a: string, b: string) => parseInt(b) - parseInt(a));
  }, [protocols]);
  
  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({ value: (i + 1).toString(), name: new Date(0, i).toLocaleString('pt-BR', { month: 'long' }) }));
  }, []);

  const filteredProtocols = useMemo(() => {
    return protocols.filter(protocol => {
      if (filterFarm && protocol.farmId !== filterFarm) {
        return false;
      }
      const protocolDate = new Date(protocol.createdAt);
      if (filterYear && protocolDate.getFullYear().toString() !== filterYear) {
        return false;
      }
      if (filterMonth && (protocolDate.getMonth() + 1).toString() !== filterMonth) {
        return false;
      }
      return true;
    });
  }, [protocols, filterFarm, filterYear, filterMonth]);

  const resetFilters = () => {
    setFilterFarm('');
    setFilterYear('');
    setFilterMonth('');
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold text-brand-green mb-4">Gestão de Protocolos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 mb-6 border rounded-lg bg-gray-50">
          <Select label="Filtrar por Fazenda" value={filterFarm} onChange={e => setFilterFarm(e.target.value)}>
            <option value="">Todas as Fazendas</option>
            {farms.map(farm => <option key={farm.id} value={farm.id}>{farm.name}</option>)}
          </Select>
          <Select label="Filtrar por Ano" value={filterYear} onChange={e => setFilterYear(e.target.value)}>
            <option value="">Todos os Anos</option>
            {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
          </Select>
          <Select label="Filtrar por Mês" value={filterMonth} onChange={e => setFilterMonth(e.target.value)}>
             <option value="">Todos os Meses</option>
            {months.map(m => <option key={m.value} value={m.value}>{m.name.charAt(0).toUpperCase() + m.name.slice(1)}</option>)}
          </Select>
          <div className="flex items-end">
             <Button onClick={resetFilters} variant="secondary" className="w-full">Limpar Filtros</Button>
          </div>
      </div>

      {filteredProtocols.length > 0 ? (
        <ul className="divide-y divide-brand-light-gray">
          {[...filteredProtocols].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(protocol => {
            const farm = farms.find(f => f.id === protocol.farmId);
            const typeLabel = dispatchTypeToLabel[protocol.type] || 'Desconhecido';
            return (
              <li key={protocol.id}>
                <div 
                  onClick={() => onViewProtocol(protocol.id)} 
                  className="w-full text-left py-4 px-2 rounded-md hover:bg-brand-background transition-colors duration-200 cursor-pointer"
                >
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="flex-grow">
                      <p className="font-semibold text-brand-gold">{protocol.code}</p>
                      <p className="font-medium text-brand-green">{protocol.fileName}</p>
                      <p className="text-sm text-brand-gray">
                        <span className="font-medium">Tipo:</span> {typeLabel}
                      </p>
                      <p className="text-sm text-brand-gray">
                        <span className="font-medium">Fazenda:</span> {farm?.name} ({farm?.city})
                      </p>
                      <p className="text-sm text-brand-gray">
                        <span className="font-medium">Data:</span> {new Date(protocol.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 flex-shrink-0">
                      {protocol.status === 'open' ? (
                        <button 
                          onClick={(e) => { e.stopPropagation(); onProcessProtocol(protocol.id); }}
                          className="flex items-center space-x-1.5 px-2.5 py-1 text-xs font-semibold rounded-full text-yellow-800 bg-yellow-100 hover:bg-yellow-200 transition-colors"
                          aria-label="Registrar informações do protocolo"
                        >
                          <span>Registrar Informações</span>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                        </button>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full text-green-800 bg-green-100">
                          Aprovado
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="text-brand-gray text-center py-4">Nenhum protocolo encontrado para os filtros selecionados.</p>
      )}
    </Card>
  );
};