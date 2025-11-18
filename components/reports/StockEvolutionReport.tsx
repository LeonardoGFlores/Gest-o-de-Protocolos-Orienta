
import React from 'react';
import { Farm, Protocol, Category, FarmCategory } from '../../types';

interface StockEvolutionData {
    farm?: Farm;
    allProtocols: Protocol[];
    protocols: Protocol[]; // Filtered for the month
    categories: Category[];
    filters: { year: string; month: string; };
}

const getCategoryName = (id: string, categories: Category[]) => categories.find(c => c.id === id)?.name || id;

const calculateOpeningStock = (farm: Farm, allProtocols: Protocol[], categories: Category[], filters: { year: string; month: string; }) => {
    let inventory: Record<string, number> = {};
    
    // 1. Set initial inventory from farm creation
    farm.animalDistribution.forEach(dist => {
        inventory[dist.categoryId] = (inventory[dist.categoryId] || 0) + dist.quantity;
    });

    // 2. Process all protocols up to the start of the selected month
    const startDate = new Date(parseInt(filters.year), parseInt(filters.month) - 1, 1);
    
    const protocolsBefore = allProtocols
        .filter(p => p.farmId === farm.id && new Date(p.updatedAt || p.createdAt) < startDate && Array.isArray(p.processingDetails))
        .sort((a, b) => new Date(a.updatedAt || a.createdAt).getTime() - new Date(b.updatedAt || b.createdAt).getTime());

    const getCatId = (name: string) => categories.find(c => c.name === name)?.id;

    protocolsBefore.forEach(p => {
        p.processingDetails?.forEach(details => {
            if (!details) return;

            const updateInv = (catName: string, change: number) => {
                const catId = getCatId(catName);
                if (catId) {
                    inventory[catId] = (inventory[catId] || 0) + change;
                }
            };

            switch (p.type) {
                case 'purchases': updateInv(details.category, Number(details.quantity) || 0); break;
                case 'sales': updateInv(details.category, -(Number(details.quantity) || 0)); break;
                case 'deaths': updateInv(details.category, -1); break;
                case 'births': 
                    const calfCatName = details.sex === 'Macho' ? 'Bezerro' : 'Bezerra';
                    updateInv(calfCatName, 1);
                    break;
                // Transfers are more complex - ignoring for this report for simplicity unless specified
            }
        });
    });

    return inventory;
};

const StockTable: React.FC<{title: string, stock: Record<string, number>, categories: Category[]}> = ({ title, stock, categories }) => (
    <div className="w-1/3 px-2">
        <table className="w-full text-sm">
            <thead className="bg-brand-green text-white">
                <tr>
                    <th className="p-1 border text-left font-semibold" colSpan={2}>{title}</th>
                </tr>
                 <tr>
                    <th className="p-1 border text-left font-normal w-2/3"></th>
                    <th className="p-1 border text-center font-normal">Quantidade</th>
                </tr>
            </thead>
            <tbody className="bg-brand-green text-white">
                {Object.entries(stock).map(([catId, qty]) => (
                    <tr key={catId}>
                        <td className="p-1 border">{getCategoryName(catId, categories)}</td>
                        <td className="p-1 border text-center">{qty}</td>
                    </tr>
                ))}
                 <tr className="font-bold">
                    <td className="p-1 border">Soma</td>
                    {/* FIX: Explicitly typed the reduce callback parameters `s` and `q` as numbers to resolve TypeScript error where they were inferred as `unknown`. */}
                    <td className="p-1 border text-center">{Object.values(stock).reduce((s: number, q: number) => s + q, 0)}</td>
                </tr>
            </tbody>
        </table>
    </div>
);


export const StockEvolutionReport: React.FC<{ data: StockEvolutionData }> = ({ data }) => {
    const { farm, protocols, allProtocols, categories, filters } = data;
    if (!farm) return <p>Fazenda não selecionada.</p>;

    const openingStock = calculateOpeningStock(farm, allProtocols, categories, filters);

    const movements = protocols.reduce((acc, p) => {
        p.processingDetails?.forEach(details => {
            if (!details) return;
            switch (p.type) {
                case 'births': acc.births += 1; break;
                case 'purchases': acc.purchases += Number(details.quantity) || 0; break;
                case 'sales': acc.sales += Number(details.quantity) || 0; break;
                case 'deaths': acc.deaths += 1; break;
                // Ignoring transfers for now
            }
        });
        return acc;
    }, { births: 0, purchases: 0, eTransfers: 0, sales: 0, deaths: 0, sTransfers: 0 });

    const netChange = movements.births + movements.purchases - movements.sales - movements.deaths;

    const closingStock = { ...openingStock };
    protocols.forEach(p => {
        p.processingDetails?.forEach(details => {
            if (!details) return;

            const getCatId = (name: string) => categories.find(c => c.name === name)?.id;
            const updateInv = (catName: string, change: number) => {
                const catId = getCatId(catName);
                if (catId) {
                    closingStock[catId] = (closingStock[catId] || 0) + change;
                }
            };

            switch (p.type) {
                case 'purchases': updateInv(details.category, Number(details.quantity) || 0); break;
                case 'sales': updateInv(details.category, -(Number(details.quantity) || 0)); break;
                case 'deaths': updateInv(details.category, -1); break;
                case 'births': 
                    const calfCatName = details.sex === 'Macho' ? 'Bezerro' : 'Bezerra';
                    updateInv(calfCatName, 1);
                    break;
            }
        });
    });


    const evolutionCategories = Object.keys(openingStock);

    return (
        <div className="bg-white p-4 font-sans text-gray-800">
            <h2 className="text-center text-lg font-bold mb-4 uppercase">Evolução de Estoque</h2>
            <div className="flex flex-wrap -mx-2 mb-6">
                <StockTable title="Estoque dia 1 do mês" stock={openingStock} categories={categories} />
                 {/* Placeholder for other tables */}
                 <div className="w-1/3 px-2"></div>
                 <div className="w-1/3 px-2"></div>
            </div>

            <table className="w-full text-sm mb-6">
                 <thead className="bg-brand-green text-white">
                    <tr>
                        <th className="p-1 border text-left font-semibold">Evolução</th>
                        <th className="p-1 border text-center font-semibold">Nascimentos</th>
                        <th className="p-1 border text-center font-semibold">Compras</th>
                        <th className="p-1 border text-center font-semibold">E.Transferencia</th>
                        <th className="p-1 border text-center font-semibold">Vendas</th>
                        <th className="p-1 border text-center font-semibold">Mortes</th>
                        <th className="p-1 border text-center font-semibold">S.Transferencia</th>
                        <th className="p-1 border text-center font-semibold">Saldo</th>
                    </tr>
                 </thead>
                 <tbody className="bg-brand-green text-white">
                    {evolutionCategories.map(catId => {
                         const getChange = (type: string, category: string) => {
                             return protocols
                                .filter(p => p.type === type)
                                .flatMap(p => p.processingDetails || [])
                                .filter(d => d.category === getCategoryName(category, categories))
                                .reduce((sum, d) => sum + (Number(d.quantity) || (type === 'deaths' ? 1 : 0)), 0);
                         };

                        const births = protocols
                            .filter(p => p.type === 'births')
                            .flatMap(p => p.processingDetails || [])
                            .filter(d => getCategoryName(catId, categories).includes(d.sex === 'Macho' ? 'Bezerro' : 'Bezerra'))
                            .length;
                        
                        const purchases = getChange('purchases', catId);
                        const sales = getChange('sales', catId);
                        const deaths = getChange('deaths', catId);
                        const saldo = births + purchases - sales - deaths;

                        return (
                             <tr key={catId}>
                                <td className="p-1 border">{getCategoryName(catId, categories)}</td>
                                <td className="p-1 border text-center">{births}</td>
                                <td className="p-1 border text-center">{purchases}</td>
                                <td className="p-1 border text-center">0</td>
                                <td className="p-1 border text-center">{sales}</td>
                                <td className="p-1 border text-center">{deaths}</td>
                                <td className="p-1 border text-center">0</td>
                                <td className="p-1 border text-center font-bold">{saldo}</td>
                            </tr>
                        )
                    })}
                     <tr className="font-bold">
                        <td className="p-1 border">Soma</td>
                        <td className="p-1 border text-center">{movements.births}</td>
                        <td className="p-1 border text-center">{movements.purchases}</td>
                        <td className="p-1 border text-center">{movements.eTransfers}</td>
                        <td className="p-1 border text-center">{movements.sales}</td>
                        <td className="p-1 border text-center">{movements.deaths}</td>
                        <td className="p-1 border text-center">{movements.sTransfers}</td>
                        <td className="p-1 border text-center">{netChange}</td>
                     </tr>
                 </tbody>
            </table>

            <div className="flex flex-wrap -mx-2">
                 <StockTable title="Estoque dia 30" stock={closingStock} categories={categories} />
                 {/* Placeholder for other tables */}
                 <div className="w-1/3 px-2"></div>
                 <div className="w-1/3 px-2"></div>
            </div>
        </div>
    );
};