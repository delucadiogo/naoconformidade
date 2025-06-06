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
    situationTypes,
    actions,
    loading,
    addProductType,
    removeProductType,
    addSituationType,
    removeSituationType,
    addAction,
    removeAction
  } = useConfig();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  const [newProductLabel, setNewProductLabel] = useState('');
  const [newProductValue, setNewProductValue] = useState('');
  const [newSituationLabel, setNewSituationLabel] = useState('');
  const [newSituationValue, setNewSituationValue] = useState('');
  const [newActionLabel, setNewActionLabel] = useState('');
  const [newActionValue, setNewActionValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddProductType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductLabel || !newProductValue) return;

    try {
      setIsSubmitting(true);
      await addProductType({ label: newProductLabel, value: newProductValue });
      setNewProductLabel('');
      setNewProductValue('');
    } catch (error) {
      console.error('Erro ao adicionar tipo de produto:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSituationType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSituationLabel || !newSituationValue) return;

    try {
      setIsSubmitting(true);
      await addSituationType({ label: newSituationLabel, value: newSituationValue });
      setNewSituationLabel('');
      setNewSituationValue('');
    } catch (error) {
      console.error('Erro ao adicionar tipo de situação:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionLabel || !newActionValue) return;

    try {
      setIsSubmitting(true);
      await addAction({ label: newActionLabel, value: newActionValue });
      setNewActionLabel('');
      setNewActionValue('');
    } catch (error) {
      console.error('Erro ao adicionar ação:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-6">Configurações</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tipos de Produto */}
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

              <div className="space-y-2">
                {productTypes.map((type) => (
                  <div key={type.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{type.label}</p>
                      <p className="text-sm text-gray-500">{type.value}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProductType(type.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tipos de Situação */}
          <Card>
            <CardHeader>
              <CardTitle>Tipos de Situação</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddSituationType} className="space-y-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="situationLabel">Rótulo</Label>
                  <Input
                    id="situationLabel"
                    value={newSituationLabel}
                    onChange={(e) => setNewSituationLabel(e.target.value)}
                    placeholder="Digite o rótulo"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="situationValue">Valor</Label>
                  <Input
                    id="situationValue"
                    value={newSituationValue}
                    onChange={(e) => setNewSituationValue(e.target.value)}
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

              <div className="space-y-2">
                {situationTypes.map((type) => (
                  <div key={type.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{type.label}</p>
                      <p className="text-sm text-gray-500">{type.value}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSituationType(type.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAction} className="space-y-4 mb-6">
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
                  Adicionar Ação
                </Button>
              </form>

              <div className="space-y-2">
                {actions.map((action) => (
                  <div key={action.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{action.label}</p>
                      <p className="text-sm text-gray-500">{action.value}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAction(action.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Settings;
