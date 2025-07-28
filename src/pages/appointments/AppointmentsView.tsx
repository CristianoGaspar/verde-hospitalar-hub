import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Download,
  FileText,
  Calendar,
  Clock,
  UserCheck,
  UserX,
  AlertCircle,
} from "lucide-react";
import HospitalLayout from "@/components/HospitalLayout";

import { getConsultasAgendadas } from "@/services/appointments/getConsultasAgendadas";
import { getPendingAppointmentsCount } from "@/services/appointments/getPendingCount";
import { getAppointmentsConfirmed } from "@/services/appointments/getPendingCount";
import { getAppointmentsCancelled } from "@/services/appointments/getPendingCount";


const AppointmentsView = () => {
  const [filters, setFilters] = useState({
    patient: "",
    doctor: "",
    dateFrom: "",
    dateTo: "",
    status: "",
    insurance: "",
  });

  const [appointments, setAppointments] = useState([]);
  const [todayTotal, setTodayTotal] = useState<number>(0);
   const [todayConfirmed, setTodayConfirmed] = useState<number>(0);
   const [todayCancelled, setTodayCancelled] = useState<number>(0);
  useEffect(() => {
    async function fetchData() {
      try {
        const total = await getPendingAppointmentsCount();
        setTodayTotal(total);
      } catch (err) {
        console.error("Erro ao buscar total de consultas pendentes:", err);
      }
    }

    fetchData();
  }, []);

    useEffect(() => {
    async function fetchData() {
      try {
        const total = await getAppointmentsConfirmed();
        setTodayConfirmed(total);
      } catch (err) {
        console.error("Erro ao buscar total de consultas pendentes:", err);
      }
    }

    fetchData();
  }, []);

      useEffect(() => {
    async function fetchData() {
      try {
        const total = await getAppointmentsCancelled();
        setTodayCancelled(total);
      } catch (err) {
        console.error("Erro ao buscar total de consultas pendentes:", err);
      }
    }

    fetchData();
  }, []);


  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        const data = await getConsultasAgendadas();
        setAppointments(data);
      } catch (error) {
        console.error("Erro ao buscar consultas agendadas:", error);
      }
    };

    fetchConsultas();
  }, []);

  const dashboardData = {
    todayTotal,
    todayConfirmed,
    topDoctor: "Dr. Maria Costa (8)",
    todayCancelled,
    avgDelay: "15 min",
  };

  return (
    <HospitalLayout currentPage="agendamentos" onPageChange={() => { }}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-hospital-dark">
              Consultar Consultas Agendadas
            </h1>
            <p className="text-muted-foreground">
              Gerencie e visualize agendamentos médicos
            </p>
          </div>
          <Link to="/appointments/register">
            <Button className="bg-hospital-primary hover:bg-hospital-dark">
              <Plus className="h-4 w-4 mr-2" />
              Nova Consulta
            </Button>
          </Link>
        </div>

        {/* Mini Dashboards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-hospital-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total do Dia</p>
                  <p className="text-2xl font-bold text-hospital-primary">
                    {dashboardData.todayTotal}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Pendentes à Confirmar</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {dashboardData.todayConfirmed}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <UserCheck className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Médico Destaque</p>
                  <p className="text-sm font-bold text-green-600">
                    {dashboardData.todayCancelled}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <UserX className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Canceladas - Tentar contato
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {dashboardData.todayCancelled}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Atraso Médio</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {dashboardData.avgDelay}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filtros de Pesquisa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Input
                placeholder="Nome do paciente..."
                value={filters.patient}
                onChange={(e) =>
                  setFilters({ ...filters, patient: e.target.value })
                }
              />
              <Select
                value={filters.doctor}
                onValueChange={(value) =>
                  setFilters({ ...filters, doctor: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Médico" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dr-maria">Dr. Maria Costa</SelectItem>
                  <SelectItem value="dr-pedro">Dr. Pedro Lima</SelectItem>
                  <SelectItem value="dr-ana">Dr. Ana Torres</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) =>
                  setFilters({ ...filters, dateFrom: e.target.value })
                }
              />
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) =>
                  setFilters({ ...filters, dateTo: e.target.value })
                }
              />
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agendada">Agendada</SelectItem>
                  <SelectItem value="confirmada">Confirmada</SelectItem>
                  <SelectItem value="realizada">Realizada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.insurance}
                onValueChange={(value) =>
                  setFilters({ ...filters, insurance: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Convênio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unimed">Unimed</SelectItem>
                  <SelectItem value="bradesco">Bradesco Saúde</SelectItem>
                  <SelectItem value="sulamérica">SulAmérica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Exportar Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle>Consultas Agendadas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Médico</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Convênio</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.consulta_id}>
                    <TableCell className="font-medium">
                      {appointment.nome_cliente}
                    </TableCell>
                    <TableCell>{appointment.nome_medico}</TableCell>
                    <TableCell>
                      {new Date(appointment.data_agendada).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(appointment.data_agendada).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          appointment.status === "agendada"
                            ? "bg-blue-500 text-white"
                            : appointment.status === "confirmada"
                              ? "bg-green-600 text-white"
                              : appointment.status === "cancelada"
                                ? "bg-red-600 text-white"
                                : "bg-gray-500 text-white"
                        }
                      >
                        {appointment.status === "scheduled"
                          ? "Agendada"
                          : appointment.status === "confirmed"
                            ? "Confirmada"
                            : appointment.status === "completed"
                              ? "Realizada"
                              : appointment.status === "cancelled"
                                ? "Cancelada"
                                : appointment.status}
                      </Badge>

                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        {appointment.nome_convenio ? (
                          <Badge className="bg-muted text-black px-4 min-w-[100px] justify-center">{appointment.nome_convenio}</Badge>
                        ) : (
                          <Badge className="bg-yellow-300 text-yellow-12800 center">   SUS   </Badge>
                        )}</div></TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Ver
                        </Button>
                        <Link to={`/appointments/edit/${appointment.consulta_id}`}>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                        </Link>
                        <Button variant="destructive" size="sm">
                          Excluir
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </HospitalLayout>
  );
};

export default AppointmentsView;
