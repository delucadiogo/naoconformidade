import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import userService, { User, UserInput } from '@/services/userService';
import { toast } from 'sonner';

interface UserContextData {
  users: User[];
  loading: boolean;
  addUser: (userData: UserInput) => Promise<void>;
  updateUser: (id: string, userData: UserInput) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

const UserContext = createContext<UserContextData>({} as UserContextData);

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers deve ser usado dentro de um UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (userData: UserInput) => {
    try {
      const newUser = await userService.create(userData);
      setUsers(prevUsers => [...prevUsers, newUser]);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      toast.error('Erro ao criar usuário');
      throw error;
    }
  };

  const updateUser = async (id: string, userData: UserInput) => {
    try {
      const updatedUser = await userService.update(id, userData);
      setUsers(prevUsers =>
        prevUsers.map(user => (user.id === id ? updatedUser : user))
      );
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast.error('Erro ao atualizar usuário');
      throw error;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await userService.delete(id);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      toast.error('Erro ao deletar usuário');
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        addUser,
        updateUser,
        deleteUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
