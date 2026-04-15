interface CpfBlockedProps {
  onReset: () => void;
  curso?: string;
  desconto?: string;
}

export default function CpfBlocked({ onReset, curso, desconto }: CpfBlockedProps) {
  const whatsappMessage = encodeURIComponent('#OFF70%');
  const whatsappLink = `https://wa.me/557530256656?text=${whatsappMessage}`;

  return (
    <div className="animate-fade-in-up max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-4 animate-checkmark">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-secondary">
          Você já garantiu o desconto! 🎉
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          Seu benefício exclusivo já está reservado.
        </p>
      </div>

      <div className="bg-secondary rounded-3xl p-6 text-white shadow-2xl shadow-secondary/30 mb-6 animate-fade-in-up text-center">
        <p className="text-sm text-primary font-semibold uppercase tracking-wider mb-3">Tudo certo por aqui</p>
        
        {curso && desconto && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4 mt-2">
             <div className="flex items-center justify-center gap-1 mb-2">
              <span className="text-5xl font-black text-primary">{desconto}%</span>
              <span className="text-lg font-bold text-primary/80 self-end mb-2">OFF</span>
            </div>
            <p className="text-xs text-primary uppercase tracking-wider mb-1">Bolsa vinculada ao curso</p>
            <p className="font-bold text-lg">{curso}</p>
          </div>
        )}

        <p className="text-gray-200 mt-2 text-sm">
          Você já possui uma oferta ativa e vinculada a este CPF. Clique no botão abaixo para ir direto para o nosso WhatsApp e concluir sua matrícula agora mesmo!
        </p>
      </div>

      {/* CTA WhatsApp */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-[#25D366] text-white font-extrabold py-5 rounded-2xl text-lg text-center shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 hover:-translate-y-1 transition-all duration-300 active:scale-[0.98] animate-fade-in-up"
      >
        <span className="flex items-center justify-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Garantir minha bolsa agora
        </span>
      </a>

      <button
        onClick={onReset}
        className="block w-full mt-6 text-sm text-gray-500 underline underline-offset-4 hover:text-primary transition-colors cursor-pointer text-center"
      >
        Deseja fazer uma nova simulação?
      </button>
    </div>
  );
}
