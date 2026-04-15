interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = ['Curso', 'Rotina', 'Objetivo', 'Dados'];

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = ((currentStep) / totalSteps) * 100;

  return (
    <div className="bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          {stepLabels.map((label, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                  i + 1 < currentStep
                    ? 'bg-primary text-secondary shadow-md'
                    : i + 1 === currentStep
                    ? 'bg-primary text-secondary shadow-md shadow-primary/30 scale-110'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {i + 1 < currentStep ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className={`text-xs font-medium hidden sm:inline transition-colors duration-300 ${
                i + 1 === currentStep ? 'text-secondary' : i + 1 < currentStep ? 'text-secondary opacity-75' : 'text-gray-400'
              }`}>
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
