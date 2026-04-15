export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-gray-400 text-center py-8 px-4 mt-auto">
      <div className="max-w-4xl mx-auto space-y-4">
        <p className="text-sm font-medium text-gray-300">
          TM Assessoria Educacional LTDA
        </p>
        <p className="text-xs">
          CNPJ: 22.450.147/0001-16
        </p>
        <div className="w-12 h-px bg-gray-700 mx-auto" />

        {/* Endereço Polo Centro */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Polo Centro — Av. Getúlio Vargas, 799 — Feira de Santana/BA</span>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>(75) 3025-6656</span>
        </div>

        <div className="w-12 h-px bg-gray-700 mx-auto" />



        {/* Certificado SSL */}
        <div className="inline-flex items-center gap-2 bg-green-900/30 border border-green-800/40 rounded-full px-4 py-2 text-xs text-green-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Certificado de Segurança SSL Ativo</span>
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </div>

        <div className="flex items-center justify-center gap-4">
          <a 
            href="#" 
            className="text-xs text-primary hover:text-primary-dark transition-colors underline underline-offset-2"
          >
            Política de Privacidade
          </a>
        </div>

        <p className="text-[11px] text-gray-600">
          © {new Date().getFullYear()} — Todos os direitos reservados
        </p>
      </div>
    </footer>
  );
}
