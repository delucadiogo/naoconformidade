import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ConfigService, { ConfigType } from '../services/configService';
import { isAuthenticated } from '../utils/auth';

interface ConfigContextType {
  productTypes: ConfigType[];
  actionTypes: ConfigType[];
  addProductType: (label: string, value: string) => Promise<void>;
  removeProductType: (id: number) => Promise<void>;
  addActionType: (label: string, value: string) => Promise<void>;
  removeActionType: (id: number) => Promise<void>;
  loading: boolean;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [productTypes, setProductTypes] = useState<ConfigType[]>([]);
  const [actionTypes, setActionTypes] = useState<ConfigType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      loadConfigs();
    } else {
      setLoading(false);
    }
  }, []);

  const loadConfigs = async () => {
    try {
      setLoading(true);
      const [productTypesData, actionTypesData] = await Promise.all([
        ConfigService.getAllProductTypes(),
        ConfigService.getAllActionTypes()
      ]);
      setProductTypes(productTypesData);
      setActionTypes(actionTypesData);
    } catch (error: any) {
      console.error('Erro ao carregar configurações:', error);
      if (error.response?.status === 401) {
        toast.error('Sessão expirada. Por favor, faça login novamente.');
      } else {
        toast.error('Erro ao carregar configurações');
      }
    } finally {
      setLoading(false);
    }
  };

  const addProductType = async (label: string, value: string) => {
    try {
      const newType = await ConfigService.createProductType({ label, value });
      setProductTypes(prev => [...prev, newType]);
      toast.success('Tipo de produto adicionado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao adicionar tipo de produto:', error);
      if (error.response?.status === 401) {
        toast.error('Sessão expirada. Por favor, faça login novamente.');
      } else if (error.response?.data?.error === 'Valor já existe') {
        toast.error('Este valor já está em uso');
      } else {
        toast.error('Erro ao adicionar tipo de produto');
      }
      throw error;
    }
  };

  const removeProductType = async (id: number) => {
    try {
      await ConfigService.deleteProductType(id);
      setProductTypes(prev => prev.filter(type => type.id !== id));
      toast.success('Tipo de produto removido com sucesso!');
    } catch (error: any) {
      console.error('Erro ao remover tipo de produto:', error);
      if (error.response?.status === 401) {
        toast.error('Sessão expirada. Por favor, faça login novamente.');
      } else {
        toast.error('Erro ao remover tipo de produto');
      }
      throw error;
    }
  };

  const addActionType = async (label: string, value: string) => {
    try {
      const newType = await ConfigService.createActionType({ label, value });
      setActionTypes(prev => [...prev, newType]);
      toast.success('Tipo de ação adicionado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao adicionar tipo de ação:', error);
      if (error.response?.status === 401) {
        toast.error('Sessão expirada. Por favor, faça login novamente.');
      } else if (error.response?.data?.error === 'Valor já existe') {
        toast.error('Este valor já está em uso');
      } else {
        toast.error('Erro ao adicionar tipo de ação');
      }
      throw error;
    }
  };

  const removeActionType = async (id: number) => {
    try {
      await ConfigService.deleteActionType(id);
      setActionTypes(prev => prev.filter(type => type.id !== id));
      toast.success('Tipo de ação removido com sucesso!');
    } catch (error: any) {
      console.error('Erro ao remover tipo de ação:', error);
      if (error.response?.status === 401) {
        toast.error('Sessão expirada. Por favor, faça login novamente.');
      } else {
        toast.error('Erro ao remover tipo de ação');
      }
      throw error;
    }
  };

  return (
    <ConfigContext.Provider
      value={{
        productTypes,
        actionTypes,
        addProductType,
        removeProductType,
        addActionType,
        removeActionType,
        loading
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
