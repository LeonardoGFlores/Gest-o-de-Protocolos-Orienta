import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Logo } from './Logo';

interface LoginProps {
  onLogin: (credentials: { email: string; password: string }) => void;
  onSwitchView: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onSwitchView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin({ email, password });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <div className="flex flex-col items-center mb-6">
        <Logo className="w-48 h-auto mb-4" />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <Button type="submit" className="w-full">Entrar</Button>
      </form>
      <p className="mt-6 text-center text-sm text-brand-gray">
        Não tem uma conta?{' '}
        <button onClick={onSwitchView} className="font-semibold text-brand-gold hover:underline">
          Cadastre-se
        </button>
      </p>
    </Card>
  );
};