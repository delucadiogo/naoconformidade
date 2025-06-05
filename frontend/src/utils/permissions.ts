export type UserRole = 'admin' | 'administrador' | 'usuario' | 'visualizador';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'admin' || user?.role === 'administrador';
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