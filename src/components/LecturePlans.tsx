import React, { useState } from 'react';
import axios from 'axios';

interface Props { projet: string; ingenieur: string; norme: string; beton: string; acier: string; enrobage: string; API: string; }

export default function LecturePlans({ norme, beton, acier, API }: Props) {
  const [file, setFile] = useState<File|null>(null);
  const [mode, setMode] = useState('Extraction automatique des dimensions');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const analyse = async () => {
    if (!file) return;
    setLoading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('mode', mode);
    fd.append('norme', norme);
    fd.append('beton', beton);
    fd.append('acier', acier);
    try {
      const r = await axios.post(`${API}/ia/lecture-plan`, fd, { headers: {'Content-Type':'multipart/form-data'} });
      setResult(r.data.analyse);
    } catch { setResult('Erreur — vérifiez votre clé API.'); }
    setLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">📐 Lecture et Analyse de Plans</div>
        <div className="page-sub">Vision IA · {norme} · {beton} · {acier}</div>
      </div>
      <div className="page-body">
        <div className="card" style={{marginBottom:14}}>
          <div className="card-title">Configuration</div>
          <div className="field">
            <label>Mode d'analyse</label>
            <select value={mode} onChange={e => setMode(e.target.value)} style={{width:'100%',padding:'6px 10px',background:'var(--color-bg3)',border:'1px solid var(--color-border)',borderRadius:6,color:'var(--color-text)',fontSize:13}}>
              <option>Extraction automatique des dimensions</option>
              <option>Lecture du ferraillage</option>
              <option>Analyse complète (coffrage + ferraillage)</option>
              <option>Vérification et détection d'erreurs</option>
            </select>
          </div>
          <div className="field">
            <label>Plan à analyser (PDF, PNG, JPG)</label>
            <input type="file" accept=".pdf,.png,.jpg,.jpeg,.webp"
              onChange={e => setFile(e.target.files?.[0]||null)}
              style={{width:'100%',padding:'6px',background:'var(--color-bg3)',border:'1px solid var(--color-border)',borderRadius:6,color:'var(--color-text)',fontSize:13}}
            />
          </div>
          <button className="btn-primary" onClick={analyse} disabled={!file || loading}>
            {loading ? <><div className="spinner"/>&nbsp;Analyse en cours...</> : '🔍 Analyser le plan'}
          </button>
        </div>
        {result && (
          <div className="card">
            <div className="card-title">Résultats de l'analyse</div>
            <div style={{fontSize:13,lineHeight:1.7,color:'var(--color-text2)',whiteSpace:'pre-wrap'}}>{result}</div>
          </div>
        )}
      </div>
    </div>
  );
}
