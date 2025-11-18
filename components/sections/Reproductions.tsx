import React from 'react';
import { DispatchHandler } from '../DispatchHandler';
import { Protocol, Farm, Company } from '../../types';

interface ReproductionsProps {
  protocols: Protocol[];
  farms: Farm[];
  companies: Company[];
  addProtocol: (protocol: Omit<Protocol, 'id' | 'createdAt' | 'status' | 'code'>) => void;
  onViewProtocol: (protocolId: string) => void;
  onProcessProtocol: (protocolId: string) => void;
}

export const Reproductions: React.FC<ReproductionsProps> = (props) => {
  return (
    <DispatchHandler
      title="Lançamento de Reproduções"
      dispatchType="reproductions"
      {...props}
    />
  );
};
