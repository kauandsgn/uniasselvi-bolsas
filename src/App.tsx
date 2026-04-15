import { useState, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProgressBar from './components/ProgressBar';
import StepCurso from './components/steps/StepCurso';
import StepTempo from './components/steps/StepTempo';
import StepRenda from './components/steps/StepRenda';
import StepDados from './components/steps/StepDados';
import ProcessingLoader from './components/ProcessingLoader';
import ResultScreen from './components/ResultScreen';
import CpfBlocked from './components/CpfBlocked';
import AdminPanel from './components/AdminPanel';
import { useLeadGhosting } from './hooks/useLeadGhosting';
import { useConfiguracao } from './hooks/useConfiguracao';

type AppStep = 'curso' | 'tempo' | 'renda' | 'dados' | 'processing' | 'result' | 'blocked';

interface FormData {
  curso: string;
  tempo_estudo: string;
  renda: string;
  nome: string;
  whatsapp: string;
}

export default function App() {
  if (window.location.pathname === '/painel') {
    return <AdminPanel />;
  }

  const [step, setStep] = useState<AppStep>('curso');
  const [formData, setFormData] = useState<FormData>({
    curso: '',
    tempo_estudo: '',
    renda: '',
    nome: '',
    whatsapp: '',
  });
  const [loading, setLoading] = useState(false);

  const { saveStepData, debouncedSave } = useLeadGhosting();
  const { config } = useConfiguracao();

  const handleCurso = async (curso: string) => {
    setFormData(prev => ({ ...prev, curso }));
    await saveStepData({ p_curso: curso });
    setStep('tempo');
  };

  const handleTempo = async (tempo: string) => {
    setFormData(prev => ({ ...prev, tempo_estudo: tempo }));
    await saveStepData({ p_tempo_estudo: tempo });
    setStep('renda');
  };

  const handleRenda = async (renda: string) => {
    setFormData(prev => ({ ...prev, renda }));
    await saveStepData({ p_renda: renda });
    setStep('dados');
  };

  const handleGhost = useCallback((data: Record<string, unknown>, onBlocked?: (curso?: string) => void) => {
    debouncedSave(data, onBlocked);
    if (data.p_nome) setFormData(prev => ({ ...prev, nome: data.p_nome as string }));
    if (data.p_whatsapp) setFormData(prev => ({ ...prev, whatsapp: data.p_whatsapp as string }));
  }, [debouncedSave]);

  const handleDados = async (dados: { p_nome: string; p_whatsapp: string; p_cpf: string; p_nascimento: string }) => {
    setLoading(true);
    setFormData(prev => ({ ...prev, nome: dados.p_nome, whatsapp: dados.p_whatsapp }));

    const result = await saveStepData({
      ...dados,
      p_finalizado: true,
    });

    setLoading(false);

    if (result.blocked) {
      if (result.curso) {
        setFormData(prev => ({ ...prev, curso: result.curso }));
      }
      setStep('blocked');
      return;
    }

    setStep('processing');
  };

  const handleProcessingComplete = useCallback(() => {
    setStep('result');
  }, []);

  const handleReset = () => {
    localStorage.removeItem('uniasselvi_lead_id');
    window.location.reload();
  };

  const handleBack = () => {
    switch (step) {
      case 'tempo': setStep('curso'); break;
      case 'renda': setStep('tempo'); break;
      case 'dados': setStep('renda'); break;
      default: break;
    }
  };

  const currentStepNumber = () => {
    switch (step) {
      case 'curso': return 1;
      case 'tempo': return 2;
      case 'renda': return 3;
      case 'dados': return 4;
      default: return 4;
    }
  };

  const showProgress = ['curso', 'tempo', 'renda', 'dados'].includes(step);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {showProgress && (
        <ProgressBar currentStep={currentStepNumber()} totalSteps={4} />
      )}

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12">
        {['tempo', 'renda', 'dados'].includes(step) && (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-500 hover:text-secondary transition-colors font-medium text-sm mb-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Voltar
          </button>
        )}
        
        {step === 'curso' && <StepCurso onSelect={handleCurso} />}
        {step === 'tempo' && <StepTempo onSelect={handleTempo} />}
        {step === 'renda' && <StepRenda onSelect={handleRenda} />}
        {step === 'dados' && (
          <StepDados
            onSubmit={handleDados}
            onGhost={(data) => handleGhost(data, (cursoBlocked) => {
              if (cursoBlocked) {
                setFormData(prev => ({ ...prev, curso: cursoBlocked }));
              }
              setStep('blocked');
            })}
            loading={loading}
          />
        )}
        {step === 'processing' && (
          <ProcessingLoader
            curso={formData.curso}
            onComplete={handleProcessingComplete}
          />
        )}
        {step === 'result' && config && (
          <ResultScreen
            curso={formData.curso}
            nome={formData.nome}
            desconto={config.desconto_percentual}
            beneficio={config.mensagem_beneficio}
          />
        )}
        {step === 'blocked' && config && (
          <CpfBlocked
            onReset={handleReset}
            curso={formData.curso}
            desconto={config.desconto_percentual}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
