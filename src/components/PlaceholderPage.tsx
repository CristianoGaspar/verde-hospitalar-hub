
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Settings, FileText, Calendar, Clock, Users } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}

export default function PlaceholderPage({ title, description, icon, features }: PlaceholderPageProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="bg-hospital-primary rounded-lg p-3">
            {icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-hospital-dark">{title}</h1>
            <p className="text-gray-600">{description}</p>
          </div>
        </div>
        <Button className="bg-hospital-primary hover:bg-hospital-dark">
          <Plus className="h-4 w-4 mr-2" />
          Novo {title.slice(0, -1)}
        </Button>
      </div>

      {/* Em Desenvolvimento */}
      <Card>
        <CardContent className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-hospital-light rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Settings className="h-12 w-12 text-hospital-primary" />
            </div>
            <h3 className="text-2xl font-bold text-hospital-dark mb-4">Módulo em Desenvolvimento</h3>
            <p className="text-gray-600 mb-6">
              Esta seção está sendo desenvolvida e em breve estará disponível com todas as funcionalidades.
            </p>
            
            {/* Funcionalidades Planejadas */}
            <div className="text-left bg-hospital-light rounded-lg p-6">
              <h4 className="font-bold text-hospital-dark mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Funcionalidades Planejadas:
              </h4>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-hospital-primary rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 text-hospital-primary mx-auto mb-2" />
            <h3 className="font-bold text-hospital-dark">Cadastros</h3>
            <p className="text-sm text-gray-600 mt-1">Sistema completo de cadastramento</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-hospital-accent mx-auto mb-2" />
            <h3 className="font-bold text-hospital-dark">Consultas</h3>
            <p className="text-sm text-gray-600 mt-1">Busca e filtros avançados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-bold text-hospital-dark">Relatórios</h3>
            <p className="text-sm text-gray-600 mt-1">Exportação PDF e Excel</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
