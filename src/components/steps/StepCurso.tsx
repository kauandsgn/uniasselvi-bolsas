import { useState, useRef, useEffect } from 'react';

interface StepCursoProps {
  onSelect: (curso: string) => void;
}

const cursos = [
  // GRADUAÇÃO EAD
  'Administração',
  'Administração Pública',
  'Análise e Desenvolvimento de Sistemas',
  'Antropologia',
  'Arquivologia',
  'Bacharelado em Letras - Libras',
  'Banco de Dados',
  'Biblioteconomia',
  'Ciência da Criatividade',
  'Ciência Política',
  'Ciências Contábeis',
  'Ciências Econômicas',
  'Comércio Exterior',
  'Comunicação Institucional',
  'Criminologia',
  'Design de Animação',
  'Design de Interiores',
  'Design de Moda',
  'Design de Produto',
  'Design Gráfico',
  'Designer Digital e User Experience',
  'Despachante Documentalista',
  'Escrita Criativa',
  'Fotografia',
  'Gastronomia',
  'Gestão Comercial',
  'Gestão da Inovação',
  'Gestão da Produção Industrial',
  'Gestão da Qualidade',
  'Gestão da Tecnologia da Informação',
  'Gestão de Cooperativas',
  'Gestão de Farmácia',
  'Gestão de Investimentos e Mercado Financeiro',
  'Gestão de Negócios',
  'Gestão de Recursos Humanos',
  'Gestão de Saúde Pública',
  'Gestão de Segurança Privada',
  'Gestão de Serviços Jurídicos',
  'Gestão de Turismo',
  'Gestão do Agronegócio',
  'Gestão e Empreendedorismo',
  'Gestão Financeira',
  'Gestão Portuária',
  'Gestão Pública',
  'Hotelaria',
  'Inteligência Artificial e Machine Learning',
  'Investigação Forense e Perícia Criminal',
  'Jogos Digitais',
  'Jornalismo Digital',
  'Logística',
  'Marketing',
  'Marketing Digital',
  'Museologia',
  'Processos Gerenciais',
  'Produção Cultural',
  'Psicomotricidade',
  'Publicidade e Propaganda',
  'Redes de Computadores',
  'Relações Internacionais',
  'Relações Públicas',
  'Secretariado',
  'Segurança da Informação',
  'Segurança Pública',
  'Serviços Penais',
  'Sistemas de Informação',
  'Sistemas para Internet',
  'Tecnologia em Gestão de Eventos',
  'Tecnologia em Gestão de Negócios Imobiliários',
  'Tecnologia em Gestão de Serviços Judiciais e Notariais',
  'Tecnologia em Mídias Sociais Digitais',
  'Tecnologia em Segurança Cibernética',
  'Tecnologia em Segurança do Trabalho',
  'Teologia',
  'Tradução',
  // GRADUAÇÃO SEMIPRESENCIAL (exceto grifados em amarelo)
  'Acompanhamento de Transtorno do Espectro Autista',
  'Agronomia',
  'Agrotecnologia',
  'Bacharelado em Educação Física',
  'Biomedicina',
  'Construção de Edifícios',
  'Controle de Obras',
  'Energias Renováveis',
  'Farmácia',
  'Fisioterapia',
  'Formação Pedagógica em Artes Visuais',
  'Formação Pedagógica em Ciências Biológicas',
  'Formação Pedagógica em Educação Física',
  'Formação Pedagógica em Filosofia',
  'Formação Pedagógica em Física',
  'Formação Pedagógica em Geografia',
  'Formação Pedagógica em História',
  'Formação Pedagógica em Informática',
  'Formação Pedagógica em Letras - Espanhol',
  'Formação Pedagógica em Letras - Inglês',
  'Formação Pedagógica em Letras - Libras',
  'Formação Pedagógica em Letras - Português',
  'Formação Pedagógica em Matemática',
  'Formação Pedagógica em Química',
  'Formação Pedagógica em Sociologia',
  'Geoprocessamento',
  'Gerontologia',
  'Gestão Ambiental',
  'Gestão Hospitalar',
  'Instrumentação Cirúrgica',
  'Licenciatura em Artes Visuais',
  'Licenciatura em Ciências Biológicas',
  'Licenciatura em Ciências da Religião',
  'Licenciatura em Dança',
  'Licenciatura em Educação Especial',
  'Licenciatura em Educação Física',
  'Licenciatura em Filosofia',
  'Licenciatura em Física',
  'Licenciatura em Geografia',
  'Licenciatura em História',
  'Licenciatura em Informática',
  'Licenciatura em Letras - Espanhol',
  'Licenciatura em Letras - Inglês',
  'Licenciatura em Letras - Libras',
  'Licenciatura em Letras - Português',
  'Licenciatura em Matemática',
  'Licenciatura em Música',
  'Licenciatura em Pedagogia',
  'Licenciatura em Psicopedagogia',
  'Licenciatura em Química',
  'Licenciatura em Sociologia',
  'Licenciatura em Teatro',
  'Nutrição',
  'Pedagogia para Licenciados',
  'Podologia',
  'Radiologia',
  'Saneamento Ambiental',
  'Segunda Licenciatura em Artes Visuais',
  'Segunda Licenciatura em Ciências Biológicas',
  'Segunda Licenciatura em Educação Especial',
  'Segunda Licenciatura em Filosofia',
  'Segunda Licenciatura em Física',
  'Segunda Licenciatura em Geografia',
  'Segunda Licenciatura em História',
  'Segunda Licenciatura em Informática',
  'Segunda Licenciatura em Letras - Espanhol',
  'Segunda Licenciatura em Letras - Inglês',
  'Segunda Licenciatura em Letras - Libras',
  'Segunda Licenciatura em Letras - Português',
  'Segunda Licenciatura em Matemática',
  'Segunda Licenciatura em Química',
  'Segunda Licenciatura em Sociologia',
  'Serviço Social',
  'Tecnologia em Estética e Cosmética',
  'Terapia Ocupacional',
  'Terapias Integrativas e Complementares',
];

export default function StepCurso({ onSelect }: StepCursoProps) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = search.length > 0
    ? cursos.filter(c => c.toLowerCase().includes(search.toLowerCase()))
    : cursos;

  useEffect(() => {
    setHighlighted(-1);
  }, [search]);

  useEffect(() => {
    if (highlighted >= 0 && listRef.current) {
      const item = listRef.current.children[highlighted] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlighted]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setHighlighted(prev => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && highlighted >= 0) {
      e.preventDefault();
      onSelect(filtered[highlighted]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlighted(-1);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="text-center mb-8">
        <span className="inline-block bg-primary/10 text-secondary text-xs font-bold px-3 py-1 rounded-full mb-3">
          PASSO 1 DE 4
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-secondary">
          Qual curso você <span className="text-primary">se identifica</span>?
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          Pesquise entre mais de 150 cursos disponíveis
        </p>
      </div>

      <div className="max-w-lg mx-auto relative">
        {/* Search Input */}
        <div className="relative animate-fade-in-up" style={{ animationDelay: '100ms', opacity: 0 }}>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setIsOpen(true); }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Digite o nome do curso..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-primary outline-none transition-all duration-300 text-sm bg-white shadow-sm focus:shadow-md focus:shadow-primary/10"
            autoComplete="off"
          />
          {search && (
            <button
              onClick={() => { setSearch(''); inputRef.current?.focus(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Counter badge */}
        <div className="flex items-center justify-between mt-2 px-1">
          <p className="text-[11px] text-gray-400">
            {filtered.length} curso{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
          </p>
          <p className="text-[11px] text-gray-400">
            Use ↑↓ para navegar, Enter para selecionar
          </p>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <ul
            ref={listRef}
            className="mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl max-h-72 overflow-y-auto animate-fade-in-up"
            style={{ animationDuration: '0.2s' }}
          >
            {filtered.length === 0 ? (
              <li className="px-4 py-6 text-center text-gray-400 text-sm">
                <span className="text-2xl block mb-2">🔍</span>
                Nenhum curso encontrado
              </li>
            ) : (
              filtered.map((curso, i) => (
                <li key={curso}>
                  <button
                    onClick={() => onSelect(curso)}
                    onMouseEnter={() => setHighlighted(i)}
                    className={`w-full text-left px-4 py-3 text-sm transition-all duration-150 flex items-center gap-3 cursor-pointer ${
                      i === highlighted
                        ? 'bg-primary/10 text-secondary'
                        : 'text-gray-700 hover:bg-gray-50'
                    } ${i === 0 ? 'rounded-t-2xl' : ''} ${i === filtered.length - 1 ? 'rounded-b-2xl' : ''}`}
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-200 ${
                      i === highlighted
                        ? 'bg-primary text-secondary shadow-sm'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {curso.charAt(0)}
                    </span>
                    <span className="font-medium">{curso}</span>
                    {i === highlighted && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary ml-auto shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                </li>
              ))
            )}
          </ul>
        )}

        {/* Popular courses quick-pick */}
        <div className="mt-6 animate-fade-in-up" style={{ animationDelay: '200ms', opacity: 0 }}>
          <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Mais buscados</p>
          <div className="flex flex-wrap gap-2">
            {['Pedagogia', 'Administração', 'Educação Física'].map(curso => (
                <button
                  key={curso}
                  onClick={() => onSelect(curso)}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:border-primary hover:text-secondary hover:bg-primary/5 transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  {curso}
                </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
