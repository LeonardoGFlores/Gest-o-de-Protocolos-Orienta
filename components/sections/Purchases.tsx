import React from 'react';
import { DispatchHandler } from '../DispatchHandler';
import { Protocol, Farm, Company } from '../../types';

interface PurchasesProps {
  protocols: Protocol[];
  farms: Farm[];
  companies: Company[];
  addProtocol: (protocol: Omit<Protocol, 'id' | 'createdAt' | 'status' | 'code'>) => void;
  onViewProtocol: (protocolId: string) => void;
  onProcessProtocol: (protocolId: string) => void;
}

export const Purchases: React.FC<PurchasesProps> = (props) => {
  return (
    <DispatchHandler
      title="Lançamento de Compras"
      dispatchType="purchases"
      {...props}
    />
  );
};
