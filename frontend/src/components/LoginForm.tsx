import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      console.log('Tentando fazer login com:', { email });
      const success = await login(email, senha);
      console.log('Resultado do login:', success);
      
      if (!success) {
        console.log('Login falhou');
        setError('Email ou senha incorretos');
      }
    } catch (error) {
      console.error('Erro no formulário de login:', error);
      setError('Erro ao tentar fazer login. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-slate-800">
            Sistema de Não Conformidades
          </CardTitle>
          <CardDescription className="text-slate-600">
            Faça login para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-slate-700">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@empresa.com"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="senha" className="text-slate-700">Senha</Label>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••"
                required
                className="mt-1"
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          <div className="mt-4 text-sm text-slate-600">
            <strong>Credenciais de teste:</strong><br />
            Email: ti01@oliveira.com.br<br />
            Senha: Xinxuan99
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
