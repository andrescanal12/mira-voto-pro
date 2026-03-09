import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogIn, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import gsap from "gsap";
import miraLogo from "@/assets/mira-logo.jpg";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const cardRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrada única y suave, sin bucles
      gsap.from(cardRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2
      });

      gsap.from(headerRef.current?.children || [], {
        y: 10,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out",
        delay: 0.4
      });

      if (formRef.current) {
        gsap.from(formRef.current.children, {
          y: 15,
          opacity: 0,
          stagger: 0.08,
          duration: 0.5,
          ease: "power2.out",
          delay: 0.6
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    
    if (success) {
      toast({
        title: "¡Bienvenido de nuevo!",
        description: "Acceso concedido al sistema.",
      });
      navigate("/");
    } else {
      setError(true);
      // Animación de error (shake)
      gsap.to(cardRef.current, {
        x: [-10, 10, -10, 10, 0],
        duration: 0.4,
        ease: "power2.inOut"
      });
      toast({
        variant: "destructive",
        title: "Error de acceso",
        description: "Usuario o contraseña incorrectos.",
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#00289f] relative overflow-y-auto">
      {/* Fondo estático limpio */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#00289f] via-[#001f7a] to-[#001560]" />
      
      {/* Rayos de fondo sutiles */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none" style={{
        background: 'repeating-conic-gradient(from 0deg at 50% 30%, transparent 0deg 2deg, white 2deg 4deg)'
      }}></div>

      <div ref={cardRef} className="w-full max-w-md relative z-10 my-8">
        <Card className="bg-white/10 backdrop-blur-2xl border-white/20 shadow-2xl overflow-hidden rounded-[2.5rem]">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#fbba00]" />
          
          <CardHeader ref={headerRef} className="flex flex-col items-center space-y-3 pt-10 pb-4">
            <div className="w-28 h-28 rounded-full border-4 border-white/90 shadow-xl bg-white overflow-hidden flex items-center justify-center">
              <img
                src={miraLogo}
                alt="MIRA Logo"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-black text-white tracking-tighter drop-shadow-md">
                SISTEMA <span className="text-[#fbba00]">ALICANTE</span>
              </h1>
              <div className="flex items-center justify-center gap-2">
                <div className="h-px w-6 bg-white/30" />
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-[0.2em]">Acceso MIRA España</p>
                <div className="h-px w-6 bg-white/30" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-8">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 pb-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#fbba00] uppercase tracking-widest ml-1">Identificación</label>
                <Input
                  type="text"
                  placeholder="Usuario"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError(false);
                  }}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-12 rounded-xl focus:ring-[#fbba00]/30 transition-all pl-4"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#fbba00] uppercase tracking-widest ml-1">Seguridad</label>
                <Input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-12 rounded-xl focus:ring-[#fbba00]/30 transition-all pl-4"
                  required
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-200 bg-red-500/20 p-3 rounded-xl border border-red-500/30 text-[11px] font-bold backdrop-blur-md">
                  <ShieldAlert className="h-4 w-4 text-red-400" />
                  <span>Credenciales inválidas. Acceso restringido.</span>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-[#fbba00] hover:bg-[#ffcd38] text-[#00289f] font-black h-12 rounded-xl shadow-lg transition-all mt-4 flex items-center justify-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                INICIAR SESIÓN
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col items-center pb-8 pt-0">
            <p className="text-white/40 text-[9px] text-center font-medium uppercase tracking-tighter">
              Sistema de Seguimiento Electoral © 2026
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
