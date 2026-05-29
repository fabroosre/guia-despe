import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Promotion } from '../types/Promotion';

export const usePromotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPromotions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('tabla_de_promociones')
        .select('*')
        .order('created_at', { ascending: false })
        .returns<Promotion[]>();

      if (error) throw error;

      const rawData = data;
      const now = new Date();

      const activePromotions = (rawData ?? []).filter((promotion) => {
        if (promotion.activo === false) return false;

        if (promotion.fecha_inicio) {
          const startDate = new Date(promotion.fecha_inicio);
          if (startDate > now) return false;
        }

        if (promotion.fecha_vencimiento) {
          const endDate = new Date(promotion.fecha_vencimiento);
          if (endDate < now) return false;
        }

        return true;
      });

      setPromotions(activePromotions);
    } catch (err: any) {
      console.error('Error fetching promotions:', err);
      setError(err instanceof Error ? err : new Error('Error fetching promotions'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromotions();
  }, []);

  return {
    promotions,
    loading,
    error,
    refetch: fetchPromotions,
  };
};
