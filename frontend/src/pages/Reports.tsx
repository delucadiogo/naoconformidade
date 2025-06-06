import React, { useState } from 'react';
import { useNonConformity } from '../contexts/NonConformityContext';
import { useConfig } from '../contexts/ConfigContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowLeft, Download, FileText, BarChart3, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import NonConformityDetails from '@/components/NonConformityDetails';
import { Loader2 } from 'lucide-react';

const Reports = () => {
  const navigate = useNavigate();
  const { nonConformities, isLoading: isLoadingNonConformities } = useNonConformity();
  const { productTypes, actions, situationTypes, loading: isLoadingConfig } = useConfig();
  const [reportType, setReportType] = useState('summary');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedProductType, setSelectedProductType] = useState('all');
  const [searchProduct, setSearchProduct] = useState('');
  const [selectedNonConformity, setSelectedNonConformity] = useState(null);

  const isLoading = isLoadingNonConformities || isLoadingConfig;

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return dateString;
    }
  };

  const getProductTypeLabel = (value: string) => {
    if (!productTypes) return value;
    const type = productTypes.find(t => t.value === value);
    return type ? type.label : value;
  };

  const getActionTypeLabel = (value: string) => {
    if (!actions) return value;
    const type = actions.find(t => t.value === value);
    return type ? type.label : value;
  };

  const getSituationLabel = (value: string | undefined) => {
    if (!value || !situationTypes) return value || 'Não definida';
    const type = situationTypes.find(t => t.value === value);
    return type ? type.label : value;
  };

  // Filtrar não conformidades baseado nos filtros
  const filteredNonConformities = nonConformities.filter(nc => {
    let include = true;
    
    if (dateFrom && new Date(nc.data_lancamento) < new Date(dateFrom)) {
      include = false;
    }
    
    if (dateTo && new Date(nc.data_lancamento) > new Date(dateTo)) {
      include = false;
    }
    
    if (selectedProductType !== 'all' && nc.tipo_produto !== selectedProductType) {
      include = false;
    }

    if (searchProduct && !nc.nome_produto.toLowerCase().includes(searchProduct.toLowerCase())) {
      include = false;
    }
    
    return include;
  });

  // Dados para gráficos
  const productTypeData = productTypes && !isLoading ? productTypes.map(type => ({
    name: type.label,
    value: filteredNonConformities.filter(nc => nc.tipo_produto === type.value).length
  })).filter(item => item.value > 0) : [];

  const actionTypeData = actions && !isLoading ? actions.map(type => ({
    name: type.label,
    value: filteredNonConformities.filter(nc => nc.acao_tomada === type.value).length
  })).filter(item => item.value > 0) : [];

  const monthlyData = filteredNonConformities.reduce((acc, nc) => {
    const month = new Date(nc.data_lancamento).toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const monthlyChartData = Object.entries(monthlyData).map(([month, count]) => ({
    month,
    count
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const exportToCSV = () => {
    const headers = ['Data Lançamento', 'Produto', 'Validade', 'Lote', 'Tipo', 'Descrição', 'Data Liberação', 'Ação Tomada', 'Situação'];
    const csvContent = [
      headers.join(','),
      ...filteredNonConformities.map(nc => [
        formatDate(nc.data_lancamento),
        nc.nome_produto,
        formatDate(nc.validade),
        nc.lote,
        getProductTypeLabel(nc.tipo_produto),
        `"${nc.descricao}"`,
        formatDate(nc.data_liberacao),
        getActionTypeLabel(nc.acao_tomada),
        getSituationLabel(nc.situacao)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_nao_conformidades_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-800">Relatórios</h1>
            <Button onClick={exportToCSV} className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Exportar CSV</span>
            </Button>
          </div>

          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="reportType">Tipo de Relatório</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summary">Resumo</SelectItem>
                      <SelectItem value="detailed">Detalhado</SelectItem>
                      <SelectItem value="charts">Gráficos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dateFrom">Data Início</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dateTo">Data Fim</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="productType">Tipo de Produto</Label>
                  <Select value={selectedProductType} onValueChange={setSelectedProductType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {productTypes && productTypes.map(type => (
                        <SelectItem key={type.id} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="searchProduct">Nome do Produto</Label>
                  <Input
                    id="searchProduct"
                    type="text"
                    value={searchProduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                    placeholder="Buscar por nome..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumo */}
          {reportType === 'summary' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600">Total de Não Conformidades</p>
                      <p className="text-2xl font-bold text-slate-900">{filteredNonConformities.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <BarChart3 className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600">Liberadas</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {filteredNonConformities.filter(nc => nc.acao_tomada === 'liberada_comercializacao').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <BarChart3 className="h-8 w-8 text-red-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600">Descartadas</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {filteredNonConformities.filter(nc => nc.acao_tomada === 'descarte_produto').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <BarChart3 className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600">Devolvidas</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {filteredNonConformities.filter(nc => nc.acao_tomada === 'devolucao_fornecedor').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Detalhado */}
          {reportType === 'detailed' && (
            <Card>
              <CardHeader>
                <CardTitle>Detalhes das Não Conformidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data Lançamento</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead>Validade</TableHead>
                        <TableHead>Lote</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Ação Tomada</TableHead>
                        <TableHead>Situação</TableHead>
                        <TableHead>Cadastrado por</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredNonConformities.map(nc => (
                        <TableRow key={nc.id}>
                          <TableCell>{formatDate(nc.data_lancamento)}</TableCell>
                          <TableCell>{nc.nome_produto}</TableCell>
                          <TableCell>{formatDate(nc.validade)}</TableCell>
                          <TableCell>{nc.lote}</TableCell>
                          <TableCell>{getProductTypeLabel(nc.tipo_produto)}</TableCell>
                          <TableCell>{getActionTypeLabel(nc.acao_tomada)}</TableCell>
                          <TableCell>{getSituationLabel(nc.situacao)}</TableCell>
                          <TableCell>{nc.criado_por_nome || '-'}</TableCell>
                          <TableCell>
                            <Button
                               variant="ghost"
                               size="icon"
                               onClick={() => setSelectedNonConformity(nc)}
                               title="Visualizar"
                            >
                               <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Gráficos */}
          {reportType === 'charts' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Não Conformidades por Tipo de Produto</CardTitle>
                </CardHeader>
                <CardContent>
                  {productTypeData.length > 0 ? (
                    <div className="w-full h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={productTypeData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          >
                            {productTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value, name) => [`${value} (${((value / filteredNonConformities.length) * 100).toFixed(1)}%)`, name]} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">Sem dados para este gráfico.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Não Conformidades por Ação Tomada</CardTitle>
                </CardHeader>
                <CardContent>
                  {actionTypeData.length > 0 ? (
                    <div className="w-full h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={actionTypeData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#82ca9d"
                            dataKey="value"
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          >
                            {actionTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value, name) => [`${value} (${((value / filteredNonConformities.length) * 100).toFixed(1)}%)`, name]} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                     <p className="text-center text-gray-500">Sem dados para este gráfico.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Não Conformidades por Mês</CardTitle>
                </CardHeader>
                <CardContent>
                   {monthlyChartData.length > 0 ? (
                    <div className="w-full h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={monthlyChartData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" fill="#8884d8" name="Não Conformidades" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                     <p className="text-center text-gray-500">Sem dados para este gráfico.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {selectedNonConformity && (
        <NonConformityDetails
          nonConformity={selectedNonConformity}
          onClose={() => setSelectedNonConformity(null)}
        />
      )}
    </div>
  );
};

export default Reports;
