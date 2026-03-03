import { useState, useEffect } from "react";

// Cierre de urnas: 8 de marzo de 2026 a las 16:00 (hora España)
const ELECTION_DATE = new Date("2026-03-08T16:00:00+01:00");

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
    { label: "HORAS", value: timeLeft.horas },
    { label: "MIN", value: timeLeft.minutos },
    { label: "SEG", value: timeLeft.segundos },
  ];

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(10,35,130,0.8) 0%, rgba(0,25,100,0.9) 100%)",
      border: "1.5px solid rgba(255,255,255,0.15)",
      backdropFilter: "blur(6px)",
      boxShadow: "0 6px 16px rgba(0,0,20,0.5)",
      borderRadius: "0.5rem",
      padding: "0.6rem 1.2rem",
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "0.3rem"
    }}>
      <div style={{ color: "white", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.8px", opacity: 0.95, textTransform: "uppercase" }}>
        Faltan para las elecciones
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.4rem" }}>
        {units.map((u, i) => (
          <div key={u.label} style={{ display: "flex", alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ color: "white", fontSize: "1.6rem", fontWeight: 800, lineHeight: 1 }}>
                {String(u.value).padStart(2, "0")}
              </span>
              <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.55rem", fontWeight: 600, marginTop: "0.2rem", letterSpacing: "0.5px" }}>
                {u.label}
              </span>
            </div>
            {i < units.length - 1 && (
              <span style={{ color: "white", fontSize: "1.2rem", fontWeight: 700, margin: "0 0.3rem", alignSelf: "flex-start", opacity: 0.8, paddingTop: "0.1rem" }}>
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContadorRegresivo;
