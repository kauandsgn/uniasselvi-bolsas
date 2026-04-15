interface StepRendaProps {
  onSelect: (renda: string) => void;
}

const objetivos = [
  {
    valor: 'Crescer na carreira atual',
    icon: '📈',
    desc: 'Quero uma promoção ou melhor posição',
  },
  {
    valor: 'Mudar de profissão',
    icon: '🔄',
    desc: 'Busco uma nova área de atuação',
  },
  {
    valor: 'Conquistar o primeiro emprego',
    icon: '🚀',
    desc: 'Quero entrar no mercado de trabalho',
  },
  {
    valor: 'Empreender no meu negócio',
    icon: '💡',
    desc: 'Quero abrir ou melhorar meu negócio',
  },
  {
    valor: 'Realização pessoal',
    icon: '🎯',
    desc: 'É um sonho que quero realizar',
  },
];

export default function StepRenda({ onSelect }: StepRendaProps) {
  return (
    <div className="animate-fade-in-up">
      <div className="text-center mb-8">
        <span className="inline-block bg-primary/10 text-secondary text-xs font-bold px-3 py-1 rounded-full mb-3">
          PASSO 3 DE 4
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-secondary">
          O que você busca como <span className="text-primary">profissional</span>?
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          Nos ajude a entender seu momento profissional
        </p>
      </div>

      <div className="space-y-3 max-w-lg mx-auto">
        {objetivos.map((obj, i) => (
          <button
            key={obj.valor}
            onClick={() => onSelect(obj.valor)}
            className="group w-full bg-white border-2 border-gray-100 rounded-2xl p-4 flex items-center gap-3 transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer animate-fade-in-up"
            style={{ animationDelay: `${i * 80}ms`, opacity: 0 }}
          >
            <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{obj.icon}</span>
            <div className="text-left">
              <p className="font-bold text-secondary text-sm">{obj.valor}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{obj.desc}</p>
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
