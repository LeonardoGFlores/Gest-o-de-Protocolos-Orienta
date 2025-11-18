
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

const ReportRow: React.FC<{ label: string, value?: number }> = ({ label, value = 0 }) => (
  <tr className="bg-brand-green text-white">
    <td className="border p-1 text-sm font-medium">{label}</td>
    <td className="border p-1 text-sm text-center"></td>
    <td className="border p-1 text-sm text-center"></td>
    <td className="border p-1 text-sm text-center"></td>
    <td className="border p-1 text-sm text-center"></td>
    <td className="border p-1 text-sm text-center font-bold">{value}</td>
    <td className="border p-1 text-sm text-center font-bold">{value}</td>
  </tr>
);

const BirthsDataRow: React.FC<{ label: string; data: any[], filterFn: (item: any) => boolean }> = ({ label, data, filterFn }) => {
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

    return (
      <tr className="bg-brand-green text-white">
        <td className="border p-1 text-sm font-medium">{label}</td>
        <td className="border p-1 text-sm text-center">{week1}</td>
        <td className="border p-1 text-sm text-center">{week2}</td>
        <td className="border p-1 text-sm text-center">{week3}</td>
        <td className="border p-1 text-sm text-center">{week4}</td>
        <td className="border p-1 text-sm text-center font-bold">{monthTotal}</td>
        <td className="border p-1 text-sm text-center font-bold">{yearTotal}</td>
      </tr>
    );
}

export const BirthsReport: React.FC<{ data: any }> = ({ data }) => {
    const allBirthItems = data.protocols
      .filter((p: any) => p.type === 'births' && Array.isArray(p.processingDetails))
      .flatMap((p: any) => p.processingDetails.map((d: any) => ({...d, updatedAt: p.updatedAt })));
      
    const totalBorn = allBirthItems.length;

    return (
    <div className="bg-white p-4 font-sans text-gray-800">
      <h2 className="text-center text-lg font-bold mb-4 uppercase">Nascimentos</h2>

      <table className="w-full bg-white border-collapse border border-gray-300 mb-6">
        <ReportHeader title="NASCIMENTOS" />
        <tbody>
          <ReportRow label="Previsão a nascer na safra" />
          <ReportRow label="Morte de Matriz Prenhe" />
          <ReportRow label="Abortos" />
          <ReportRow label="Venda de matriz Prenhe" />
          <ReportRow label="Previsão a nascer atualizada" />
          <ReportRow label="Total nascido" value={totalBorn} />
          <ReportRow label="Falta nascer" />
          <ReportRow label="Percentual de nascimentos efetivados" />
        </tbody>
      </table>

      <table className="w-full bg-white border-collapse border border-gray-300">
        <ReportHeader title="Nascidos" />
        <tbody>
            <BirthsDataRow label="Macho" data={allBirthItems} filterFn={p => p.sex === 'Macho'} />
            <BirthsDataRow label="Fêmea" data={allBirthItems} filterFn={p => p.sex === 'Fêmea'} />
            <BirthsDataRow label="Total" data={allBirthItems} filterFn={() => true} />
        </tbody>
      </table>
    </div>
  );
};