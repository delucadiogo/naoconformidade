import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/api';
import { toast } from 'sonner';
import { User } from '@/utils/permissions';

interface AuthContextType {
  user: User | null;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        // Configurar o token no axios
        authService.setToken(token);
      } catch (error) {
        console.error('Erro ao parsear usuário salvo:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Listener para o evento de logout
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      navigate('/');
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [navigate]);

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      console.log('Tentando fazer login com:', { email });
      const response = await authService.login(email, senha);
      const { token, user } = response;
      
      console.log('Dados do usuário recebidos:', user);
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Configurar o token no axios
      authService.setToken(token);
      
      toast.success('Login realizado com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      toast.error('Erro ao fazer login. Verifique suas credenciais.');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Remover o token do axios
    authService.removeToken();
    navigate('/');
    toast.info('Logout realizado com sucesso!');
  };

  const value = {
    user,
    login,
    logout,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
