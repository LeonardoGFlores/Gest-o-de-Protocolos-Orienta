
import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Protocol, Farm, Company } from '../types';

interface ProtocolDetailProps {
  protocol: Protocol;
  farm?: Farm;
  company?: Company;
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

const DetailRow: React.FC<{ label: string; value?: string | number }> = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-brand-gray">{label}</p>
    <p className="text-md font-semibold text-brand-green">{value || 'N/A'}</p>
  </div>
);

const fieldLabels: Record<string, string> = {
  // General & Sales
  date: 'Data',
  pasture: 'Pasto',
  owner: 'Proprietário',
  buyer: 'Comprador',
  category: 'Categoria',
  quantity: 'Quantidade',
  sex: 'Sexo',
  avgWeight: 'P. médio',
  totalWeight: 'P. total',
  pricePerKg: 'R$ (Kg)',
  commissionPercentage: 'Comissão (%)',
  commissioned: 'Comissionado',
  commissionValue: 'Comissão (R$)',
  pricePerUnit: 'R$ (Un)',
  totalPrice: 'R$ (Total)',
  finalPricePerKg: 'R$ (Kg/Final)',
  invoiceNumber: 'Nº NFs°',
  productionSystem: 'Sistema de Produção',
  // Purchases
  supplier: 'Fornecedor',
  ageInMonths: 'Idade (mês)',
  freightValue: 'Frete (R$)',
  freighter: 'Freteiro',
  farmWeightTotal: 'Peso Fazenda (Total)',
  weightDifferenceKg: 'Diferença de peso (kg)',
  breakPercentage: 'Quebra (%)',
  // Deaths
  producer: 'Produtor',
  sisbovEarring: 'Brinco SISBOV',
  animalId: 'ID Animal',
  chip: 'Chip',
  breed: 'Raça',
  cause: 'Causa',
  activity: 'Atividade',
  lastWeight: 'Último Peso',
  // Births
  lot: 'Lote',
  mothersEarring: 'Brinco da Mãe',
  mothersChip: 'Chip da Mãe',
  mothersIron: 'Ferro Mãe',
  tattoo: 'Tatuagem',
  birthWeight: 'Peso',
  newbornEarring: 'Brinco do Nascido',
  newbornChip: 'Chip do Nascido',
  // Transfers
  originFarm: 'Fazenda de Origem',
  originPasture: 'Pasto de Origem',
  destinationFarm: 'Fazenda de Destino',
  destinationPasture: 'Pasto de Destino',
  animalCount: 'Número de animais',
  managerialKgValue: 'Valor do Kg gerencial',
  totalValue: 'Valor total',
  // Reproductions
  lotName: 'Nome do Lote',
  inseminated: 'Inseminadas',
  dgDate: 'Data do DG',
  dgDayInterval: 'Intervalo de dias no DG',
  pregnant: 'Prenhas',
  empty: 'Vazias',
  missed: 'Faltaram',
  diagnosed: 'Diagnosticadas',
  pregnancyRate: 'Taxa de Prenhez (%)',
  // Weaning
  cowCategory: 'Categoria da vaca',
  weaningLot: 'Lote de desmame',
  // Nutrition
  productType: 'Tipo de produto',
  productName: 'Nome do produto',
  companyName: 'Empresa',
  unit: 'Unidade (Sc/Kg...)',
  unitVolume: 'Volume da unidade (Kg)',
  totalVolume: 'Volume total (Kg)',
  estimatedConsumption: 'Consumo estimado (%.P.V)',
  // Fertilization
  hectares: 'Hectares',
  fertilizationType: 'Tipo de adubação',
  formula: 'Fórmula (NPK)',
  quantityPerHectare: 'Quantidade por hectare (Kg)',
  totalQuantity: 'Quantidade total (Kg)',
  // General
  notes: 'Observações'
};

const ProtocolDetailsTable: React.FC<{ details: Record<string, any>[] }> = ({ details }) => {
  if (!details || details.length === 0) {
    return <p className="text-brand-gray">Nenhuma informação registrada para este protocolo.</p>;
  }

  const headers = Object.keys(details[0]).map(key => ({
    key,
    label: fieldLabels[key] || key,
  }));

  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-brand-light-gray bg-gray-50">
            {headers.map(header => (
              <th key={header.key} className="p-2 font-semibold text-brand-gray">{header.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {details.map((item, index) => (
            <tr key={index} className="border-b border-brand-light-gray last:border-0 hover:bg-gray-50">
              {headers.map(header => (
                <td key={header.key} className="p-2 text-brand-gray">{item[header.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export const ProtocolDetail: React.FC<ProtocolDetailProps> = ({ protocol, farm, company, onBack }) => {
  const typeLabel = dispatchTypeToLabel[protocol.type] || 'Desconhecido';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-green">Detalhes do Protocolo</h2>
        <Button onClick={onBack} variant="secondary">Voltar</Button>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DetailRow label="Código do Protocolo" value={protocol.code} />
          <DetailRow label="Tipo de Lançamento" value={typeLabel} />
          <div>
            <p className="text-sm font-medium text-brand-gray">Status</p>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
              protocol.status === 'open' 
              ? 'text-yellow-800 bg-yellow-100' 
              : 'text-green-800 bg-green-100'
            }`}>
              {protocol.status === 'open' ? 'Em Aberto' : 'Aprovado'}
            </span>
          </div>
          <DetailRow label="Data de Criação" value={new Date(protocol.createdAt).toLocaleString()} />
          {protocol.updatedAt && <DetailRow label="Data de Aprovação" value={new Date(protocol.updatedAt).toLocaleString()} />}
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-semibold text-brand-green mb-4">Informações da Vinculação</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailRow label="Empresa" value={company?.name} />
          <DetailRow label="Fazenda" value={farm ? `${farm.name} - ${farm.city}` : 'N/A'} />
          <DetailRow label="Sistema de Produção" value={farm?.productionSystem} />
        </div>
      </Card>

      {protocol.processingDetails && protocol.status === 'closed' && (
        <Card>
          <h3 className="text-xl font-semibold text-brand-green mb-4">Informações Registradas</h3>
          <ProtocolDetailsTable details={protocol.processingDetails} />
        </Card>
      )}

      <Card>
        <h3 className="text-xl font-semibold text-brand-green mb-4">Arquivo Anexado</h3>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-sm font-medium text-brand-gray">Nome do Arquivo</p>
              <p className="text-md font-semibold text-brand-green break-all">{protocol.fileName}</p>
            </div>
            <a href={protocol.fileContent} download={protocol.fileName} className="mt-2 sm:mt-0">
              <Button>
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  <span>Visualizar / Baixar Arquivo</span>
                </div>
              </Button>
            </a>
        </div>
      </Card>
    </div>
  );
};