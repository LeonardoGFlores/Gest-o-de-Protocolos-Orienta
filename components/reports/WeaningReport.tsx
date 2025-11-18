
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

const DataBlock: React.FC<{ title: string, data: any[], filterFn?: (item: any) => boolean }> = ({ title, data, filterFn = () => true }) => {
    const filteredData = data.filter(filterFn);
    const totalAnimals = filteredData.reduce((acc, item) => acc + (Number(item.animalCount) || 0), 0);
    const totalWeight = filteredData.reduce((acc, item) => acc + (Number(item.totalWeight) || 0), 0);
    const avgWeight = totalAnimals > 0 ? (totalWeight / totalAnimals).toFixed(2) : '0.00';

    return (
        <tbody className="bg-brand-green text-white">
            <tr>
                <td colSpan={8} className="border p-1 text-sm font-semibold">{title}</td>
            </tr>
            <tr>
                <td className="border p-1 text-sm font-medium">Animais desmamados</td>
                 <td colSpan={4} className="border p-1 text-sm text-center"></td>
                <td className="border p-1 text-sm text-center font-bold">{totalAnimals}</td>
                <td className="border p-1 text-sm text-center font-bold">{totalAnimals}</td>
            </tr>
            <tr>
                <td className="border p-1 text-sm font-medium">Peso total (Kg)</td>
                <td colSpan={4} className="border p-1 text-sm text-center"></td>
                <td className="border p-1 text-sm text-center font-bold">{totalWeight.toFixed(2)}</td>
                <td className="border p-1 text-sm text-center font-bold">{totalWeight.toFixed(2)}</td>
            </tr>
            <tr>
                <td className="border p-1 text-sm font-medium">Peso médio (Kg)</td>
                 <td colSpan={4} className="border p-1 text-sm text-center"></td>
                <td className="border p-1 text-sm text-center font-bold">{avgWeight}</td>
                <td className="border p-1 text-sm text-center font-bold">{avgWeight}</td>
            </tr>
        </tbody>
    )
}

export const WeaningReport: React.FC<{ data: any }> = ({ data }) => {
  const allWeaningItems = data.protocols
    .filter((p: any) => p.type === 'weanings' && Array.isArray(p.processingDetails))
    .flatMap((p: any) => p.processingDetails);

  return (
    <div className="bg-white p-4 font-sans text-gray-800">
      <h2 className="text-center text-lg font-bold mb-4 uppercase">Desmame</h2>
      <table className="w-full bg-white border-collapse border border-gray-300 mb-6">
          <DataBlock title="" data={allWeaningItems} />
      </table>
      <table className="w-full bg-white border-collapse border border-gray-300 mb-6">
          <DataBlock title="Machos" data={allWeaningItems} filterFn={p => p.sex === 'Macho'} />
      </table>
      <table className="w-full bg-white border-collapse border border-gray-300">
          <DataBlock title="Fêmeas" data={allWeaningItems} filterFn={p => p.sex === 'Fêmea'} />
      </table>
    </div>
  );
};