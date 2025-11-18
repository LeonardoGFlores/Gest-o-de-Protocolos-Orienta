
import React from 'react';

const ReportHeader: React.FC = () => (
  <thead>
    <tr className="bg-brand-green text-white">
      <th className="border p-1 font-semibold text-sm w-1/4">MORTES</th>
      <th className="border p-1 font-semibold text-sm">1 a 5</th>
      <th className="border p-1 font-semibold text-sm">6 a 12</th>
      <th className="border p-1 font-semibold text-sm">13 a 19</th>
      <th className="border p-1 font-semibold text-sm">20 a 30</th>
      <th className="border p-1 font-semibold text-sm">A.C. Mês</th>
      <th className="border p-1 font-semibold text-sm">A.C. Safra</th>
      <th className="border p-1 font-semibold text-sm">A.C %</th>
    </tr>
  </thead>
);

const ReportRow: React.FC<{ label: string, data: any[], filterFn: (item: any) => boolean }> = ({ label, data, filterFn }) => {
    const getDay = (dateStr: string) => new Date(dateStr).getDate();
    const filteredData = data.filter(filterFn);

    const sumByDayRange = (start: number, end: number) => {
        return filteredData.filter(item => getDay(item.updatedAt) >= start && getDay(item.updatedAt) <= end).length;
    };

    const week1 = sumByDayRange(1, 5);
    const week2 = sumByDayRange(6, 12);
    const week3 = sumByDayRange(13, 19);
    const week4 = sumByDayRange(20, 31);
    const monthTotal = week1 + week2 + week3 + week4;
    const yearTotal = filteredData.length;

    // A.C % is not implemented as total animal count for percentage is complex to get here.
    const percentage = 0; 
  
    return (
      <tr className="bg-brand-green text-white">
        <td className="border p-1 text-sm font-medium">{label}</td>
        <td className="border p-1 text-sm text-center">{week1}</td>
        <td className="border p-1 text-sm text-center">{week2}</td>
        <td className="border p-1 text-sm text-center">{week3}</td>
        <td className="border p-1 text-sm text-center">{week4}</td>
        <td className="border p-1 text-sm text-center font-bold">{monthTotal}</td>
        <td className="border p-1 text-sm text-center font-bold">{yearTotal}</td>
        <td className="border p-1 text-sm text-center font-bold">{percentage.toFixed(2)}%</td>
      </tr>
    );
  };
  
const TotalRow: React.FC<{ label: string, data: any[] }> = ({ label, data }) => (
    <ReportRow label={label} data={data} filterFn={() => true} />
);

export const MortalityReport: React.FC<{ data: any }> = ({ data }) => {
  const allDeathItems = data.protocols
    .filter((p: any) => p.type === 'deaths' && Array.isArray(p.processingDetails))
    .flatMap((p: any) => p.processingDetails.map((d: any) => ({ ...d, updatedAt: p.updatedAt })));
  
  const maleDeaths = allDeathItems.filter((item:any) => item.sex === 'Macho');
  const femaleDeaths = allDeathItems.filter((item:any) => item.sex === 'Fêmea');

  const maleCategories = ["Terneiro", "Novilho", "Boi", "Touro"];
  const femaleCategories = ["Terneira", "Novilha vazia", "Novilha Prenhe", "Vaca Vazia", "Vaca Prenhe"];

  return (
    <div className="bg-white p-4 font-sans text-gray-800">
      <h2 className="text-center text-lg font-bold mb-4 uppercase">Mortalidade</h2>
      
      <table className="w-full bg-white border-collapse border border-gray-300 mb-6">
        <ReportHeader />
        <tbody>
          {maleCategories.map(cat => (
              <ReportRow key={cat} label={cat} data={allDeathItems} filterFn={item => item.category === cat} />
          ))}
          <TotalRow label="Total" data={maleDeaths} />
        </tbody>
      </table>

      <table className="w-full bg-white border-collapse border border-gray-300 mb-6">
         <ReportHeader />
         <tbody>
          {femaleCategories.map(cat => (
              <ReportRow key={cat} label={cat} data={allDeathItems} filterFn={item => item.category === cat} />
          ))}
          <TotalRow label="Total" data={femaleDeaths} />
        </tbody>
      </table>

       <table className="w-full bg-white border-collapse border border-gray-300">
         <ReportHeader />
         <tbody>
            <ReportRow label="Macho" data={allDeathItems} filterFn={item => item.sex === 'Macho'} />
            <ReportRow label="Fêmea" data={allDeathItems} filterFn={item => item.sex === 'Fêmea'} />
            <TotalRow label="Total" data={allDeathItems} />
        </tbody>
      </table>

    </div>
  );
};