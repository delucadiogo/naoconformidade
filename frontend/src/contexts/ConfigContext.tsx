import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import ConfigService, { ConfigType, ConfigInput } from '@/services/configService';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

interface ConfigContextData {
  productTypes: ConfigType[];
  situationTypes: ConfigType[];
  actions: ConfigType[];
  loading: boolean;
  addProductType: (data: ConfigInput) => Promise<void>;
  removeProductType: (id: number) => Promise<void>;
  addSituationType: (data: ConfigInput) => Promise<void>;
  removeSituationType: (id: number) => Promise<void>;
  addAction: (data: ConfigInput) => Promise<void>;
  removeAction: (id: number) => Promise<void>;
}

export const ConfigContext = createContext<ConfigContextData>({} as ConfigContextData);

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [productTypes, setProductTypes] = useState<ConfigType[]>([]);
  const [situationTypes, setSituationTypes] = useState<ConfigType[]>([]);
  const [actions, setActions] = useState<ConfigType[]>([]);
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
      const [productTypesData, situationTypesData, actionsData] = await Promise.all([
        ConfigService.getAllProductTypes(),
        ConfigService.getAllSituationTypes(),
        ConfigService.getAllActions()
      ]);
      setProductTypes(productTypesData);
      setSituationTypes(situationTypesData);
      setActions(actionsData);
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

  const addSituationType = async (data: ConfigInput) => {
    try {
      const newType = await ConfigService.createSituationType(data);
      setSituationTypes(prev => [...prev, newType]);
      toast.success('Tipo de situação adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar tipo de situação:', error);
      toast.error('Erro ao adicionar tipo de situação');
      throw error;
    }
  };

  const removeSituationType = async (id: number) => {
    try {
      await ConfigService.deleteSituationType(id);
      setSituationTypes(prev => prev.filter(type => type.id !== id));
      toast.success('Tipo de situação removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover tipo de situação:', error);
      toast.error('Erro ao remover tipo de situação');
      throw error;
    }
  };

  const addAction = async (data: ConfigInput) => {
    try {
      const newAction = await ConfigService.createAction(data);
      setActions(prev => [...prev, newAction]);
      toast.success('Ação adicionada com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar ação:', error);
      toast.error('Erro ao adicionar ação');
      throw error;
    }
  };

  const removeAction = async (id: number) => {
    try {
      await ConfigService.deleteAction(id);
      setActions(prev => prev.filter(action => action.id !== id));
      toast.success('Ação removida com sucesso!');
    } catch (error) {
      console.error('Erro ao remover ação:', error);
      toast.error('Erro ao remover ação');
      throw error;
    }
  };

  return (
    <ConfigContext.Provider
      value={{
        productTypes,
        situationTypes,
        actions,
        loading,
        addProductType,
        removeProductType,
        addSituationType,
        removeSituationType,
        addAction,
        removeAction
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};
