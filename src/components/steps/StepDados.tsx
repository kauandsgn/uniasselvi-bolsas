import { useState, useCallback } from 'react';

interface StepDadosProps {
  onSubmit: (dados: { p_nome: string; p_whatsapp: string; p_cpf: string; p_nascimento: string }) => void;
  onGhost: (data: Record<string, unknown>) => void;
  loading: boolean;
}

function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function maskCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function maskDate(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function isValidCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  if (rest !== parseInt(digits[9])) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  if (rest !== parseInt(digits[10])) return false;
  
  return true;
}

export default function StepDados({ onSubmit, onGhost, loading }: StepDadosProps) {
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cpf, setCpf] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNomeChange = useCallback((value: string) => {
    setNome(value);
    if (value.length >= 3) {
      onGhost({ p_nome: value });
    }
  }, [onGhost]);

  const handleWhatsappChange = useCallback((value: string) => {
    const masked = maskPhone(value);
    setWhatsapp(masked);
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 10) {
      onGhost({ p_whatsapp: digits });
    }
  }, [onGhost]);

  const handleCpfChange = useCallback((value: string) => {
    const masked = maskCPF(value);
    setCpf(masked);
    const digits = value.replace(/\D/g, '');
    if (digits.length === 11) {
      onGhost({ p_cpf: digits });
    }
  }, [onGhost]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!nome.trim() || nome.trim().length < 3) {
      newErrors.nome = 'Informe seu nome completo';
    }
    
    const whatsDigits = whatsapp.replace(/\D/g, '');
    if (whatsDigits.length < 10) {
      newErrors.whatsapp = 'Informe um WhatsApp válido';
    }
    
    if (!isValidCPF(cpf)) {
      newErrors.cpf = 'Informe um CPF válido';
    }
    
    const dateDigits = nascimento.replace(/\D/g, '');
    if (dateDigits.length !== 8) {
      newErrors.nascimento = 'Informe a data completa';
    } else {
      const day = parseInt(dateDigits.slice(0, 2));
      const month = parseInt(dateDigits.slice(2, 4));
      const year = parseInt(dateDigits.slice(4, 8));
      if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1940 || year > 2010) {
        newErrors.nascimento = 'Data de nascimento inválida';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    const cpfDigits = cpf.replace(/\D/g, '');
    const dateDigits = nascimento.replace(/\D/g, '');
    const formattedDate = `${dateDigits.slice(4, 8)}-${dateDigits.slice(2, 4)}-${dateDigits.slice(0, 2)}`;
    
    onSubmit({
      p_nome: nome.trim(),
      p_whatsapp: whatsapp.replace(/\D/g, ''),
      p_cpf: cpfDigits,
      p_nascimento: formattedDate,
    });
  };

  return (
    <div className="animate-fade-in-up">
      <div className="text-center mb-8">
        <span className="inline-block bg-primary/10 text-secondary text-xs font-bold px-3 py-1 rounded-full mb-3">
          PASSO 4 DE 4
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-secondary">
          Quase lá! Seus <span className="text-primary">dados pessoais</span>
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          Precisamos dessas informações para gerar sua bolsa exclusiva
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
        {/* Nome */}
        <div className="animate-fade-in-up" style={{ animationDelay: '100ms', opacity: 0 }}>
          <label className="block text-sm font-semibold text-secondary mb-1.5">
            Nome Completo
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => handleNomeChange(e.target.value)}
            placeholder="Ex: Maria da Silva"
            className={`w-full px-4 py-3 rounded-xl border-2 ${errors.nome ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-primary'} outline-none transition-all duration-300 text-sm bg-white`}
          />
          {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
        </div>

        {/* WhatsApp */}
        <div className="animate-fade-in-up" style={{ animationDelay: '200ms', opacity: 0 }}>
          <label className="block text-sm font-semibold text-secondary mb-1.5">
            WhatsApp
          </label>
          <input
            type="tel"
            value={whatsapp}
            onChange={(e) => handleWhatsappChange(e.target.value)}
            placeholder="(75) 99999-9999"
            className={`w-full px-4 py-3 rounded-xl border-2 ${errors.whatsapp ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-primary'} outline-none transition-all duration-300 text-sm bg-white`}
          />
          {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>}
        </div>

        {/* CPF */}
        <div className="animate-fade-in-up" style={{ animationDelay: '300ms', opacity: 0 }}>
          <label className="block text-sm font-semibold text-secondary mb-1.5">
            CPF
          </label>
          <input
            type="text"
            value={cpf}
            onChange={(e) => handleCpfChange(e.target.value)}
            placeholder="000.000.000-00"
            className={`w-full px-4 py-3 rounded-xl border-2 ${errors.cpf ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-primary'} outline-none transition-all duration-300 text-sm bg-white`}
          />
          {errors.cpf && <p className="text-red-500 text-xs mt-1">{errors.cpf}</p>}
        </div>

        {/* Data de Nascimento */}
        <div className="animate-fade-in-up" style={{ animationDelay: '400ms', opacity: 0 }}>
          <label className="block text-sm font-semibold text-secondary mb-1.5">
            Data de Nascimento
          </label>
          <input
            type="text"
            value={nascimento}
            onChange={(e) => setNascimento(maskDate(e.target.value))}
            placeholder="DD/MM/AAAA"
            className={`w-full px-4 py-3 rounded-xl border-2 ${errors.nascimento ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-primary'} outline-none transition-all duration-300 text-sm bg-white`}
          />
          {errors.nascimento && <p className="text-red-500 text-xs mt-1">{errors.nascimento}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary to-yellow-400 text-secondary font-extrabold py-4 rounded-2xl text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer animate-fade-in-up mt-6"
          style={{ animationDelay: '500ms', opacity: 0 }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processando...
            </span>
          ) : (
            '🎓 Calcular meu Desconto'
          )}
        </button>

        <p className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Seus dados estão protegidos e seguros
        </p>
      </form>
    </div>
  );
}
