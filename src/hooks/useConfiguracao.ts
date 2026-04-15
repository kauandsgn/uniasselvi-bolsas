import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Configuracao {
  desconto_percentual: string;
  matricula_gratis: string;
  mensagem_beneficio: string;
  [key: string]: string;
}

export const useConfiguracao = () => {
  const [config, setConfig] = useState<Configuracao | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      const { data, error } = await supabase
        .from('configuracoes')
        .select('chave, valor');

      if (error) {
        console.error('Erro ao buscar configurações:', error);
        setLoading(false);
        return;
      }

      const configMap = (data || []).reduce((acc: Record<string, string>, item: { chave: string; valor: string }) => {
        acc[item.chave] = item.valor;
        return acc;
      }, {});

      setConfig(configMap as Configuracao);
      setLoading(false);
    };

    fetchConfig();
  }, []);

  return { config, loading };
};
