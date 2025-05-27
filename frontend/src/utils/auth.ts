// Função para obter o token do localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Função para salvar o token no localStorage
export const setAuthToken = (token: string): void => {
  localStorage.setItem('token', token);
};

// Função para remover o token do localStorage
export const removeAuthToken = (): void => {
  localStorage.removeItem('token');
};

// Função para verificar se o usuário está autenticado
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
}; 