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
        await addProductType({
          label: newProductLabel.trim(),
          value: newProductValue.trim()
        });
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
        await addActionType({
          label: newActionLabel.trim(),
          value: newActionValue.trim()
        });
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
    try {
      await removeProductType(id);
    } catch (error) {
      // Erro já é tratado no contexto
    }
  };

  const handleRemoveActionType = async (id: number) => {
    try {
      await removeActionType(id);
    } catch (error) {
      // Erro já é tratado no contexto
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Types */}
          <Card>
            <CardHeader>
              <CardTitle>Tipos de Produto</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddProductType} className="space-y-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="productLabel">Rótulo</Label>
                  <Input
                    id="productLabel"
                    value={newProductLabel}
                    onChange={(e) => setNewProductLabel(e.target.value)}
                    placeholder="Digite o rótulo"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productValue">Valor</Label>
                  <Input
                    id="productValue"
                    value={newProductValue}
                    onChange={(e) => setNewProductValue(e.target.value)}
                    placeholder="Digite o valor"
                    required
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
              <CardTitle>Tipos de Ação</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddActionType} className="space-y-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="actionLabel">Rótulo</Label>
                  <Input
                    id="actionLabel"
                    value={newActionLabel}
                    onChange={(e) => setNewActionLabel(e.target.value)}
                    placeholder="Digite o rótulo"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actionValue">Valor</Label>
                  <Input
                    id="actionValue"
                    value={newActionValue}
                    onChange={(e) => setNewActionValue(e.target.value)}
                    placeholder="Digite o valor"
                    required
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
