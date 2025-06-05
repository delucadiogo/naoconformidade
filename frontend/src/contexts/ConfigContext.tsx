import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import ConfigService, { ConfigType, ConfigInput } from '@/services/configService';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

interface ConfigContextData {
  productTypes: ConfigType[];
  actionTypes: ConfigType[];
  loading: boolean;
  addProductType: (data: ConfigInput) => Promise<void>;
  removeProductType: (id: number) => Promise<void>;
  addActionType: (data: ConfigInput) => Promise<void>;
  removeActionType: (id: number) => Promise<void>;
}

const ConfigContext = createContext<ConfigContextData>({} as ConfigContextData);

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [productTypes, setProductTypes] = useState<ConfigType[]>([]);
  const [actionTypes, setActionTypes] = useState<ConfigType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadConfigs();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadConfigs = async () => {
    try {
      setLoading(true);
      const [productTypesData, actionTypesData] = await Promise.all([
        ConfigService.getAllProductTypes(),
        ConfigService.getAllActionTypes()
      ]);
      setProductTypes(productTypesData);
      setActionTypes(actionTypesData);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const addProductType = async (data: ConfigInput) => {
    try {
      const newType = await ConfigService.createProductType(data);
      setProductTypes(prev => [...prev, newType]);
      toast.success('Tipo de produto adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar tipo de produto:', error);
      toast.error('Erro ao adicionar tipo de produto');
      throw error;
    }
  };

  const removeProductType = async (id: number) => {
    try {
      await ConfigService.deleteProductType(id);
      setProductTypes(prev => prev.filter(type => type.id !== id));
      toast.success('Tipo de produto removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover tipo de produto:', error);
      toast.error('Erro ao remover tipo de produto');
      throw error;
    }
  };

  const addActionType = async (data: ConfigInput) => {
    try {
      const newType = await ConfigService.createActionType(data);
      setActionTypes(prev => [...prev, newType]);
      toast.success('Tipo de ação adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar tipo de ação:', error);
      toast.error('Erro ao adicionar tipo de ação');
      throw error;
    }
  };

  const removeActionType = async (id: number) => {
    try {
      await ConfigService.deleteActionType(id);
      setActionTypes(prev => prev.filter(type => type.id !== id));
      toast.success('Tipo de ação removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover tipo de ação:', error);
      toast.error('Erro ao remover tipo de ação');
      throw error;
    }
  };

  return (
    <ConfigContext.Provider
      value={{
        productTypes,
        actionTypes,
        loading,
        addProductType,
        removeProductType,
        addActionType,
        removeActionType
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};
