import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    userType: ''
  });

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: formData.username,
        senha: formData.password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.erro || 'Falha no login');
      return;
    }

    // Mapeia o tipo selecionado para o valor no banco
    const tipoMap: Record<string, string> = {
      admin: 'administrador',
      medico: 'medico',
      enfermagem: 'Enfermagem',
      recepcao: 'Recepção'
    };

  if (data.perfil.toLowerCase() !== formData.userType) {
  alert("Tipo de usuário incorreto para este login");
  return;
}


    // Login OK, redireciona
    navigate('/dashboard');
  } catch (error) {
    console.error(error);
    alert('Erro ao conectar com o servidor');
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-hospital-light to-hospital-accent flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 w-16 h-16 bg-hospital-primary rounded-full flex items-center justify-center">
            <Activity className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-hospital-primary">
            Sistema Hospitalar
          </CardTitle>
          <p className="text-muted-foreground">
            Acesse sua conta para continuar
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                type="text"
                placeholder="Digite seu usuário"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="border-hospital-primary/20 focus:border-hospital-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="border-hospital-primary/20 focus:border-hospital-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="userType">Tipo de Usuário</Label>
              <Select value={formData.userType} onValueChange={(value) => setFormData({...formData, userType: value})}>
                <SelectTrigger className="border-hospital-primary/20 focus:border-hospital-primary">
                  <SelectValue placeholder="Selecione o tipo de acesso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="administrador">administrador</SelectItem>
                  <SelectItem value="medico">Médico</SelectItem>
                  <SelectItem value="enfermagem">Enfermagem</SelectItem>
                  <SelectItem value="atendente">Recepção</SelectItem>
                   <SelectItem value="gerente">Gerente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              type="submit"
              className="w-full bg-hospital-primary hover:bg-hospital-primary/90 text-white"
            >
              Entrar
            </Button>
          </form>
          
          <div className="text-center text-sm text-muted-foreground">
            Sistema Hospitalar v1.0
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;