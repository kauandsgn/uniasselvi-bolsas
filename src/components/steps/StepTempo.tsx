interface StepTempoProps {
  onSelect: (tempo: string) => void;
}

const opcoes = [
  {
    valor: 'Menos de 2h',
    icon: '⏰',
    titulo: 'Menos de 2 horas',
    desc: 'Tenho uma rotina bem corrida',
    cor: 'border-secondary/20 bg-secondary/5 text-secondary',
  },
  {
    valor: '2h a 4h',
    icon: '📖',
    titulo: '2 a 4 horas',
    desc: 'Consigo organizar meu tempo',
    cor: 'border-secondary/20 bg-secondary/5 text-secondary',
  },
  {
    valor: 'Mais de 4h',
    icon: '🚀',
    titulo: 'Mais de 4 horas',
    desc: 'Tenho bastante disponibilidade',
    cor: 'border-secondary/20 bg-secondary/5 text-secondary',
  },
];

export default function StepTempo({ onSelect }: StepTempoProps) {
  return (
    <div className="animate-fade-in-up">
      <div className="text-center mb-8">
        <span className="inline-block bg-primary/10 text-secondary text-xs font-bold px-3 py-1 rounded-full mb-3">
          PASSO 2 DE 4
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-secondary">
          Quanto tempo você tem para <span className="text-primary">estudar</span>?
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          Isso nos ajuda a encontrar o formato ideal para você
        </p>
      </div>

      <div className="space-y-3 max-w-lg mx-auto">
        {opcoes.map((opcao, i) => (
          <button
            key={opcao.valor}
            onClick={() => onSelect(opcao.valor)}
            className="group w-full bg-white border-2 border-gray-100 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer animate-fade-in-up"
            style={{ animationDelay: `${i * 100}ms`, opacity: 0 }}
          >
            <div className={`w-14 h-14 rounded-xl border ${opcao.cor} flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 group-hover:bg-primary group-hover:border-primary transition-all duration-300 shrink-0`}>
              {opcao.icon}
            </div>
            <div className="text-left">
              <p className="font-bold text-secondary text-base">{opcao.titulo}</p>
              <p className="text-xs text-gray-400 mt-0.5">{opcao.desc}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-300 group-hover:text-primary ml-auto transition-all duration-300 group-hover:translate-x-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
