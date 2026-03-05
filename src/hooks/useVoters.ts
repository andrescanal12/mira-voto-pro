import { useState, useEffect, useCallback, useRef } from "react";
import { Voter, VoterStatus } from "@/types/voter";
import { supabase } from "@/lib/supabase";

const STORAGE_KEY = "mira-voters-data-v3";

// Mapear columnas snake_case de Supabase a camelCase del tipo Voter
function fromDB(row: Record<string, unknown>): Voter {
  return {
    id: row.id as string,
    pais: (row.pais as string) ?? "",
    ciudad: (row.ciudad as string) ?? "",
    iglesia: (row.iglesia as string) ?? "",
    cedula: (row.cedula as string) ?? "",
    nombre: (row.nombre as string) ?? "",
    celular: (row.celular as string) ?? "",
    cedulaInscrita: (row.cedula_inscrita as string) ?? "",
    lider: (row.lider as string) ?? "",
    referido: (row.referido as string) ?? "",
    estadoInscripcion: (row.estado_inscripcion as string) ?? "",
    estado: ((row.estado as string) ?? "Aún no ha venido") as VoterStatus,
    comentario: (row.comentario as string) ?? "",
  };
}

export function useVoters() {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const pendingWrite = useRef(false);

  // ── Carga inicial desde Supabase ────────────────────────────────
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      setIsSyncing(true);

      try {
        const { data, error } = await supabase
          .from("votantes")
          .select("*")
          .order("id");

        if (error) throw error;

        if (data && data.length > 0) {
          const parsed = data.map(fromDB);
          setVoters(parsed);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
          setLastSync(new Date());
          setIsLoading(false);
          setIsSyncing(false);
          return;
        }
      } catch (err) {
        console.warn("⚠️ No se pudo cargar desde Supabase, usando caché:", err);
      }

      // Fallback: caché local
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setVoters(parsed);
          }
        } catch { /* ignore */ }
      }

      setIsLoading(false);
      setIsSyncing(false);
    }

    init();
  }, []);

  // ── Suscripción Realtime (reemplaza el polling de 10s) ──────────
  useEffect(() => {
    const channel = supabase
      .channel("votantes-realtime")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "votantes" },
        (payload) => {
          if (pendingWrite.current) return; // evitar conflicto con write local
          const updated = fromDB(payload.new as Record<string, unknown>);
          setVoters((prev) =>
            prev.map((v) => (v.id === updated.id ? updated : v))
          );
          setLastSync(new Date());
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "votantes" },
        (payload) => {
          const inserted = fromDB(payload.new as Record<string, unknown>);
          setVoters((prev) => {
            const exists = prev.some((v) => v.id === inserted.id);
            return exists ? prev : [...prev, inserted];
          });
          setLastSync(new Date());
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ── Caché local al cambiar voters ───────────────────────────────
  useEffect(() => {
    if (voters.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(voters));
    }
  }, [voters]);

  // ── Actualiza estado local + persiste en Supabase ───────────────
  const updateVoterStatus = useCallback((id: string, status: VoterStatus) => {
    pendingWrite.current = true;
    setVoters((prev) =>
      prev.map((v) => {
        if (v.id !== id) return v;
        supabase
          .from("votantes")
          .update({ estado: status })
          .eq("id", id)
          .then(({ error }) => {
            if (error) console.warn("⚠️ Supabase update estado:", error.message);
          })
          .finally(() => {
            pendingWrite.current = false;
          });
        return { ...v, estado: status };
      })
    );
  }, []);

  // ── Actualiza comentario local + persiste en Supabase ───────────
  const updateVoterComment = useCallback((id: string, comentario: string) => {
    pendingWrite.current = true;
    setVoters((prev) =>
      prev.map((v) => {
        if (v.id !== id) return v;
        supabase
          .from("votantes")
          .update({ comentario })
          .eq("id", id)
          .then(({ error }) => {
            if (error) console.warn("⚠️ Supabase update comentario:", error.message);
          })
          .finally(() => {
            pendingWrite.current = false;
          });
        return { ...v, comentario };
      })
    );
  }, []);

  // ── Sync manual ──────────────────────────────────────────────────
  const manualSync = useCallback(async () => {
    if (pendingWrite.current) return;
    setIsSyncing(true);
    try {
      const { data, error } = await supabase
        .from("votantes")
        .select("*")
        .order("id");
      if (error) throw error;
      if (data && data.length > 0) {
        const parsed = data.map(fromDB);
        setVoters(parsed);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        setLastSync(new Date());
      }
    } catch (err) {
      console.warn("⚠️ manualSync error:", err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const loadVoters = useCallback((data: Voter[]) => { setVoters(data); }, []);
  const clearData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    manualSync();
  }, [manualSync]);

  const addVoter = useCallback(async (nombre: string, cedula: string) => {
    const id = `extra-${Date.now()}`;
    const newVoter: Voter = {
      id,
      nombre,
      cedula,
      estado: "Aún no ha venido" as VoterStatus,
      comentario: "Agregado manualmente",
      pais: "España",
      ciudad: "ALICANTE",
      iglesia: "",
      celular: "",
      cedulaInscrita: "",
      lider: "",
      referido: "",
      estadoInscripcion: "",
    };

    // Actualización optimista
    setVoters((prev) => [...prev, newVoter]);

    try {
      const { error } = await supabase.from("votantes").insert({
        id,
        nombre,
        cedula,
        estado: newVoter.estado,
        comentario: newVoter.comentario,
        pais: newVoter.pais,
        ciudad: newVoter.ciudad,
      });
      if (error) throw error;
    } catch (err) {
      console.error("⚠️ Error agregando votante:", err);
      manualSync(); // Recargar en caso de error
    }
  }, [manualSync]);

  return {
    voters,
    isLoading,
    isSyncing,
    lastSync,
    isSyncEnabled: true,
    loadVoters,
    updateVoterStatus,
    updateVoterComment,
    addVoter,
    clearData,
    manualSync,
  };
}
