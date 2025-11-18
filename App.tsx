
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { CategoryManagement } from './components/CategoryManagement';
import { CompanyManagement } from './components/CompanyManagement';
import { FarmManagement } from './components/FarmManagement';
import { Category, Company, Farm, View, Protocol, FarmCategory, User } from './types';
import { mockApi } from './api/mockApi';

import { Purchases } from './components/sections/Purchases';
import { Sales } from './components/sections/Sales';
import { Deaths } from './components/sections/Deaths';
import { Births } from './components/sections/Births';
import { Transfers } from './components/sections/Transfers';
import { Reproductions } from './components/sections/Reproductions';
import { Weanings } from './components/sections/Weanings';
import { Nutrition } from './components/sections/Nutrition';
import { Fertilization } from './components/sections/Fertilization';
import { PastureChanges } from './components/sections/PastureChanges';
import { ProtocolManagement } from './components/sections/ProtocolManagement';
import { ProtocolDetail } from './components/ProtocolDetail';
import { ProcessProtocol } from './components/ProcessProtocol';
import { GenerateReport } from './components/sections/GenerateReport';
import { Button } from './components/ui/Button';
import { Toast } from './components/ui/Toast';
import { FarmDashboard } from './components/FarmDashboard';
import { UserProfile } from './components/UserProfile';
import { Logo } from './components/Logo';

const defaultUser: User = {
  id: 'default-user-01',
  name: 'Usuário Padrão',
  email: 'usuario@orienta.com',
  password: ''
};


function App() {
  const [currentView, setCurrentView] = useState<View>('farmList');
  const [selectedProtocolId, setSelectedProtocolId] = useState<string | null>(null);
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
  
  // --- Auth State ---
  const [currentUser] = useState<User>(defaultUser);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  // Initial data fetch
  useEffect(() => {
    if (currentUser) {
      setIsLoading(true);
      mockApi.fetchData(currentUser.id).then(data => {
        setCategories(data.categories);
        setCompanies(data.companies);
        setFarms(data.farms);
        setProtocols(data.protocols);
        setIsLoading(false);
      }).catch(error => {
        console.error("Failed to fetch data", error);
        setIsLoading(false); // Also stop loading on error
      });
    }
  }, [currentUser]);

  // Save data on change
  useEffect(() => {
    if (currentUser && !isLoading) {
      mockApi.saveCategories(currentUser.id, categories);
    }
  }, [categories, currentUser, isLoading]);

  useEffect(() => {
    if (currentUser && !isLoading) {
      mockApi.saveCompanies(currentUser.id, companies);
    }
  }, [companies, currentUser, isLoading]);
  
  useEffect(() => {
    if (currentUser && !isLoading) {
      mockApi.saveFarms(currentUser.id, farms);
    }
  }, [farms, currentUser, isLoading]);

  useEffect(() => {
    if (currentUser && !isLoading) {
      mockApi.saveProtocols(currentUser.id, protocols);
    }
  }, [protocols, currentUser, isLoading]);
  
  // Listen for changes from other tabs/windows to enable real-time collaboration
  useEffect(() => {
    if (!currentUser) return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.newValue === null) return; // Item was removed or cleared
      
      const userId = currentUser.id;

      try {
        switch (event.key) {
          case `categories_${userId}`:
            setCategories(JSON.parse(event.newValue));
            break;
          case `companies_${userId}`:
            setCompanies(JSON.parse(event.newValue));
            break;
          case `farms_${userId}`:
            setFarms(JSON.parse(event.newValue));
            break;
          case `protocols_${userId}`:
            setProtocols(JSON.parse(event.newValue));
            break;
          default:
            break; // Do nothing for keys we don't manage
        }
      } catch (error) {
        console.error("Error processing storage event:", error);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [currentUser]);


  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = (message: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToastMessage(message);
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };
  
  // --- Data Scoped to User ---
  const userCategories = useMemo(() => categories.filter(c => c.userId === currentUser?.id), [categories, currentUser]);
  const userCompanies = useMemo(() => companies.filter(c => c.userId === currentUser?.id), [companies, currentUser]);
  const userCompanyIds = useMemo(() => userCompanies.map(c => c.id), [userCompanies]);
  const userFarms = useMemo(() => farms.filter(f => userCompanyIds.includes(f.companyId)), [farms, userCompanyIds]);
  const userFarmIds = useMemo(() => userFarms.map(f => f.id), [userFarms]);
  const userProtocols = useMemo(() => protocols.filter(p => userFarmIds.includes(p.farmId)), [protocols, userFarmIds]);


  // --- Category CRUD ---
  const addCategory = (name: string) => {
    if (!currentUser) return;
    const newCategory: Category = { id: crypto.randomUUID(), name, userId: currentUser.id };
    setCategories(prev => [...prev, newCategory]);
    showToast('Categoria salva com sucesso.');
  };

  const updateCategory = (id: string, name: string) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, name } : c));
    showToast('Categoria atualizada com sucesso.');
  };

  const deleteCategory = (id: string) => {
     const isUsed = userFarms.some(farm => farm.animalDistribution.some(dist => dist.categoryId === id));
    if (isUsed) {
      showToast('Erro: Categoria em uso por uma fazenda.');
      return;
    }
    setCategories(prev => prev.filter(c => c.id !== id));
    showToast('Categoria excluída com sucesso.');
  };

  // --- Company CRUD ---
  const addCompany = (company: Omit<Company, 'id' | 'userId'>) => {
    if (!currentUser) return;
    const newCompany: Company = { id: crypto.randomUUID(), ...company, userId: currentUser.id };
    setCompanies(prev => [...prev, newCompany]);
    showToast('Empresa salva com sucesso.');
  };

  const updateCompany = (id: string, updatedCompany: Omit<Company, 'id' | 'userId'>) => {
    if (!currentUser) return;
    setCompanies(prev => prev.map(c => c.id === id ? { id, userId: currentUser.id, ...updatedCompany } : c));
    showToast('Empresa atualizada com sucesso.');
  };

  const deleteCompany = (id: string) => {
    const isUsed = userFarms.some(farm => farm.companyId === id);
    if (isUsed) {
      showToast('Erro: Empresa vinculada a uma fazenda.');
      return;
    }
    setCompanies(prev => prev.filter(c => c.id !== id));
    showToast('Empresa excluída com sucesso.');
  };

  // --- Farm CRUD ---
  const addFarm = (farm: Omit<Farm, 'id'>) => {
    const newFarm: Farm = { id: crypto.randomUUID(), ...farm };
    setFarms(prev => [...prev, newFarm]);
    showToast('Fazenda salva com sucesso.');
  };
  
  const updateFarm = (id: string, updatedFarm: Omit<Farm, 'id'>) => {
    setFarms(prev => prev.map(f => f.id === id ? { id, ...updatedFarm } : f));
    showToast('Fazenda atualizada com sucesso.');
  };

  const deleteFarm = (id: string) => {
    const isUsed = userProtocols.some(protocol => protocol.farmId === id);
    if (isUsed) {
      showToast('Erro: Fazenda possui protocolos vinculados.');
      return;
    }
    setFarms(prev => prev.filter(f => f.id !== id));
    showToast('Fazenda excluída com sucesso.');
  };


  const addProtocol = (protocol: Omit<Protocol, 'id' | 'createdAt' | 'status' | 'code'>) => {
    const typePrefixes: Record<string, string> = {
      purchases: 'COM',
      sales: 'VEN',
      deaths: 'MOR',
      births: 'NAS',
      transfers: 'TRA',
      reproductions: 'REP',
      weanings: 'DES',
      nutrition: 'NUT',
      fertilization: 'FER',
      pastureChanges: 'PAS',
    };
    const prefix = typePrefixes[protocol.type] || 'PRO';
    const code = `${prefix}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

    const newProtocol: Protocol = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'open',
      code,
      ...protocol,
    };
    setProtocols(prev => [...prev, newProtocol]);
    showToast('Protocolo gerado e salvo.');
  };
  
  const updateProtocol = (protocolId: string, updates: Partial<Omit<Protocol, 'id'>>) => {
    const protocolToUpdate = userProtocols.find(p => p.id === protocolId);
    if (!protocolToUpdate) return;
    
    setProtocols(prev =>
      prev.map(p =>
        p.id === protocolId
          ? { ...p, ...updates, updatedAt: new Date().toISOString() }
          : p
      )
    );

    if (updates.status === 'closed') {
      const detailsArray = updates.processingDetails;
      if (!detailsArray || detailsArray.length === 0) {
        showToast('Protocolo aprovado. (Sem detalhes para atualizar inventário)');
        return;
      }

      setFarms(currentFarms => {
        let newFarms = JSON.parse(JSON.stringify(currentFarms));
        const { farmId, type } = protocolToUpdate;

        const getCatId = (name: string) => userCategories.find(c => c.name === name)?.id;

        const updateFarmDistribution = (targetFarmId: string, categoryName: string, change: number) => {
          const farmIndex = newFarms.findIndex((f: Farm) => f.id === targetFarmId);
          if (farmIndex === -1) return;

          const catId = getCatId(categoryName);
          if (!catId) return;

          let distribution = newFarms[farmIndex].animalDistribution;
          const distIndex = distribution.findIndex((d: FarmCategory) => d.categoryId === catId);

          if (distIndex > -1) {
            distribution[distIndex].quantity += change;
          } else if (change > 0) {
            distribution.push({ categoryId: catId, quantity: change });
          }
           newFarms[farmIndex].animalDistribution = distribution.filter((d: FarmCategory) => d.quantity > 0);
        };
        
        detailsArray.forEach(details => {
          switch (type) {
            case 'purchases':
            case 'sales': {
              const quantity = parseInt(details.quantity, 10) || 0;
              const change = type === 'purchases' ? quantity : -quantity;
              updateFarmDistribution(farmId, details.category, change);
              break;
            }
            case 'deaths': {
              updateFarmDistribution(farmId, details.category, -1);
              break;
            }
            case 'births': {
              const calfCategoryName = details.sex === 'Macho' ? 'Bezerro' : 'Bezerra';
              const calfCategory = userCategories.find(c => c.name.includes(calfCategoryName))?.name;
              updateFarmDistribution(farmId, calfCategory || calfCategoryName, 1);
              break;
            }
            case 'transfers': {
              const quantity = parseInt(details.animalCount, 10) || 0;
              updateFarmDistribution(farmId, details.category, -quantity);
              const destFarm = newFarms.find((f: Farm) => f.id === details.destinationFarmId);
              if (destFarm) {
                updateFarmDistribution(destFarm.id, details.category, quantity);
              }
              break;
            }
          }
        });
        return newFarms;
      });
      showToast('Protocolo aprovado e inventário atualizado com sucesso.');
    } else {
      showToast('Protocolo atualizado e salvo.');
    }
  };


  const handleViewProtocol = (protocolId: string) => {
    setSelectedProtocolId(protocolId);
    setCurrentView('protocolDetail');
  };

  const handleProcessProtocol = (protocolId: string) => {
    setSelectedProtocolId(protocolId);
    setCurrentView('processProtocol');
  };
  
  const handleViewFarmDashboard = (farmId: string) => {
    setSelectedFarmId(farmId);
    setCurrentView('farmDashboard');
  };

  const dispatchProps = {
      protocols: userProtocols,
      farms: userFarms,
      companies: userCompanies,
      addProtocol,
      onViewProtocol: handleViewProtocol,
      onProcessProtocol: handleProcessProtocol,
  };

  const renderContent = () => {
    const protocol = userProtocols.find(p => p.id === selectedProtocolId);
    
    switch (currentView) {
      case 'userProfile':
        return <UserProfile user={currentUser!} />;
      // Registrations
      case 'categories':
        return <CategoryManagement categories={userCategories} addCategory={addCategory} updateCategory={updateCategory} deleteCategory={deleteCategory} />;
      case 'companies':
        return <CompanyManagement companies={userCompanies} addCompany={addCompany} updateCompany={updateCompany} deleteCompany={deleteCompany} />;
      case 'farmList':
        return <FarmManagement farms={userFarms} companies={userCompanies} categories={userCategories} addFarm={addFarm} updateFarm={updateFarm} deleteFarm={deleteFarm} onViewFarmDashboard={handleViewFarmDashboard} />;
      
      case 'farmDashboard': {
        const farm = userFarms.find(f => f.id === selectedFarmId);
        if (!farm) return <div><p>Fazenda não encontrada.</p><Button onClick={() => setCurrentView('farmList')}>Voltar para a Lista</Button></div>;
        const farmProtocols = userProtocols.filter(p => p.farmId === selectedFarmId && p.status === 'closed');
        return <FarmDashboard 
                  farm={farm}
                  protocols={farmProtocols}
                  categories={userCategories}
                  onBack={() => setCurrentView('farmList')} 
               />;
      }

      // Dispatches
      case 'purchases': return <Purchases {...dispatchProps} />;
      case 'sales': return <Sales {...dispatchProps} />;
      case 'deaths': return <Deaths {...dispatchProps} />;
      case 'births': return <Births {...dispatchProps} />;
      case 'transfers': return <Transfers {...dispatchProps} />;
      case 'reproductions': return <Reproductions {...dispatchProps} />;
      case 'weanings': return <Weanings {...dispatchProps} />;
      case 'nutrition': return <Nutrition {...dispatchProps} />;
      case 'fertilization': return <Fertilization {...dispatchProps} />;
      case 'pastureChanges': return <PastureChanges {...dispatchProps} />;

      // Protocols
      case 'protocolManagement':
        return <ProtocolManagement protocols={userProtocols} farms={userFarms} companies={userCompanies} onViewProtocol={handleViewProtocol} onProcessProtocol={handleProcessProtocol} />;

      case 'protocolDetail': {
        if (!protocol) return <div><p>Protocolo não encontrado.</p><Button onClick={() => setCurrentView('protocolManagement')}>Voltar</Button></div>;
        const farm = userFarms.find(f => f.id === protocol.farmId);
        const company = farm ? userCompanies.find(c => c.id === farm.companyId) : undefined;
        return <ProtocolDetail 
                  protocol={protocol} 
                  farm={farm} 
                  company={company} 
                  onBack={() => setCurrentView('protocolManagement')}
               />;
      }
      
      case 'processProtocol': {
        if (!protocol) return <div><p>Protocolo não encontrado.</p><Button onClick={() => setCurrentView('protocolManagement')}>Voltar</Button></div>;
        return <ProcessProtocol 
                  protocol={protocol}
                  onUpdate={updateProtocol}
                  onBack={() => setCurrentView('protocolManagement')}
                  categories={userCategories}
                  farms={userFarms}
                  companies={userCompanies}
                />;
      }

      // Reports
      case 'generateReport':
        return <GenerateReport 
          farms={userFarms}
          protocols={userProtocols.filter(p => p.status === 'closed')}
          categories={userCategories}
        />;

      default:
        return <div>Selecione uma opção</div>;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-brand-background">
        <div className="text-center">
          <Logo className="w-48 h-auto mb-4 animate-pulse" />
          <p className="text-brand-green font-semibold">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar user={currentUser} currentView={currentView} setCurrentView={setCurrentView} />
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-5xl mx-auto">
         {renderContent()}
        </div>
      </main>
      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
}

export default App;
