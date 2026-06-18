import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

interface Props { projet: string; ingenieur: string; norme: string; beton: string; acier: string; enrobage: string; API: string; }
interface Msg { role: 'user'|'assistant'; content: string; }

export default function AssistantIA({ norme, beton, acier, API }: Props) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const newMsgs = [...msgs, { role: 'user' as const, content: input }];
    setMsgs(newMsgs); setInput(''); setLoading(true);
    try {
      const r = await axios.post(`${API}/ia/chat`, { messages: newMsgs, norme, beton, acier });
      setMsgs([...newMsgs, { role: 'assistant', content: r.data.response }]);
    } catch { setMsgs([...newMsgs, { role: 'assistant', content: 'Erreur — vérifiez votre clé API.' }]); }
    setLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">🤖 Assistant IA — Ingénieur Structural</div>
        <div className="page-sub">Claude · {norme} · {beton} · {acier}</div>
      </div>
      <div className="chat-container">
        <div className="chat-messages">
          {msgs.length === 0 && (
            <div style={{color:'var(--color-text3)', fontSize:13, textAlign:'center', marginTop:40}}>
              <div style={{fontSize:32, marginBottom:12}}>🤖</div>
              <div>Posez une question technique en béton armé</div>
              <div style={{marginTop:8, fontSize:12}}>Ex: Quelle section pour une poutre de 8m avec 30 kN/m ?</div>
            </div>
          )}
          {msgs.map((m, i) => (
            <div key={i} className={`chat-msg ${m.role}`} style={{whiteSpace:'pre-wrap'}}>{m.content}</div>
          ))}
          {loading && <div className="loading"><div className="spinner"/>StructAI réfléchit...</div>}
          <div ref={endRef}/>
        </div>
        <div className="chat-input-row">
          <input
            className="chat-input" value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Posez votre question..."
          />
          <button className="chat-send" onClick={send} disabled={loading}>Envoyer</button>
          <button className="btn-secondary" onClick={() => setMsgs([])}>Effacer</button>
        </div>
      </div>
    </div>
  );
}
