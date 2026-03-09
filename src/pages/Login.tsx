import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogIn, ShieldAlert, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import miraLogo from "@/assets/mira-logo.jpg";
import { gsap } from "gsap";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation
      gsap.from(cardRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.2
      });

      gsap.from(headerRef.current?.children || [], {
        y: 20,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "back.out(1.7)",
        delay: 0.8
      });

      if (formRef.current) {
        gsap.from(formRef.current.children, {
          y: 30,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
          delay: 1.2
        });
      }

      // Floating animation
      gsap.to(cardRef.current, {
        y: "-=15",
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
      });

      // Background parallax
      window.addEventListener("mousemove", (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 30;
        const y = (e.clientY / window.innerHeight - 0.5) * 30;
        gsap.to(bgRef.current, {
          x: x,
          y: y,
          duration: 1,
          ease: "power2.out"
        });
      });
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      toast.success("Bienvenido al Sistema Alicante");
      navigate("/");
    } else {
      setError(true);
      toast.error("Credenciales incorrectas");
      
      // Shake animation on error
      gsap.to(cardRef.current, {
        x: "+=10",
        duration: 0.1,
        repeat: 5,
        yoyo: true,
        ease: "none",
        onComplete: () => gsap.set(cardRef.current, { x: 0 })
      });
    }
  };

  return (
    <div className="min-h-screen mira-bg-pattern flex items-center justify-center p-4 relative overflow-hidden perspective-1000">
      {/* Dynamic Background */}
      <div ref={bgRef} className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="mira-orb mira-orb-1 w-[600px] h-[600px] opacity-40 blur-[120px]" />
        <div className="mira-orb mira-orb-2 w-[500px] h-[500px] opacity-30 blur-[100px] -ml-[200px]" />
        <div className="mira-orb mira-orb-3 w-[400px] h-[400px] opacity-20 blur-[80px] mt-[300px]" />
      </div>

      {/* Sunburst radial lines matching Index */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none',
        background: 'repeating-conic-gradient(from 0deg at 50% 30%, transparent 0deg 2deg, rgba(255, 255, 255, 0.02) 2deg 4deg)'
      }}></div>

      <div ref={cardRef} className="w-full max-w-md relative z-10">
        <Card className="bg-white/10 backdrop-blur-2xl border-white/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden rounded-[2.5rem]">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#fbba00] via-[#FCD116] to-[#fbba00] opacity-80" />
          
          <CardHeader ref={headerRef} className="flex flex-col items-center space-y-4 pt-12 pb-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-[#fbba00] blur-3xl opacity-30 rounded-full group-hover:opacity-50 transition-opacity duration-1000" />
              <div className="w-32 h-32 rounded-full border-4 border-white/80 shadow-2xl relative z-10 bg-white overflow-hidden flex items-center justify-center transform scale-100 group-hover:scale-105 transition-transform duration-700">
                <img
                  src={miraLogo}
                  alt="MIRA Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-1 -right-1 bg-[#fbba00] p-2 rounded-full shadow-lg z-20 animate-pulse border-2 border-white/50">
                <Sparkles className="h-4 w-4 text-[#00289f]" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-black text-white tracking-tighter drop-shadow-lg">
                SISTEMA <span className="text-[#fbba00] drop-shadow-[0_0_15px_rgba(251,186,0,0.3)]">ALICANTE</span>
              </h1>
              <div className="flex items-center justify-center gap-2">
                <div className="h-px w-8 bg-white/20" />
                <p className="text-white/70 text-xs font-bold uppercase tracking-[0.2em]">Acceso MIRA España</p>
                <div className="h-px w-8 bg-white/20" />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5 px-2">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#fbba00] uppercase tracking-[0.2em] ml-1 opacity-80">Identificación</label>
                <div className="relative group/input">
                  <Input
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError(false);
                    }}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-14 rounded-2xl focus:ring-[#fbba00]/30 focus:border-[#fbba00]/50 transition-all pl-5 group-hover/input:bg-white/10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#fbba00] uppercase tracking-[0.2em] ml-1 opacity-80">Seguridad</label>
                <div className="relative group/input">
                  <Input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(false);
                    }}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-14 rounded-2xl focus:ring-[#fbba00]/30 focus:border-[#fbba00]/50 transition-all pl-5 group-hover/input:bg-white/10"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 text-red-100 bg-red-500/20 p-4 rounded-2xl border border-red-500/30 text-xs font-bold backdrop-blur-md animate-in fade-in zoom-in-95">
                  <div className="bg-red-500 p-1.5 rounded-lg shadow-lg">
                    <ShieldAlert className="h-4 w-4" />
                  </div>
                  <span>Credenciales inválidas. Acceso restringido.</span>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-[#fbba00] hover:bg-[#ffcd38] text-[#00289f] font-black h-14 rounded-2xl shadow-[0_10px_20px_-5px_rgba(251,186,0,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] mt-4 flex items-center justify-center gap-3 group/btn"
              >
                <LogIn className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                INICIAR SESIÓN
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col items-center pb-10 pt-4 gap-4">
            <p className="text-white/30 text-[9px] text-center font-medium leading-relaxed max-w-[240px] uppercase tracking-wider">
              Sistema de Seguimiento Electoral Organizado por MIRA España © 2026
            </p>
          </CardFooter>
        </Card>
        
        {/* Subtle reflection below card */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-white/5 blur-3xl rounded-[100%] z-0" />
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default Login;
