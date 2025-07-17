
import HospitalLayout from "@/components/HospitalLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Badge
} from "@/components/ui/badge";
import {
  Button
} from "@/components/ui/button";
import {
  Edit,
  Trash2,
  Stethoscope
} from "lucide-react";

const Cirurgias = () => {
  const cirurgias = [
    {
      id: "CIR001",
      paciente: "João Silva",
      procedimento: "Apendicectomia",
      cirurgiao: "Dr. Maria Santos",
      data: "2024-01-15",
      status: "Realizada"
    },
    {
      id: "CIR002",
      paciente: "Ana Costa",
      procedimento: "Colecistectomia",
      cirurgiao: "Dr. Carlos Lima",
      data: "2024-01-20",
      status: "Agendada"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Realizada":
        return "bg-green-100 text-green-800";
      case "Agendada":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  return (
    <HospitalLayout currentPage="cirurgias" onPageChange={() => {}}>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Cirurgias</h1>
          <p className="text-muted-foreground">Gerenciar agendamentos e histórico de cirurgias</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cirurgias.map((cirurgia) => (
            <Card key={cirurgia.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex gap-2 items-center">
                    <Stethoscope className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{cirurgia.procedimento}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {cirurgia.paciente} • {cirurgia.cirurgiao}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Data:</span>
                  <span className="text-sm">{new Date(cirurgia.data).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge className={getStatusColor(cirurgia.status)}>{cirurgia.status}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </HospitalLayout>
  );
}

export default Cirurgias;
