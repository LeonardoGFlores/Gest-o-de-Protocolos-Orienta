
import React from 'react';

const ReportHeader: React.FC = () => (
    <thead>
        <tr className="bg-brand-green text-white">
            <th className="border p-1 font-semibold text-sm w-1/4"></th>
            <th className="border p-1 font-semibold text-sm w-1/6"></th>
            <th className="border p-1 font-semibold text-sm">1 a 5</th>
            <th className="border p-1 font-semibold text-sm">6 a 12</th>
            <th className="border p-1 font-semibold text-sm">13 a 19</th>
            <th className="border p-1 font-semibold text-sm">20 a 30</th>
            <th className="border p-1 font-semibold text-sm">A.C. Mês</th>
            <th className="border p-1 font-semibold text-sm">A.C. Safra</th>
        </tr>
    </thead>
);

const FertilizationBlock: React.FC<{ details: any }> = ({ details }) => {
    return (
        <tbody className="bg-brand-green text-white">
            <tr>
                <td className="border p-1 text-sm font-medium">Pasto</td>
                <td className="border p-1 text-sm text-center">{details.pasture}</td>
                <td colSpan={6} className="border p-1"></td>
            </tr>
            <tr>
                <td className="border p-1 text-sm font-medium">Hectares</td>
                <td className="border p-1 text-sm text-center">{details.hectares}</td>
                <td colSpan={6} className="border p-1"></td>
            </tr>
            <tr>
                <td className="border p-1 text-sm font-medium">Fórmula (NPK)</td>
                <td className="border p-1 text-sm text-center">{details.formula}</td>
                <td colSpan={6} className="border p-1"></td>
            </tr>
            <tr>
                <td className="border p-1 text-sm font-medium">Densidade total (Kg)</td>
                <td className="border p-1 text-sm text-center">{details.totalQuantity}</td>
                <td colSpan={6} className="border p-1"></td>
            </tr>
            <tr>
                <td className="border p-1 text-sm font-medium">Densidade/há (kg)</td>
                <td className="border p-1 text-sm text-center">{details.quantityPerHectare}</td>
                <td colSpan={6} className="border p-1"></td>
            </tr>
            <tr>
                <td className="border p-1 text-sm font-medium">Valor total (R$)</td>
                <td className="border p-1 text-sm text-center">R$ {details.totalPrice}</td>
                <td colSpan={6} className="border p-1"></td>
            </tr>
            <tr>
                <td className="border p-1 text-sm font-medium">Valor por hectare (R$)</td>
                <td className="border p-1 text-sm text-center"></td>
                <td colSpan={6} className="border p-1"></td>
            </tr>
        </tbody>
    )
}

export const FertilizationReport: React.FC<{ data: any }> = ({ data }) => {
  const allFertilizationItems = data.protocols
    .filter((p: any) => p.type === 'fertilization' && Array.isArray(p.processingDetails))
    .flatMap((p: any) => p.processingDetails);

  return (
    <div className="bg-white p-4 font-sans text-gray-800">
      <h2 className="text-center text-lg font-bold mb-4 uppercase">Adubação</h2>
      {allFertilizationItems.map((item: any, index: number) => (
        <table key={index} className="w-full bg-white border-collapse border border-gray-300 mb-6">
            <ReportHeader />
            <FertilizationBlock details={item} />
        </table>
      ))}
      {allFertilizationItems.length === 0 && <p className="text-center text-gray-500">Nenhum lançamento de adubação encontrado para os filtros selecionados.</p>}
    </div>
  );
};