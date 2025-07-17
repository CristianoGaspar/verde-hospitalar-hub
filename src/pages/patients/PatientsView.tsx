import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

export default function PatientsView() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-primary">Pacientes</h1>
              <p className="text-muted-foreground">Visualizar pacientes cadastrados</p>
            </div>
          </div>
          <Link to="/patients/register">
            <Button className="bg-primary hover:bg-primary/90">
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Paciente
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Em desenvolvimento...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}