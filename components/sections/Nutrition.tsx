import React from 'react';
import { DispatchHandler } from '../DispatchHandler';
import { Protocol, Farm, Company } from '../../types';

interface NutritionProps {
  protocols: Protocol[];
  farms: Farm[];
  companies: Company[];
  addProtocol: (protocol: Omit<Protocol, 'id' | 'createdAt' | 'status' | 'code'>) => void;
  onViewProtocol: (protocolId: string) => void;
  onProcessProtocol: (protocolId: string) => void;
}

export const Nutrition: React.FC<NutritionProps> = (props) => {
  return (
    <DispatchHandler
      title="Lançamento de Nutrição"
      dispatchType="nutrition"
      {...props}
    />
  );
};
