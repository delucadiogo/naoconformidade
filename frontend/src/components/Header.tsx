import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, FileText, Settings, Home } from 'lucide-react';
import { canManageUsers, canAccessSettings } from '@/utils/permissions';

const Header = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    window.location.href = window.location.origin;
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <h1 className="text-xl font-semibold text-slate-900">
            Controle de Não Conformidades
          </h1>

          <nav className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Início</span>
              </Button>
            </Link>
            {canManageUsers(user) && (
              <Link to="/users">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Usuários</span>
                </Button>
              </Link>
            )}
            <Link to="/reports">
              <Button variant="ghost" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Relatórios</span>
              </Button>
            </Link>
            {canAccessSettings(user) && (
              <Link to="/settings">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Configurações</span>
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
