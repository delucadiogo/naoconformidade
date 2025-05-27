export type UserRole = 'admin' | 'administrador' | 'usuario' | 'visualizador';

export interface User {
  id: string;
  nome: string;
  email: string;
  funcao: UserRole;
}

export const isAdmin = (user: User | null): boolean => {
  return user?.funcao === 'admin' || user?.funcao === 'administrador';
};

export const canManageUsers = (user: User | null): boolean => {
  return isAdmin(user);
};

export const canAccessSettings = (user: User | null): boolean => {
  return isAdmin(user);
};

export const canEditNonConformity = (user: User | null): boolean => {
  return isAdmin(user);
};

export const canDeleteNonConformity = (user: User | null): boolean => {
  return isAdmin(user);
}; 