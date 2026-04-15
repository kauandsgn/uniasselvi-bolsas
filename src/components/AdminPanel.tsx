import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Lead {
  id: string;
  nome: string;
  whatsapp: string;
  cpf: string;
  nascimento: string;
  curso: string;
  tempo_estudo: string;
  renda: string;
  finalizado: boolean;
  created_at: string;
}

export default function AdminPanel() {
  const [loginUsuario, setLoginUsuario] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [lembrar, setLembrar] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Lead>>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (loginUsuario.trim().toLowerCase() !== 'comercial') {
      setError('Usuário não encontrado ou incorreto.');
      setLoading(false);
      return;
    }

    const { data, error: rpcError } = await supabase.rpc('get_admin_leads', {
      p_senha: senha,
    });

    setLoading(false);

    if (rpcError) {
      console.error(rpcError);
      setError('Senha incorreta ou erro de acesso.');
      return;
    }

    if (lembrar) {
      localStorage.setItem('uniasselvi_admin_token', JSON.stringify({ u: loginUsuario, p: senha }));
    }

    setLeads(data);
    setIsAuthenticated(true);
  };

  // Auto-login se lembrou a senha
  useEffect(() => {
    const token = localStorage.getItem('uniasselvi_admin_token');
    if (token) {
      try {
        const { u, p } = JSON.parse(token);
        if (u && p) {
          setLoginUsuario(u);
          setSenha(p);
          setLembrar(true);
        }
      } catch (e) {}
    }
  }, []);

  const reloadData = async () => {
    setLoading(true);
    const { data } = await supabase.rpc('get_admin_leads', { p_senha: senha });
    if (data) setLeads(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir permanentemente este lead?')) return;
    
    setLoading(true);
    const { error } = await supabase.rpc('delete_admin_lead', { p_senha: senha, p_id: id });
    if (!error) {
      setLeads(prev => prev.filter(l => l.id !== id));
    } else {
      alert('Erro ao excluir: ' + error.message);
    }
    setLoading(false);
  };

  const startEdit = (lead: Lead) => {
    setEditingId(lead.id);
    setEditForm(lead);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    setLoading(true);
    
    const { error } = await supabase.rpc('update_admin_lead', {
      p_senha: senha,
      p_id: editingId,
      p_nome: editForm.nome || '',
      p_whatsapp: editForm.whatsapp || '',
      p_cpf: editForm.cpf || '',
      p_curso: editForm.curso || '',
      p_nascimento: editForm.nascimento || '',
      p_finalizado: editForm.finalizado || false
    });

    if (!error) {
      setLeads(prev => prev.map(l => l.id === editingId ? { ...l, ...editForm } as Lead : l));
      setEditingId(null);
      setEditForm({});
    } else {
      alert('Erro ao salvar: ' + error.message);
    }
    
    setLoading(false);
  };

  const handleExportCSV = useCallback(() => {
    const header = [
      'Data Cadastro',
      'Nome',
      'WhatsApp',
      'CPF',
      'Data de Nascimento',
      'Curso Desejado',
      'Tempo de Estudo',
      'Renda',
      'Status'
    ];

    const rows = leads.map(l => {
      const dt = new Date(l.created_at);
      return [
        dt.toLocaleString('pt-BR'),
        `"${l.nome || ''}"`,
        `"${l.whatsapp || ''}"`,
        `"${l.cpf || ''}"`,
        `"${l.nascimento || ''}"`,
        `"${l.curso || ''}"`,
        `"${l.tempo_estudo || ''}"`,
        `"${l.renda || ''}"`,
        l.finalizado ? 'Concluído' : 'Abandonou/Fantasma'
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + header.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Leads_Uniasselvi_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [leads]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center animate-fade-in-up">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-secondary mb-2">Acesso Restrito</h2>
          <p className="text-sm text-gray-500 mb-6">Painel exclusivo para equipe do pólo.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Login de Acesso"
                value={loginUsuario}
                onChange={(e) => setLoginUsuario(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary outline-none transition-colors font-bold text-center"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Senha administrativa"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary outline-none transition-colors font-bold tracking-widest text-center"
              />
            </div>
            
            <div className="flex items-center justify-center gap-2 mt-2">
              <input 
                type="checkbox" 
                id="lembrar" 
                checked={lembrar} 
                onChange={(e) => setLembrar(e.target.checked)} 
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2 cursor-pointer"
              />
              <label htmlFor="lembrar" className="text-sm text-gray-500 cursor-pointer select-none">
                Salvar meu acesso (Lembrar login)
              </label>
            </div>

            {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}
            
            <button
              type="submit"
              disabled={loading || !senha || !loginUsuario}
              className="w-full bg-primary text-secondary font-extrabold py-3 rounded-xl hover:bg-yellow-500 transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Verificando...' : 'Fazer Login e Salvar'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const concluidos = leads.filter(l => l.finalizado).length;
  const fantasmas = leads.length - concluidos;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Dashboard */}
        <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border border-gray-100">
          <div>
            <h1 className="text-3xl font-black text-secondary">Painel de Captação</h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Conectado ao Supabase em Tempo Real
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={reloadData}
              className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm"
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Atualizar
            </button>
            <button
              onClick={handleExportCSV}
              className="px-5 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20 flex items-center gap-2 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Baixar Excel
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-gray-500 font-semibold mb-1 text-sm uppercase tracking-wider">Total de Leads</h3>
            <p className="text-4xl font-black text-secondary">{leads.length}</p>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-green-600 font-semibold mb-1 text-sm uppercase tracking-wider">Concluídos (Chegaram ao fim)</h3>
            <p className="text-4xl font-black text-green-700">{concluidos}</p>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-orange-500 font-semibold mb-1 text-sm uppercase tracking-wider">Fantasmas (Abandonaram meio)</h3>
            <p className="text-4xl font-black text-orange-600">{fantasmas}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4 min-w-[200px]">Lead</th>
                  <th className="px-6 py-4">WhatsApp</th>
                  <th className="px-6 py-4">Curso Escoihido</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map((lead) => {
                  const isEditing = editingId === lead.id;
                  
                  return (
                    <tr key={lead.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="px-6 py-4">
                        {new Date(lead.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <div className="space-y-2">
                            <input type="text" className="w-full border rounded px-2 py-1 text-xs" value={editForm.nome || ''} onChange={e => setEditForm({...editForm, nome: e.target.value})} placeholder="Nome" />
                            <input type="text" className="w-full border rounded px-2 py-1 text-xs" value={editForm.cpf || ''} onChange={e => setEditForm({...editForm, cpf: e.target.value})} placeholder="CPF" />
                          </div>
                        ) : (
                          <>
                            <p className="font-bold text-secondary">{lead.nome || <span className="text-gray-300 italic">Lendo...</span>}</p>
                            <p className="text-xs text-gray-400 mt-0.5">CPF: {lead.cpf || '---'}</p>
                          </>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <input type="text" className="w-full border rounded px-2 py-1 text-xs" value={editForm.whatsapp || ''} onChange={e => setEditForm({...editForm, whatsapp: e.target.value})} />
                        ) : (
                          lead.whatsapp ? (
                             <a href={`https://wa.me/55${lead.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-green-600 font-bold hover:underline">
                               {lead.whatsapp}
                             </a>
                          ) : <span className="text-gray-300">---</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-700">
                        {isEditing ? (
                          <input type="text" className="w-full border rounded px-2 py-1 text-xs" value={editForm.curso || ''} onChange={e => setEditForm({...editForm, curso: e.target.value})} />
                        ) : (
                          lead.curso || <span className="text-gray-300">---</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <select className="border rounded px-2 py-1 text-xs" value={editForm.finalizado ? 'true' : 'false'} onChange={e => setEditForm({...editForm, finalizado: e.target.value === 'true'})}>
                            <option value="true">Concluído</option>
                            <option value="false">Fantasma</option>
                          </select>
                        ) : (
                          lead.finalizado ? (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Concluído</span>
                          ) : (
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">Fantasma</span>
                          )
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={handleSaveEdit} className="p-1.5 bg-green-100 text-green-600 hover:bg-green-200 rounded">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                            </button>
                            <button onClick={cancelEdit} className="p-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => startEdit(lead)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors" title="Editar">
                               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                            </button>
                            <button onClick={() => handleDelete(lead.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors" title="Excluir">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      Nenhum lead captado ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
