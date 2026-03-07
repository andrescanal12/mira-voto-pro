
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface LogisticaItem {
  id: string;
  nombre_manual: string;
  voter_id: string | null;
  categoria: string;
  rol: string | null;
  zona: string | null;
  horario_inicio: string | null;
  horario_fin: string | null;
  completado: boolean;
  updated_at: string;
}

export const useLogistica = () => {
  const [items, setItems] = useState<LogisticaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogistica = async () => {
    try {
      const { data, error } = await supabase
        .from('logistica')
        .select('*')
        .order('categoria', { ascending: true })
        .order('nombre_manual', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      toast.error('Error al cargar logística: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id: string, updates: Partial<LogisticaItem>) => {
    try {
      const { error } = await supabase
        .from('logistica')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      // Optimistic update will be handled by realtime subscription or manual refetch
    } catch (error: any) {
      toast.error('Error al actualizar: ' + error.message);
    }
  };

  useEffect(() => {
    fetchLogistica();

    const channel = supabase
      .channel('logistica-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'logistica' },
        () => {
          fetchLogistica();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { items, loading, updateItem, refetch: fetchLogistica };
};
