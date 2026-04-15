import { useState, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export const useLeadGhosting = () => {
  const [leadId] = useState(() => {
    const saved = localStorage.getItem('uniasselvi_lead_id');
    if (saved) return saved;
    const newId = uuidv4();
    localStorage.setItem('uniasselvi_lead_id', newId);
    return newId;
  });

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveStepData = async (data: Record<string, unknown>) => {
    const { data: response, error } = await supabase.rpc('check_and_upsert_lead', {
      p_id: leadId,
      ...data,
    });

    if (error) {
      console.error("Erro ao salvar lead:", error);
      return { blocked: false };
    }

    if (response?.message === 'CPF_BLOCKED') {
      return { blocked: true, curso: response.curso };
    }

    return { blocked: false };
  };

  const debouncedSave = useCallback((data: Record<string, unknown>, onBlocked?: (curso?: string) => void) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const result = await saveStepData(data);
      if (result.blocked && onBlocked) {
        onBlocked(result.curso);
      }
    }, 1500);
  }, [leadId]);

  const resetSession = () => {
    localStorage.removeItem('uniasselvi_lead_id');
  };

  return { leadId, saveStepData, debouncedSave, resetSession };
};
