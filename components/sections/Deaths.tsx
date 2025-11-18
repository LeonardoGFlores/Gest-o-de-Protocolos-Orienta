import React from 'react';
import { DispatchHandler } from '../DispatchHandler';
import { Protocol, Farm, Company } from '../../types';

interface DeathsProps {
  protocols: Protocol[];
  farms: Farm[];
  companies: Company[];
  addProtocol: (protocol: Omit<Protocol, 'id' | 'createdAt' | 'status' | 'code'>) => void;
  onViewProtocol: (protocolId: string) => void;
  onProcessProtocol: (protocolId: string) => void;
}

export const Deaths: React.FC<DeathsProps> = (props) => {
  return (
    <DispatchHandler
      title="Lançamento de Mortes"
      dispatchType="deaths"
      {...props}
    />
  );
};
