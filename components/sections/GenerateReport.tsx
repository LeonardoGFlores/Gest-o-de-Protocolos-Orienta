import React, { useState, useRef, useMemo } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Farm, Protocol, Category } from '../../types';

// @ts-ignore
const { jsPDF } = window.jspdf;
// @ts-ignore
const { html2canvas } = window;


import { CommercialMovementsReport } from '../reports/CommercialMovementsReport';
import { MortalityReport } from '../reports/MortalityReport';
import { BirthsReport } from '../reports/BirthsReport';
import { TransfersReport } from '../reports/TransfersReport';
import { ReproductionReport } from '../reports/ReproductionReport';
import { WeaningReport } from '../reports/WeaningReport';
import { NutritionReport } from '../reports/NutritionReport';
import { FertilizationReport } from '../reports/FertilizationReport';
import { PastureChangeReport } from '../reports/PastureChangeReport';
import { StockEvolutionReport } from '../reports/StockEvolutionReport';


interface GenerateReportProps {
  farms: Farm[];
  protocols: Protocol[];
  categories: Category[];
}

const reportTypes = [
  { id: 'commercialMovements', label: 'Movimentações Comerciais' },
  { id: 'mortality', label: 'Mortalidade' },
  { id: 'births', label: 'Nascimentos' },
  { id: 'transfers', label: 'Transferência' },
  { id: 'reproduction', label: 'Reprodução' },
  { id: 'weaning', label: 'Desmame' },
  { id: 'nutrition', label: 'Nutrição' },
  { id: 'fertilization', label: 'Adubação' },
  { id: 'pastureChange', label: 'Troca de Pasto' },
  { id: 'stockEvolution', label: 'Evolução de Estoque' },
];

const getWeekBucket = (date: Date): string => {
  const day = date.getDate();
  if (day >= 1 && day <= 5) return '1 a 5';
  if (day >= 6 && day <= 12) return '6 a 12';
  if (day >= 13 && day <= 19) return '13 a 19';
  if (day >= 20 && day <= 31) return '20 a 30';
  return '';
};

const LOGO_DATA_URI = 'data:image/jpeg;base64,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';

export const GenerateReport: React.FC<GenerateReportProps> = ({ farms, protocols, categories }) => {
  const [selectedFarm, setSelectedFarm] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  const [selectedWeeks, setSelectedWeeks] = useState<string[]>([]);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [generatedContent, setGeneratedContent] = useState<React.ReactNode | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const reportRef = useRef<HTMLDivElement>(null);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
  }, []);

  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({ value: (i + 1).toString(), name: new Date(0, i).toLocaleString('pt-BR', { month: 'long' }) }));
  }, []);
  
  const weekOptions = ['1 a 5', '6 a 12', '13 a 19', '20 a 30'];

  const handleGenerateReport = () => {
    if (!selectedFarm || selectedReports.length === 0) {
      alert("Por favor, selecione uma fazenda e pelo menos um tipo de relatório.");
      return;
    }

    const filteredProtocols = protocols.filter(p => {
      const protocolDate = new Date(p.updatedAt || p.createdAt);
      const yearMatch = protocolDate.getFullYear().toString() === selectedYear;
      const monthMatch = (protocolDate.getMonth() + 1).toString() === selectedMonth;
      const farmMatch = p.farmId === selectedFarm;
      
      if (!yearMatch || !monthMatch || !farmMatch) return false;
      
      if(selectedWeeks.length > 0) {
          const weekBucket = getWeekBucket(protocolDate);
          return selectedWeeks.includes(weekBucket);
      }
      return true;
    });

    const reportData = {
        farm: farms.find(f => f.id === selectedFarm),
        protocols: filteredProtocols,
        allProtocols: protocols, // For stock evolution calculation
        categories,
        filters: { year: selectedYear, month: selectedMonth, weeks: selectedWeeks },
    };

    setGeneratedContent(
      <div className="space-y-8">
        {selectedReports.map(reportType => {
          switch (reportType) {
            case 'commercialMovements': return <CommercialMovementsReport key={reportType} data={reportData} />;
            case 'mortality': return <MortalityReport key={reportType} data={reportData} />;
            case 'births': return <BirthsReport key={reportType} data={reportData} />;
            case 'transfers': return <TransfersReport key={reportType} data={reportData} />;
            case 'reproduction': return <ReproductionReport key={reportType} data={reportData} />;
            case 'weaning': return <WeaningReport key={reportType} data={reportData} />;
            case 'nutrition': return <NutritionReport key={reportType} data={reportData} />;
            case 'fertilization': return <FertilizationReport key={reportType} data={reportData} />;
            case 'pastureChange': return <PastureChangeReport key={reportType} data={reportData} />;
            case 'stockEvolution': return <StockEvolutionReport key={reportType} data={reportData} />;
            default: return null;
          }
        })}
      </div>
    );
  };

 const handleDownloadPDF = async () => {
    if (!reportRef.current || !generatedContent) return;
    setIsGenerating(true);

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 40;

    // --- 1. Add Cover Page ---
    const logoAspectRatio = 1.5; // Approximate aspect ratio of the new logo (width:height)
    const logoWidth = 200;
    const logoHeight = logoWidth / logoAspectRatio;
    pdf.addImage(LOGO_DATA_URI, 'JPEG', (pdfWidth - logoWidth) / 2, margin, logoWidth, logoHeight);
    
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor('#868b83'); // brand-gray
    const farm = farms.find(f => f.id === selectedFarm);
    if (farm) {
        pdf.text(`Fazenda: ${farm.name}`, pdfWidth / 2, margin + logoHeight + 40, { align: 'center' });
    }

    // --- 2. Add Report Content with Pagination ---
    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    const contentWidth = pdfWidth - margin * 2;
    const contentHeight = pdfHeight - margin * 2;
    
    const imgHeightInPdf = canvasHeight * contentWidth / canvasWidth;
    let heightLeft = imgHeightInPdf;
    let position = 0;

    pdf.addPage();
    pdf.addImage(imgData, 'PNG', margin, position + margin, contentWidth, imgHeightInPdf);
    heightLeft -= contentHeight;

    let pageNum = 2;
    while (heightLeft > 0) {
      position -= contentHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', margin, position + margin, contentWidth, imgHeightInPdf);
      heightLeft -= contentHeight;
      pageNum++;
    }

    // --- 3. Add Footer and Save ---
    const date = new Date();
    const pageCount = pdf.internal.pages.length;
    
    for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        pdf.text(
            `Gerado em: ${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR')} | Página ${i} de ${pageCount}`,
            pdf.internal.pageSize.getWidth() / 2,
            pdf.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );
    }
    
    const formattedDate = date.toLocaleDateString('pt-BR').replace(/\//g, '-');
    pdf.save(`Relatorio_Orienta_${farm?.name || ''}_${formattedDate}.pdf`);

    setIsGenerating(false);
  };


  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold text-brand-green mb-4">Painel de Geração de Relatórios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg">
          <Select label="Fazenda" value={selectedFarm} onChange={e => setSelectedFarm(e.target.value)} required>
            <option value="">Selecione a Fazenda</option>
            {farms.map(farm => <option key={farm.id} value={farm.id}>{farm.name}</option>)}
          </Select>
          <Select label="Ano" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </Select>
          <Select label="Mês" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
            {months.map(m => <option key={m.value} value={m.value}>{m.name.charAt(0).toUpperCase() + m.name.slice(1)}</option>)}
          </Select>
          <div>
            <label className="block text-sm font-medium text-brand-gray mb-1">Semanas</label>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {weekOptions.map(week => (
                <label key={week} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedWeeks.includes(week)}
                    onChange={() => {
                      setSelectedWeeks(prev =>
                        prev.includes(week) ? prev.filter(w => w !== week) : [...prev, week]
                      );
                    }}
                    className="rounded text-brand-gold focus:ring-brand-gold"
                  />
                  <span className="text-black">{week}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 p-4 border rounded-lg">
           <label className="block text-sm font-medium text-brand-gray mb-2">Tipos de Relatório</label>
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {reportTypes.map(rt => (
                  <label key={rt.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedReports.includes(rt.id)}
                    onChange={() => {
                        setSelectedReports(prev =>
                        prev.includes(rt.id) ? prev.filter(r => r !== rt.id) : [...prev, rt.id]
                      );
                    }}
                    className="rounded text-brand-gold focus:ring-brand-gold"
                  />
                  <span className="text-black">{rt.label}</span>
                </label>
              ))}
           </div>
        </div>
        <div className="mt-6 flex space-x-4">
          <Button onClick={handleGenerateReport}>Gerar Relatório</Button>
          <Button onClick={handleDownloadPDF} variant="secondary" disabled={!generatedContent || isGenerating}>
            {isGenerating ? 'Baixando...' : 'Baixar PDF'}
          </Button>
        </div>
      </Card>

      {generatedContent && (
        <Card>
            <div ref={reportRef} className="p-4 bg-white">
                {generatedContent}
            </div>
        </Card>
      )}
    </div>
  );
};