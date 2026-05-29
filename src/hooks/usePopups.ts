import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Popup } from '../types/Popup';

export const usePopups = () => {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPopups = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('tabla_de_popups')
          .select('*')
          .eq('activo', true);

        if (error) throw error;

        const now = new Date();
        const validPopups = (data as Popup[]).filter(popup => {
          const startDate = popup.fecha_inicio ? new Date(popup.fecha_inicio) : null;
          const endDate = popup.fecha_vencimiento ? new Date(popup.fecha_vencimiento) : null;
          
          if (startDate && startDate > now) return false;
          if (endDate && endDate < now) return false;
          return true;
        });

        // Sort to show the newest created first
        validPopups.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setPopups(validPopups);
      } catch (err: any) {
        console.error('Error fetching popups:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopups();
  }, []);

  return { popups, loading, error };
};
