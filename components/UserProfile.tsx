import React from 'react';
import { Card } from './ui/Card';
import { User } from '../types';

interface UserProfileProps {
  user: User;
}

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-brand-gray">{label}</p>
    <p className="text-md font-semibold text-brand-green">{value}</p>
  </div>
);

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <Card>
      <h2 className="text-xl font-semibold text-brand-green mb-6">Meus Dados</h2>
      <div className="space-y-4">
        <DetailRow label="Nome Completo" value={user.name} />
        <DetailRow label="E-mail de Acesso" value={user.email} />
      </div>
    </Card>
  );
};