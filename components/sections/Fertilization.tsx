import React from 'react';
import { DispatchHandler } from '../DispatchHandler';
import { Protocol, Farm, Company } from '../../types';

interface FertilizationProps {
  protocols: Protocol[];
  farms: Farm[];
  companies: Company[];
  addProtocol: (protocol: Omit<Protocol, 'id' | 'createdAt' | 'status' | 'code'>) => void;
  onViewProtocol: (protocolId: string) => void;
  onProcessProtocol: (protocolId: string) => void;
}

export const Fertilization: React.FC<FertilizationProps> = (props) => {
  return (
    <DispatchHandler
      title="Lançamento de Adubação"
      dispatchType="fertilization"
      {...props}
    />
  );
};
