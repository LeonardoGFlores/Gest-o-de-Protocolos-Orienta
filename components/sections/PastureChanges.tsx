import React from 'react';
import { DispatchHandler } from '../DispatchHandler';
import { Protocol, Farm, Company } from '../../types';

interface PastureChangesProps {
  protocols: Protocol[];
  farms: Farm[];
  companies: Company[];
  addProtocol: (protocol: Omit<Protocol, 'id' | 'createdAt' | 'status' | 'code'>) => void;
  onViewProtocol: (protocolId: string) => void;
  onProcessProtocol: (protocolId: string) => void;
}

export const PastureChanges: React.FC<PastureChangesProps> = (props) => {
  return (
    <DispatchHandler
      title="Lançamento de Trocas de Pasto"
      dispatchType="pastureChanges"
      {...props}
    />
  );
};
