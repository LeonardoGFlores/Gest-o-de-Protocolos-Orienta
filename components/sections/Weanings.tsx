import React from 'react';
import { DispatchHandler } from '../DispatchHandler';
import { Protocol, Farm, Company } from '../../types';

interface WeaningsProps {
  protocols: Protocol[];
  farms: Farm[];
  companies: Company[];
  addProtocol: (protocol: Omit<Protocol, 'id' | 'createdAt' | 'status' | 'code'>) => void;
  onViewProtocol: (protocolId: string) => void;
  onProcessProtocol: (protocolId: string) => void;
}

export const Weanings: React.FC<WeaningsProps> = (props) => {
  return (
    <DispatchHandler
      title="Lançamento de Desmames"
      dispatchType="weanings"
      {...props}
    />
  );
};
