
import React from 'react';

const ReportHeader: React.FC<{ title: string }> = ({ title }) => (
    <thead>
        <tr className="bg-brand-green text-white">
            <th colSpan={8} className="border p-1 font-semibold text-sm text-left">{title}</th>
        </tr>
    </thead>
);

const PastureChangeBlock: React.FC<{ details: any }> = ({ details }) => {
    return (
        <tbody className="bg-brand-green text-white">
            <tr>
                <td className="border p-1 text-sm font-medium w-1/4">Pasto de origem</td>
                <td className="border p-1 text-sm text-center w-1/4">{details.originPasture}</td>
                <td colSpan={6} className="border p-1"></td>
            </tr>
            <tr>
                <td className="border p-1 text-sm font-medium">Pasto destino</td>
                <td className="border p-1 text-sm text-center">{details.destinationPasture}</td>
                <td colSpan={6} className="border p-1"></td>
            </tr>
            <tr>
                <td className="border p-1 text-sm font-medium">Número de animais</td>
                <td className="border p-1 text-sm text-center">{details.animalCount}</td>
                <td colSpan={6} className="border p-1"></td>
            </tr>
            <tr>
                <td className="border p-1 text-sm font-medium">Categoria</td>
                <td className="border p-1 text-sm text-center">{details.category}</td>
                <td colSpan={6} className="border p-1"></td>
            </tr>
            <tr>
                <td className="border p-1 text-sm font-medium">Lote</td>
                <td className="border p-1 text-sm text-center">{details.activity}</td>
                <td colSpan={6} className="border p-1"></td>
            </tr>
        </tbody>
    )
}

export const PastureChangeReport: React.FC<{ data: any }> = ({ data }) => {
  const allChangeItems = data.protocols
    .filter((p: any) => p.type === 'pastureChanges' && Array.isArray(p.processingDetails))
    .flatMap((p: any) => p.processingDetails);

  return (
    <div className="bg-white p-4 font-sans text-gray-800">
      <h2 className="text-center text-lg font-bold mb-4 uppercase">Troca de Pasto</h2>
      {allChangeItems.map((item: any, index: number) => (
        <table key={index} className="w-full bg-white border-collapse border border-gray-300 mb-6">
            <ReportHeader title={`Movimentação ${index + 1}`} />
            <PastureChangeBlock details={item} />
        </table>
      ))}
      {allChangeItems.length === 0 && <p className="text-center text-gray-500">Nenhuma troca de pasto encontrada para os filtros selecionados.</p>}
    </div>
  );
};