import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import DoctorsRegister from "./pages/doctors/DoctorsRegister";
import DoctorsView from "./pages/doctors/DoctorsView";
import AppointmentsRegister from "./pages/appointments/AppointmentsRegister";
import AppointmentsView from "./pages/appointments/AppointmentsView";
import InsuranceRegister from "./pages/insurance/InsuranceRegister";
import InsuranceView from "./pages/insurance/InsuranceView";
import MedicationsRegister from "./pages/medications/MedicationsRegister";
import MedicationsView from "./pages/medications/MedicationsView";
import HospitalSuppliesRegister from "./pages/hospital-supplies/HospitalSuppliesRegister";
import HospitalSuppliesView from "./pages/hospital-supplies/HospitalSuppliesView";
import CleaningSuppliesRegister from "./pages/cleaning-supplies/CleaningSuppliesRegister";
import CleaningSuppliesView from "./pages/cleaning-supplies/CleaningSuppliesView";
import SurgicalToolsRegister from "./pages/surgical-tools/SurgicalToolsRegister";
import SurgicalToolsView from "./pages/surgical-tools/SurgicalToolsView";
import SurgicalEquipmentRegister from "./pages/surgical-equipment/SurgicalEquipmentRegister";
import SurgicalEquipmentView from "./pages/surgical-equipment/SurgicalEquipmentView";
import PatientsRegister from "./pages/patients/PatientsRegister";
import PatientsView from "./pages/patients/PatientsView";

import Encaminhamentos from "./pages/encaminhamentos/encaminhamentos";
import Procedimentos from "./pages/procedimentos/procedimentos";
import Cirurgias from "./pages/cirurgias/cirurgias";
import Faturas from "./pages/faturas/faturas";
import Users from "./pages/users/Users";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Index />} />

          {/* Patients */}
          <Route path="/patients" element={<PatientsView />} />
          <Route path="/patients/register" element={<PatientsRegister />} />

          {/* Doctors */}
          <Route path="/doctors" element={<DoctorsView />} />
          <Route path="/doctors/register" element={<DoctorsRegister />} />

          {/* Appointments */}
          <Route path="/appointments" element={<AppointmentsView />} />
          <Route path="/appointments/register" element={<AppointmentsRegister />} />

          {/* Insurance */}
          <Route path="/insurance" element={<InsuranceView />} />
          <Route path="/insurance/register" element={<InsuranceRegister />} />

          {/* Medications */}
          <Route path="/medications" element={<MedicationsView />} />
          <Route path="/medications/register" element={<MedicationsRegister />} />

          {/* Hospital Supplies */}
          <Route path="/hospital-supplies" element={<HospitalSuppliesView />} />
          <Route path="/hospital-supplies/register" element={<HospitalSuppliesRegister />} />

          {/* Cleaning Supplies */}
          <Route path="/cleaning-supplies" element={<CleaningSuppliesView />} />
          <Route path="/cleaning-supplies/register" element={<CleaningSuppliesRegister />} />

          {/* Surgical Tools */}
          <Route path="/surgical-tools" element={<SurgicalToolsView />} />
          <Route path="/surgical-tools/register" element={<SurgicalToolsRegister />} />

          {/* Surgical Equipment */}
          <Route path="/surgical-equipment" element={<SurgicalEquipmentView />} />
          <Route path="/surgical-equipment/register" element={<SurgicalEquipmentRegister />} />

          {/* Encaminhamentos */}
          <Route path="/encaminhamentos" element={< Encaminhamentos />} />

          {/* Procedimentos */}
          <Route path="/procedimentos" element={< Procedimentos />} />

          {/* Cirurgias */}
          <Route path="/cirurgias" element={< Cirurgias />} />

          {/* Faturas */}
          <Route path="/faturas" element={< Faturas />} />

          {/* Users */}
          <Route path="/users" element={<Users />} />



          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
