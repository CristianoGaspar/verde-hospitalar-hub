
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  UserCheck,
  Users,
  Calendar,
  Clock,
  UserCog,
  Menu,
  X,
  Activity,
  Bed,
  Stethoscope,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HospitalLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, emoji: '🏥', path: '/dashboard' },
  { id: 'medicos', label: 'Médicos', icon: UserCheck, emoji: '👨‍⚕️', path: '/doctors' },
  { id: 'pacientes', label: 'Pacientes', icon: Users, emoji: '🧑‍💼', path: '/patients' },
  { id: 'consultas', label: 'Consultas', icon: Stethoscope, emoji: '🩺', path: '/appointments' },
  { id: 'agendamentos', label: 'Agendamentos', icon: Calendar, emoji: '📅', path: '/appointments' },
  { id: 'plantoes', label: 'Plantões', icon: Clock, emoji: '⏱️', path: '/dashboard' },
  { id: 'colaboradores', label: 'Colaboradores', icon: UserCog, emoji: '👥', path: '/dashboard' },
  { id: 'relatorios', label: 'Relatórios', icon: FileText, emoji: '📊', path: '/dashboard' },
  // Novos itens migrados do hospital-dashboard-fusion
  { id: 'faturas', label: 'Faturas', icon: DollarSign, emoji: '💵', path: '/dashboard' },
  { id: 'encaminhamentos', label: 'Encaminhamentos', icon: FolderOpen, emoji: '📂', path: '/dashboard' },
  { id: 'cirurgias', label: 'Cirurgias', icon: Bed, emoji: '🛏️', path: '/dashboard' },
  { id: 'procedimentos', label: 'Procedimentos', icon: Stethoscope, emoji: '🧪', path: '/dashboard' },

];

export default function HospitalLayout({ children, currentPage, onPageChange }: HospitalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-hospital-light">
      {/* Header móvel */}
      <div className="lg:hidden bg-white shadow-sm border-b border-hospital-secondary p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="h-8 w-8 text-hospital-primary" />
          <h1 className="text-xl font-bold text-hospital-dark">HospitalSys</h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-hospital-secondary transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          {/* Logo - apenas desktop */}
          <div className="hidden lg:flex items-center space-x-3 p-6 border-b border-hospital-secondary">
            <div className="bg-hospital-primary rounded-lg p-2">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-hospital-dark">HospitalSys</h1>
          </div>

          {/* Menu */}
          <nav className="mt-6 lg:mt-0">
            <ul className="space-y-2 px-4">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path ||
                  (item.id === 'dashboard' && location.pathname === '/dashboard');
                const Icon = item.icon;

                return (
                  <li key={item.id}>
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 hover:bg-hospital-secondary",
                        isActive
                          ? "bg-hospital-primary text-white shadow-md"
                          : "text-hospital-dark hover:text-hospital-primary"
                      )}
                    >
                      <span className="text-lg" role="img" aria-label={item.label}>
                        {item.emoji}
                      </span>
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer do sidebar */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-hospital-light rounded-lg p-4 text-center">
              <p className="text-sm text-hospital-dark font-medium">Sistema Hospitalar</p>
              <p className="text-xs text-gray-600 mt-1">Versão 1.0</p>
            </div>
          </div>
        </aside>

        {/* Overlay móvel */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Conteúdo principal */}
        <main className="flex-1 lg:ml-0 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
