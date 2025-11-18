
import React from 'react';

const ReportHeader: React.FC<{ title: string }> = ({ title }) => (
  <thead>
    <tr className="bg-brand-green text-white">
      <th className="border p-1 font-semibold text-sm w-1/4">{title}</th>
      <th className="border p-1 font-semibold text-sm">1 a 5</th>
      <th className="border p-1 font-semibold text-sm">6 a 12</th>
      <th className="border p-1 font-semibold text-sm">13 a 19</th>
      <th className="border p-1 font-semibold text-sm">20 a 30</th>
      <th className="border p-1 font-semibold text-sm">A.C. Mês</th>
      <th className="border p-1 font-semibold text-sm">A.C. Safra</th>
    </tr>
  </thead>
);

const ReportRow: React.FC<{ label: string; data: any[]; accessor: (item: any) => number | string }> = ({ label, data, accessor }) => {
  const sum = data.reduce((acc, curr) => acc + (Number(accessor(curr)) || 0), 0);
  return (
    <tr className="bg-brand-green text-white">
      <td className="border p-1 text-sm font-medium">{label}</td>
      <td colSpan={4} className="border p-1 text-sm text-center"></td>
      <td className="border p-1 text-sm text-center font-bold">{sum}</td>
      <td className="border p-1 text-sm text-center font-bold">{sum}</td>
    </tr>
  );
};

export const ReproductionReport: React.FC<{ data: any }> = ({ data }) => {
  const allReproductionItems = data.protocols
    .filter((p: any) => p.type === 'reproductions' && Array.isArray(p.processingDetails))
    .flatMap((p: any) => p.processingDetails);
    
  const pregnancyRateSum = allReproductionItems.reduce((acc, curr) => acc + (Number(curr?.pregnancyRate) || 0), 0);
  const avgPregnancyRate = allReproductionItems.length > 0 ? (pregnancyRateSum / allReproductionItems.length).toFixed(2) : '0.00';


  return (
    <div className="bg-white p-4 font-sans text-gray-800">
      <h2 className="text-center text-lg font-bold mb-4 uppercase">Reprodução</h2>
      <table className="w-full bg-white border-collapse border border-gray-300">
        <ReportHeader title="REPRODUÇÕES" />
        <tbody>
            <ReportRow label="Fêmeas Expostas" data={allReproductionItems} accessor={d => d.animalCount} />
            <ReportRow label="Fêmeas Inseminadas" data={allReproductionItems} accessor={d => d.inseminated} />
            <ReportRow label="Fêmeas Diagnosticadas" data={allReproductionItems} accessor={d => d.diagnosed} />
            <ReportRow label="Fêmeas Prenhas" data={allReproductionItems} accessor={d => d.pregnant} />
            <ReportRow label="Fêmeas Vazias" data={allReproductionItems} accessor={d => d.empty} />
             <tr className="bg-brand-green text-white">
                <td className="border p-1 text-sm font-medium">Taxa de Prenhez (%)</td>
                <td colSpan={4} className="border p-1 text-sm text-center"></td>
                <td className="border p-1 text-sm text-center font-bold">{avgPregnancyRate}%</td>
                <td className="border p-1 text-sm text-center font-bold">{avgPregnancyRate}%</td>
            </tr>
        </tbody>
      </table>
    </div>
  );
};