import { useState, useEffect, useCallback, useRef } from "react";
import { Voter, VoterStatus } from "@/types/voter";
import { BASE_VOTERS } from "@/data/votersData";
import {
  getAllVotersFromSheet,
  updateVoterStatus as syncStatusToSheet,
  updateVoterComment as syncCommentToSheet,
  estadoToYaVoto,
  SHEETS_API_URL,
} from "@/services/sheetsApi";

const STORAGE_KEY = "mira-voters-data-v2";
const POLL_INTERVAL = 30_000; // 30 segundos
const IS_SYNC_ENABLED = SHEETS_API_URL.startsWith("https://script.google.com");

export function useVoters() {
  const [voters, setVoters] = useState<Voter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Ref para saber si hay una actualización local en vuelo (evita que el poll
  // sobreescriba un cambio optimista que aún no llegó a Sheets)
  const pendingWrite = useRef(false);

  // ──────────────────────────────────────────────────────────────
  // Función de fetch reutilizable (carga inicial + polling)
  // Solo actualiza los voters que CAMBIARON para no interrumpir la UI
  // ──────────────────────────────────────────────────────────────
  const fetchFromSheet = useCallback(async (silent = false) => {
    if (!IS_SYNC_ENABLED) return;
    if (pendingWrite.current) return; // espera a que el write termine
    if (!silent) setIsSyncing(true);

    try {
      const fromSheet = await getAllVotersFromSheet();
      if (fromSheet.length > 0) {
        setVoters((prev) => {
          // Merge inteligente: solo actualiza filas que cambiaron
          const prevMap = new Map(prev.map((v) => [v.id, v]));
          let changed = false;
          const merged = fromSheet.map((remote) => {
            const local = prevMap.get(remote.id);
            if (!local) { changed = true; return remote; }
            if (
              local.estado !== remote.estado ||
              local.comentario !== remote.comentario
            ) {
              changed = true;
              return remote;
            }
            return local; // sin cambio → misma referencia → no re-render
          });
          return changed ? merged : prev; // si nada cambió, retorna el mismo array
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fromSheet));
        setLastSync(new Date());
      }
    } catch (err) {
      console.warn("⚠️ Poll: no se pudo sincronizar con Sheets:", err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // ── Carga inicial ──
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      if (IS_SYNC_ENABLED) {
        try {
          const fromSheet = await getAllVotersFromSheet();
          if (fromSheet.length > 0) {
            setVoters(fromSheet);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(fromSheet));
            setLastSync(new Date());
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.warn("⚠️ No se pudo cargar desde Google Sheets, usando caché local:", err);
        }
      }

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setVoters(parsed);
            setIsLoading(false);
            return;
          }
        } catch { /* ignore */ }
      }

      setVoters(BASE_VOTERS);
      setIsLoading(false);
    }

    init();
  }, []);

  // ── Polling automático cada 30s ──
  useEffect(() => {
    if (!IS_SYNC_ENABLED) return;
    const id = setInterval(() => fetchFromSheet(true), POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetchFromSheet]);

  // ── Caché local ──
  useEffect(() => {
    if (voters.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(voters));
    }
  }, [voters]);

  // ── Actualiza estado localmente + Sheets ──
  const updateVoterStatus = useCallback((id: string, status: VoterStatus) => {
    pendingWrite.current = true;
    setVoters((prev) => {
      const updated = prev.map((v) => {
        if (v.id !== id) return v;
        if (IS_SYNC_ENABLED) {
          syncStatusToSheet(v.cedula, estadoToYaVoto(status))
            .catch((err) => console.warn("⚠️ Sync estado:", err))
            .finally(() => { pendingWrite.current = false; });
        } else {
          pendingWrite.current = false;
        }
        return { ...v, estado: status };
      });
      return updated;
    });
  }, []);

  // ── Actualiza comentario localmente + Sheets ──
  const updateVoterComment = useCallback((id: string, comentario: string) => {
    pendingWrite.current = true;
    setVoters((prev) =>
      prev.map((v) => {
        if (v.id !== id) return v;
        if (IS_SYNC_ENABLED) {
          syncCommentToSheet(v.cedula, comentario)
            .catch((err) => console.warn("⚠️ Sync comentario:", err))
            .finally(() => { pendingWrite.current = false; });
        } else {
          pendingWrite.current = false;
        }
        return { ...v, comentario };
      })
    );
  }, []);

  const loadVoters = useCallback((data: Voter[]) => { setVoters(data); }, []);
  const clearData = useCallback(() => {
    setVoters(BASE_VOTERS);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Sync manual: para el botón en la UI
  const manualSync = useCallback(() => fetchFromSheet(false), [fetchFromSheet]);

  return {
    voters,
    isLoading,
    isSyncing,
    lastSync,
    isSyncEnabled: IS_SYNC_ENABLED,
    loadVoters,
    updateVoterStatus,
    updateVoterComment,
    clearData,
    manualSync,
  };
}
