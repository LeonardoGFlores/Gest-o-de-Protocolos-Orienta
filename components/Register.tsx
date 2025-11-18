import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Logo } from './Logo';

interface RegisterProps {
  onRegister: (user: { name: string; email: string; password: string }) => void;
  onSwitchView: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onRegister, onSwitchView }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && password) {
      onRegister({ name, email, password });
    }
  };

  return (
    <Card className="w-full max-w-md">
       <div className="flex flex-col items-center mb-6">
        <Logo className="w-48 h-auto mb-4" />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome Completo"
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="E-mail"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Senha"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">Cadastrar</Button>
      </form>
      <p className="mt-6 text-center text-sm text-brand-gray">
        Já possui uma conta?{' '}
        <button onClick={onSwitchView} className="font-semibold text-brand-gold hover:underline">
          Faça Login
        </button>
      </p>
    </Card>
  );
};