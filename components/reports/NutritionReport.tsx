
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

const NutritionBlock: React.FC<{ details: any }> = ({ details }) => {
    return (
        <tbody className="bg-brand-green text-white">
            <tr>
                <td className="border p-1 text-sm font-medium">Produto</td>
                <td className="border p-1 text-sm text-center">{details.productName}</td>
                 <td colSpan={6} className="border p-1"></td>
            </tr>
            <tr>
                <td className="border p-1 text-sm font-medium">Consumo total (Kg)</td>
                <td className="border p-1 text-sm text-center">{details.totalVolume}</td>
                <td colSpan={6} className="border p-1"></td>
            </tr>
            <tr>
                <td className="border p-1 text-sm font-medium">Número de animais</td>
                <td className="border p-1 text-sm text-center"></td>
                <td colSpan={6} className="border p-1"></td>
            </tr>
             <tr>
                <td className="border p-1 text-sm font-medium">Categoria animal</td>
                <td className="border p-1 text-sm text-center"></td>
                <td colSpan={3} className="border p-1 text-right text-sm">Consumo por animal</td>
                <td colSpan={3} className="border p-1 text-sm"></td>
            </tr>
             <tr>
                <td colSpan={4} className="border p-1"></td>
                <td colSpan={3} className="border p-1 text-right text-sm">Consumo animal/dia</td>
                <td colSpan={1} className="border p-1 text-sm"></td>
            </tr>
        </tbody>
    )
}

export const NutritionReport: React.FC<{ data: any }> = ({ data }) => {
  const allNutritionItems = data.protocols
    .filter((p: any) => p.type === 'nutrition' && Array.isArray(p.processingDetails))
    .flatMap((p: any) => p.processingDetails);

  return (
    <div className="bg-white p-4 font-sans text-gray-800">
      <h2 className="text-center text-lg font-bold mb-4 uppercase">Nutrição</h2>
      {allNutritionItems.map((item: any, index: number) => (
        <table key={index} className="w-full bg-white border-collapse border border-gray-300 mb-6">
            <ReportHeader />
            <NutritionBlock details={item} />
        </table>
       ))}
       {allNutritionItems.length === 0 && <p className="text-center text-gray-500">Nenhum lançamento de nutrição encontrado para os filtros selecionados.</p>}
    </div>
  );
};