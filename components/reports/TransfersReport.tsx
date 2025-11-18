
import React from 'react';

const ReportHeader: React.FC = () => (
  <thead>
    <tr className="bg-brand-green text-white">
      <th className="border p-1 font-semibold text-sm w-1/4"></th>
      <th className="border p-1 font-semibold text-sm"></th>
      <th className="border p-1 font-semibold text-sm">1 a 5</th>
      <th className="border p-1 font-semibold text-sm">6 a 12</th>
      <th className="border p-1 font-semibold text-sm">13 a 19</th>
      <th className="border p-1 font-semibold text-sm">20 a 30</th>
      <th className="border p-1 font-semibold text-sm">A.C. Mês</th>
      <th className="border p-1 font-semibold text-sm">A.C. Safra</th>
    </tr>
  </thead>
);

const TransferBlock: React.FC<{ details: any }> = ({ details }) => {
    return (
        <tbody className="bg-brand-green text-white">
            <tr>
                <td className="border p-1 text-sm font-medium">Fazenda Origem</td>
                <td className="border p-1 text-sm text-center">{details.originFarm}</td>
                <td colSpan={6} className="border p-1"></td>
            </tr>
            <tr>
                <td className="border p-1 text-sm font-medium">Fazenda Destino</td>
                <td className="border p-1 text-sm text-center">{details.destinationFarm}</td>
                 <td colSpan={6} className="border p-1"></td>
            </tr>
            <tr>
                <td className="border p-1 text-sm font-medium">Número de animais</td>
                <td className="border p-1 text-sm text-center">{details.animalCount}</td>
                 <td colSpan={6} className="border p-1"></td>
            </tr>
            <tr>
                <td className="border p-1 text-sm font-medium">Peso total (Kg)</td>
                <td className="border p-1 text-sm text-center">{details.totalWeight}</td>
                 <td colSpan={6} className="border p-1"></td>
            </tr>
             <tr>
                <td className="border p-1 text-sm font-medium">Peso médio (Kg)</td>
                <td className="border p-1 text-sm text-center">{details.avgWeight}</td>
                 <td colSpan={6} className="border p-1"></td>
            </tr>
             <tr>
                <td className="border p-1 text-sm font-medium">Valor total gerencial (R$)</td>
                <td className="border p-1 text-sm text-center">R$ {details.totalValue}</td>
                 <td colSpan={6} className="border p-1"></td>
            </tr>
        </tbody>
    )
}

export const TransfersReport: React.FC<{ data: any }> = ({ data }) => {
  const allTransferItems = data.protocols
    .filter((p: any) => p.type === 'transfers' && Array.isArray(p.processingDetails))
    .flatMap((p: any) => p.processingDetails);

  return (
    <div className="bg-white p-4 font-sans text-gray-800">
      <h2 className="text-center text-lg font-bold mb-4 uppercase">Transferência</h2>
      {allTransferItems.map((item: any, index: number) => (
        <table key={index} className="w-full bg-white border-collapse border border-gray-300 mb-6">
            <thead>
                <tr className="bg-brand-green text-white">
                    <th colSpan={8} className="border p-1 font-semibold text-sm text-left">TRANSFERÊNCIA</th>
                </tr>
            </thead>
            <TransferBlock details={item} />
        </table>
      ))}
      {allTransferItems.length === 0 && <p className="text-center text-gray-500">Nenhuma transferência encontrada para os filtros selecionados.</p>}
    </div>
  );
};