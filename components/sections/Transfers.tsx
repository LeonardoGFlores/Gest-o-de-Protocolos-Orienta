import React from 'react';
import { DispatchHandler } from '../DispatchHandler';
import { Protocol, Farm, Company } from '../../types';

interface TransfersProps {
  protocols: Protocol[];
  farms: Farm[];
  companies: Company[];
  addProtocol: (protocol: Omit<Protocol, 'id' | 'createdAt' | 'status' | 'code'>) => void;
  onViewProtocol: (protocolId: string) => void;
  onProcessProtocol: (protocolId: string) => void;
}

export const Transfers: React.FC<TransfersProps> = (props) => {
  return (
    <DispatchHandler
      title="Lançamento de Transferências"
      dispatchType="transfers"
      {...props}
    />
  );
};
