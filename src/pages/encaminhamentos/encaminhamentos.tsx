import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Package, Trash2, Edit, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
const Encaminhamentos = () => {
  const stats = [
    {
      title: "Receita Mensal",
      value: "R$ 127.450",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Cirurgias Realizadas",
      value: "48",
      change: "+8.2%",
      icon: Activity,
      color: "text-primary"
    },
    {
      title: "Pacientes Ativos",
      value: "156",
      change: "+5.1%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Faturas Pendentes",
      value: "23",
      change: "-3.2%",
      icon: Calendar,
      color: "text-yellow-600"
    }
  ]

  const recentSurgeries = [
    {
      id: "CIR001",
      patient: "João Silva",
      procedure: "Apendicectomia",
      surgeon: "Dr. Maria Santos",
      date: "2024-01-15",
      value: "R$ 3.500",
      status: "Concluída"
    },
    {
      id: "CIR002",
      patient: "Ana Costa",
      procedure: "Colecistectomia",
      surgeon: "Dr. Carlos Lima",
      date: "2024-01-14",
      value: "R$ 5.200",
      status: "Concluída"
    },
    {
      id: "CIR003",
      patient: "Pedro Oliveira",
      procedure: "Hernioplastia",
      surgeon: "Dr. Maria Santos",
      date: "2024-01-13",
      value: "R$ 4.100",
      status: "Faturada"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluída":
        return "bg-green-100 text-green-800"
      case "Faturada":
        return "bg-blue-100 text-blue-800"
      case "Pendente":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Encaminhamentos</h1>
          <p className="text-muted-foreground">
            Visão geral dos procedimentos, cirurgias e faturamento
          </p>
        </div>
        <BackButton />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} em relação ao mês anterior
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Receita dos Últimos 6 Meses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center text-muted-foreground">
              Gráfico de receita seria renderizado aqui
            </div>
          </CardContent>
        </Card>

        {/* Procedures by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Procedimentos por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center text-muted-foreground">
              Gráfico de procedimentos seria renderizado aqui
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Surgeries */}
      <Card>
        <CardHeader>
          <CardTitle>Cirurgias Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Paciente</th>
                  <th className="text-left p-2">Procedimento</th>
                  <th className="text-left p-2">Cirurgião</th>
                  <th className="text-left p-2">Data</th>
                  <th className="text-left p-2">Valor</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentSurgeries.map((surgery) => (
                  <tr key={surgery.id} className="border-b">
                    <td className="p-2 font-medium">{surgery.id}</td>
                    <td className="p-2">{surgery.patient}</td>
                    <td className="p-2">{surgery.procedure}</td>
                    <td className="p-2">{surgery.surgeon}</td>
                    <td className="p-2">{new Date(surgery.date).toLocaleDateString('pt-BR')}</td>
                    <td className="p-2 font-semibold">{surgery.value}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(surgery.status)}`}>
                        {surgery.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Encaminhamentos