import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

// Día de elecciones Colombia 2026 - 31 de mayo 2026
const ELECTION_DATE = new Date("2026-05-31T07:00:00-05:00");

const ContadorRegresivo = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const now = new Date();
    const diff = ELECTION_DATE.getTime() - now.getTime();
    if (diff <= 0) return { dias: 0, horas: 0, minutos: 0, segundos: 0 };

    return {
      dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
      horas: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutos: Math.floor((diff / (1000 * 60)) % 60),
      segundos: Math.floor((diff / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const units = [
    { label: "DÍAS", value: timeLeft.dias },
    { label: "HRS", value: timeLeft.horas },
    { label: "MIN", value: timeLeft.minutos },
    { label: "SEG", value: timeLeft.segundos },
  ];

  return (
    <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-3 flex items-center gap-3">
      <Clock className="h-4 w-4 text-accent shrink-0" />
      <div className="flex items-center gap-1">
        {units.map((u, i) => (
          <div key={u.label} className="flex items-center gap-1">
            <div className="bg-primary rounded-lg px-2 py-1 min-w-[2.2rem] text-center">
              <span className="text-sm md:text-base font-bold text-primary-foreground tabular-nums">
                {String(u.value).padStart(2, "0")}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">{u.label}</span>
            {i < units.length - 1 && (
              <span className="text-accent font-bold mx-0.5">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContadorRegresivo;
