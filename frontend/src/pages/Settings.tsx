import React, { useState, useEffect } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { toast } from 'react-toastify';
import { isAuthenticated } from '../utils/auth';

const Settings = () => {
  const navigate = useNavigate();
  const {
    productTypes,
    actionTypes,
    addProductType,
    removeProductType,
    addActionType,
    removeActionType,
    loading
  } = useConfig();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  const [newProductLabel, setNewProductLabel] = useState('');
  const [newProductValue, setNewProductValue] = useState('');
  const [newActionLabel, setNewActionLabel] = useState('');
  const [newActionValue, setNewActionValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddProductType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProductLabel.trim() && newProductValue.trim()) {
      try {
        setIsSubmitting(true);
        await addProductType(newProductLabel.trim(), newProductValue.trim());
        setNewProductLabel('');
        setNewProductValue('');
      } catch (error) {
        // Erro já é tratado no contexto
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleAddActionType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newActionLabel.trim() && newActionValue.trim()) {
      try {
        setIsSubmitting(true);
        await addActionType(newActionLabel.trim(), newActionValue.trim());
        setNewActionLabel('');
        setNewActionValue('');
      } catch (error) {
        // Erro já é tratado no contexto
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleRemoveProductType = async (id: number) => {
    if (confirm('Tem certeza que deseja remover este tipo de produto?')) {
      try {
        await removeProductType(id);
      } catch (error) {
        // Erro já é tratado no contexto
      }
    }
  };

  const handleRemoveActionType = async (id: number) => {
    if (confirm('Tem certeza que deseja remover este tipo de ação?')) {
      try {
        await removeActionType(id);
      } catch (error) {
        // Erro já é tratado no contexto
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-slate-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-slate-800">Configurações do Sistema</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Types */}
          <Card>
            <CardHeader>
              <CardTitle className="text-slate-800">Tipos de Produto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleAddProductType} className="space-y-3">
                <div>
                  <Label htmlFor="productLabel">Nome do Tipo</Label>
                  <Input
                    id="productLabel"
                    value={newProductLabel}
                    onChange={(e) => setNewProductLabel(e.target.value)}
                    placeholder="Ex: Produto Acabado"
                    className="mt-1"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="productValue">Valor Interno</Label>
                  <Input
                    id="productValue"
                    value={newProductValue}
                    onChange={(e) => setNewProductValue(e.target.value)}
                    placeholder="Ex: produto_acabado"
                    className="mt-1"
                    disabled={isSubmitting}
                  />
                </div>
                <Button type="submit" size="sm" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Adicionar Tipo
                </Button>
              </form>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {productTypes.map((type) => (
                  <div key={type.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium text-slate-900">{type.label}</div>
                      <div className="text-sm text-slate-500">{type.value}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveProductType(type.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Types */}
          <Card>
            <CardHeader>
              <CardTitle className="text-slate-800">Ações Tomadas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleAddActionType} className="space-y-3">
                <div>
                  <Label htmlFor="actionLabel">Nome da Ação</Label>
                  <Input
                    id="actionLabel"
                    value={newActionLabel}
                    onChange={(e) => setNewActionLabel(e.target.value)}
                    placeholder="Ex: Liberada para Comercialização"
                    className="mt-1"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="actionValue">Valor Interno</Label>
                  <Input
                    id="actionValue"
                    value={newActionValue}
                    onChange={(e) => setNewActionValue(e.target.value)}
                    placeholder="Ex: liberada_comercializacao"
                    className="mt-1"
                    disabled={isSubmitting}
                  />
                </div>
                <Button type="submit" size="sm" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Adicionar Ação
                </Button>
              </form>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {actionTypes.map((type) => (
                  <div key={type.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium text-slate-900">{type.label}</div>
                      <div className="text-sm text-slate-500">{type.value}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveActionType(type.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
