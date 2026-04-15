import { useState, useEffect } from 'react';

interface ProcessingLoaderProps {
  curso: string;
  onComplete: () => void;
}

const messages = [
  { text: 'Analisando disponibilidade para', highlight: true },
  { text: 'Verificando convênios regionais...', highlight: false },
  { text: 'Calculando melhor oferta...', highlight: false },
  { text: 'Preparando resultado...', highlight: false },
];

export default function ProcessingLoader({ curso, onComplete }: ProcessingLoaderProps) {
  const [currentMsg, setCurrentMsg] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMsg((prev) => {
        if (prev < messages.length - 1) return prev + 1;
        return prev;
      });
    }, 800);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 2;
      });
    }, 60);

    const timeout = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <div className="animate-fade-in-up flex flex-col items-center justify-center py-16">
      {/* Spinner */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full border-4 border-gray-200" />
        <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-transparent border-t-primary animate-spin-slow" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl animate-bounce-soft">🎓</span>
        </div>
      </div>

      {/* Mensagem */}
      <div className="text-center mb-6 h-12">
        <p className="text-lg font-bold text-secondary animate-fade-in-up" key={currentMsg}>
          {messages[currentMsg].highlight
            ? `${messages[currentMsg].text} ${curso}...`
            : messages[currentMsg].text}
        </p>
      </div>

      {/* Barra de progresso */}
      <div className="w-64 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-2">{Math.min(progress, 100)}%</p>
    </div>
  );
}
