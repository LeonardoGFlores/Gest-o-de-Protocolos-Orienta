
export type View = 
  | 'categories' 
  | 'companies' 
  | 'farmList'
  | 'farmDashboard'
  | 'purchases' 
  | 'sales' 
  | 'deaths' 
  | 'births' 
  | 'transfers' 
  | 'reproductions' 
  | 'weanings' 
  | 'nutrition' 
  | 'fertilization' 
  | 'pastureChanges'
  | 'protocolManagement' 
  | 'protocolDetail'
  | 'processProtocol'
  | 'generateReport'
  | 'userProfile';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In a real app, this would be a hash
}

// FIX: Added the missing Client interface to resolve the import error in ClientManagement.tsx.
export interface Client {
  id: string;
  userId: string;
  name: string;
  phone: string;
  address: string;
}

export interface Category {
  id: string;
  name: string;
  userId: string;
}

export interface Company {
  id: string;
  userId: string;
  name:string;
  city: string;
}

export interface FarmCategory {
  categoryId: string;
  quantity: number;
}

export interface Farm {
  id: string;
  companyId: string;
  name: string;
  city: string;
  size: number;
  productionSystem: string;
  animalDistribution: FarmCategory[];
}

export type ProtocolStatus = 'open' | 'closed';

export interface Protocol {
  id:string;
  code: string;
  farmId: string;
  type: View;
  fileName: string;
  fileContent: string; // Base64 data URI
  fileType: string;
  status: ProtocolStatus;
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
  processingDetails?: Record<string, any>[];
}