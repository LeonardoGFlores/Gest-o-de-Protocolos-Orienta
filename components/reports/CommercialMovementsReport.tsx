
import React from 'react';

const ReportHeader: React.FC = () => (
  <thead>
    <tr className="bg-brand-green text-white">
      <th className="border p-1 font-semibold text-sm w-1/4"></th>
      <th className="border p-1 font-semibold text-sm">1 a 5</th>
      <th className="border p-1 font-semibold text-sm">6 a 12</th>
      <th className="border p-1 font-semibold text-sm">13 a 19</th>
      <th className="border p-1 font-semibold text-sm">20 a 30</th>
      <th className="border p-1 font-semibold text-sm">A.C. Mês</th>
      <th className="border p-1 font-semibold text-sm">A.C. Safra</th>
    </tr>
  </thead>
);

const ReportRow: React.FC<{ label: string, data: any[], accessor: (item: any) => number | string, isCurrency?: boolean }> = ({ label, data, accessor, isCurrency }) => {
  const getDay = (dateStr: string) => new Date(dateStr).getDate();
  
  const sumByDayRange = (start: number, end: number) => {
    return data
      .filter(p => getDay(p.updatedAt) >= start && getDay(p.updatedAt) <= end)
      .reduce((acc, curr) => acc + (Number(accessor(curr)) || 0), 0);
  };
  
  const week1 = sumByDayRange(1, 5);
  const week2 = sumByDayRange(6, 12);
  const week3 = sumByDayRange(13, 19);
  const week4 = sumByDayRange(20, 31);
  const monthTotal = week1 + week2 + week3 + week4;
  
  // A.C Safra is not implemented as "Safra" is not defined, showing year total as placeholder
  const yearTotal = data.reduce((acc, curr) => acc + (Number(accessor(curr)) || 0), 0);
  
  const format = (val: number) => isCurrency ? `R$ ${val.toFixed(2)}` : val.toFixed(0);

  return (
    <tr className="bg-brand-green text-white">
      <td className="border p-1 text-sm font-medium">{label}</td>
      <td className="border p-1 text-sm text-center">{format(week1)}</td>
      <td className="border p-1 text-sm text-center">{format(week2)}</td>
      <td className="border p-1 text-sm text-center">{format(week3)}</td>
      <td className="border p-1 text-sm text-center">{format(week4)}</td>
      <td className="border p-1 text-sm text-center font-bold">{format(monthTotal)}</td>
      <td className="border p-1 text-sm text-center font-bold">{format(yearTotal)}</td>
    </tr>
  );
};


export const CommercialMovementsReport: React.FC<{ data: any }> = ({ data }) => {
  const { protocols } = data;

  const purchases = protocols
    .filter((p: any) => p.type === 'purchases' && Array.isArray(p.processingDetails))
    .flatMap((p: any) => p.processingDetails.map((d: any) => ({ ...d, updatedAt: p.updatedAt })));

  const sales = protocols
    .filter((p: any) => p.type === 'sales' && Array.isArray(p.processingDetails))
    .flatMap((p: any) => p.processingDetails.map((d: any) => ({ ...d, updatedAt: p.updatedAt })));

  
  return (
    <div className="bg-white p-4 font-sans text-gray-800">
      <h2 className="text-center text-lg font-bold mb-4 uppercase">Movimentações Comerciais</h2>
      
      <h3 className="font-bold text-md mb-2">COMPRAS</h3>
      <table className="w-full bg-white border-collapse border border-gray-300 mb-6">
        <ReportHeader />
        <tbody>
          <ReportRow label="Número de animais" data={purchases} accessor={d => d.quantity} />
          <ReportRow label="Peso total (Kg)" data={purchases} accessor={d => d.totalWeight} />
          <ReportRow label="Peso médio (Kg)" data={[]} accessor={() => 0} />
          <ReportRow label="Valor total (R$)" data={purchases} accessor={d => d.totalPrice} isCurrency />
          <ReportRow label="Valor unitário (R$)" data={purchases} accessor={d => d.pricePerUnit} isCurrency />
          <ReportRow label="Valor do Kg (R$)" data={purchases} accessor={d => d.pricePerKg} isCurrency />
        </tbody>
      </table>

      <h3 className="font-bold text-md mb-2">VENDAS</h3>
      <table className="w-full bg-white border-collapse border border-gray-300">
        <ReportHeader />
        <tbody>
          <ReportRow label="Número de animais" data={sales} accessor={d => d.quantity} />
          <ReportRow label="Peso total (Kg)" data={sales} accessor={d => d.totalWeight} />
          <ReportRow label="Peso médio (Kg)" data={[]} accessor={() => 0} />
          <ReportRow label="Valor total (R$)" data={sales} accessor={d => d.totalPrice} isCurrency />
          <ReportRow label="Valor unitário (R$)" data={sales} accessor={d => d.pricePerUnit} isCurrency />
          <ReportRow label="Valor do Kg (R$)" data={sales} accessor={d => d.pricePerKg} isCurrency />
        </tbody>
      </table>
    </div>
  );
};