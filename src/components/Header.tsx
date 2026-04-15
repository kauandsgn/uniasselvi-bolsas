export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <img src="/logo.png" alt="Uniasselvi Logo" className="h-10 sm:h-12 object-contain" />
        </div>

        {/* Badge Live */}
        <div className="flex items-center bg-green-50 rounded-full px-3 py-1.5 text-xs font-bold text-green-600 border border-green-200">
          <span className="relative flex h-2.5 w-2.5 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
          </span>
          <span className="hidden sm:inline">Bolsas Disponíveis</span>
          <span className="sm:hidden">Live</span>
        </div>
      </div>
    </header>
  );
}
