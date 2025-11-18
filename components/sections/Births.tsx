import React from 'react';
import { DispatchHandler } from '../DispatchHandler';
import { Protocol, Farm, Company } from '../../types';

interface BirthsProps {
  protocols: Protocol[];
  farms: Farm[];
  companies: Company[];
  addProtocol: (protocol: Omit<Protocol, 'id' | 'createdAt' | 'status' | 'code'>) => void;
  onViewProtocol: (protocolId: string) => void;
  onProcessProtocol: (protocolId: string) => void;
}

export const Births: React.FC<BirthsProps> = (props) => {
  return (
    <DispatchHandler
      title="Lançamento de Nascimentos"
      dispatchType="births"
      {...props}
    />
  );
};
