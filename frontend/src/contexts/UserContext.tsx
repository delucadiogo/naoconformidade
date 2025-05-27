import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import userService, { User, UserInput } from '../services/userService';
import { toast } from 'react-toastify';

interface UserContextData {
  users: User[];
  loading: boolean;
  addUser: (userData: UserInput) => Promise<void>;
  updateUser: (id: number, userData: UserInput) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
}

const UserContext = createContext<UserContextData>({} as UserContextData);

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
      toast.success('Usuário criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      toast.error('Erro ao criar usuário');
      throw error;
    }
  };

  const updateUser = async (id: number, userData: UserInput) => {
    try {
      const updatedUser = await userService.update(id, userData);
      setUsers(prevUsers =>
        prevUsers.map(user => (user.id === id ? updatedUser : user))
      );
      toast.success('Usuário atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast.error('Erro ao atualizar usuário');
      throw error;
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await userService.delete(id);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
      toast.success('Usuário deletado com sucesso!');
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
        deleteUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers deve ser usado dentro de um UserProvider');
  }
  return context;
};

export default UserContext;
