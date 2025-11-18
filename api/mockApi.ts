import { Category, Company, Farm, Protocol } from '../types';

const get = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key “${key}”:`, error);
    return defaultValue;
  }
};

const set = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key “${key}”:`, error);
  }
};

export const mockApi = {
  fetchData: async (userId: string) => {
    return new Promise<{
      categories: Category[];
      companies: Company[];
      farms: Farm[];
      protocols: Protocol[];
    }>(resolve => {
      setTimeout(() => { // Simulate network latency
        const categories = get<Category[]>(`categories_${userId}`, []);
        const companies = get<Company[]>(`companies_${userId}`, []);
        const farms = get<Farm[]>(`farms_${userId}`, []);
        const protocols = get<Protocol[]>(`protocols_${userId}`, []);
        resolve({ categories, companies, farms, protocols });
      }, 500);
    });
  },

  saveCategories: async (userId: string, categories: Category[]) => {
     return new Promise<void>(resolve => {
        set(`categories_${userId}`, categories);
        resolve();
    });
  },

  saveCompanies: async (userId: string, companies: Company[]) => {
     return new Promise<void>(resolve => {
        set(`companies_${userId}`, companies);
        resolve();
    });
  },
  
  saveFarms: async (userId: string, farms: Farm[]) => {
     return new Promise<void>(resolve => {
        set(`farms_${userId}`, farms);
        resolve();
    });
  },

  saveProtocols: async (userId: string, protocols: Protocol[]) => {
     return new Promise<void>(resolve => {
        set(`protocols_${userId}`, protocols);
        resolve();
    });
  }
};
