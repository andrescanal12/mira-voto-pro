import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogIn, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import miraLogo from "@/assets/mira-logo.jpg";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      toast.success("Bienvenido al Sistema Alicante");
      navigate("/");
    } else {
      setError(true);
      toast.error("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen mira-bg-pattern flex items-center justify-center p-4 relative">
      {/* Background elements to match Index design */}
      <div className="mira-orb mira-orb-1" />
      <div className="mira-orb mira-orb-2" />
      
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#fbba00] via-[#FCD116] to-[#fbba00]" />
        
        <CardHeader className="flex flex-col items-center space-y-4 pt-10">
          <div className="relative">
            <div className="absolute inset-0 bg-[#fbba00] blur-2xl opacity-20 rounded-full" />
            <img
              src={miraLogo}
              alt="MIRA Logo"
              className="w-24 h-24 rounded-full border-4 border-white shadow-xl relative z-10"
            />
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black text-white tracking-tight">
              SISTEMA <span className="text-[#fbba00]">ALICANTE</span>
            </h1>
            <p className="text-white/60 text-sm font-medium">Control de Acceso — MIRA España</p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#fbba00] uppercase tracking-wider ml-1">Usuario</label>
              <Input
                type="text"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(false);
                }}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 focus:ring-[#fbba00] focus:border-[#fbba00]"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#fbba00] uppercase tracking-wider ml-1">Contraseña</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 focus:ring-[#fbba00] focus:border-[#fbba00]"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20 text-sm animate-in fade-in slide-in-from-top-1">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>Acceso denegado. Verifica tus datos.</span>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-[#fbba00] hover:bg-[#e0a600] text-[#00289f] font-black h-12 shadow-lg shadow-[#fbba00]/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-2"
            >
              <LogIn className="mr-2 h-5 w-5" />
              INICIAR SESIÓN
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center pb-8">
          <p className="text-white/40 text-[10px] text-center max-w-[200px]">
            © 2026 Movimiento Independiente de Renovación Absoluta.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
