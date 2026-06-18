import React, { useState } from 'react';
import axios from 'axios';

interface Props { projet: string; ingenieur: string; norme: string; beton: string; acier: string; enrobage: string; API: string; }

export default function PoutreSimple({ projet, ingenieur, norme, beton, acier, enrobage, API }: Props) {
  const [b, setB] = useState(250); const [h, setH] = useState(500);
  const [L, setL] = useState(6.0); const [g, setG] = useState(15.0); const [q, setQ] = useState(10.0);
  const [res, setRes] = useState<any>(null); const [loading, setLoading] = useState(false);
  const [aiComment, setAiComment] = useState(''); const [aiLoading, setAiLoading] = useState(false);

  const calc = async () => {
    setLoading(true);
    try {
      const r = await axios.post(`${API}/calcul/poutre`, { b, h, portee: L, g_k: g, q_k: q, beton, acier, enrobage_classe: enrobage, norme });
      setRes(r.data); setAiComment('');
    } catch(e: any) { alert(e.response?.data?.detail || 'Erreur calcul'); }
    setLoading(false);
  };

  const analyseIA = async () => {
    if (!res) return;
    setAiLoading(true);
    try {
      const r = await axios.post(`${API}/ia/analyser`, {
        element: 'Poutre simple',
        donnees: { b, h, portee: L, g_k: g, q_k: q, beton, acier, norme },
        resultats: res,
      });
      setAiComment(r.data.commentaire);
    } catch(e) { setAiComment('Erreur IA'); }
    setAiLoading(false);
  };

  const mu_lim = norme === 'EC2' ? 0.372 : 0.186;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Poutre rectangulaire — Flexion simple</div>
        <div className="page-sub">{norme} · {beton} · {acier} · Enrobage {enrobage}</div>
      </div>
      <div className="page-body">
        {res && (
          <div className="metrics-row">
            <div className="metric-card"><div className="metric-label">MEd</div><div className="metric-value">{res.MEd}</div><div className="metric-unit">kN.m</div></div>
            <div className="metric-card"><div className="metric-label">μ</div><div className={`metric-value ${res.mu <= mu_lim ? 'ok' : 'err'}`}>{res.mu}</div><span className={`metric-badge ${res.mu <= mu_lim ? 'mb-ok' : 'mb-err'}`}>{res.mu <= mu_lim ? `≤ ${mu_lim} ✓` : `> ${mu_lim} ✗`}</span></div>
            <div className="metric-card"><div className="metric-label">As retenu</div><div className="metric-value">{res.As_retenu}</div><div className="metric-unit">mm²</div><span className="metric-badge mb-ok">{res.choix_armatures}</span></div>
            <div className="metric-card"><div className="metric-label">Cisaillement</div><div className={`metric-value ${res.armatures_cisaillement ? 'warn' : 'ok'}`}>{res.VEd} kN</div><span className={`metric-badge ${res.armatures_cisaillement ? 'mb-warn' : 'mb-ok'}`}>{res.armatures_cisaillement ? '⚠ Cadres' : '✓ OK'}</span></div>
          </div>
        )}

        <div className="grid-2" style={{marginBottom:14}}>
          <div className="card">
            <div className="card-title">Géométrie</div>
            <div className="field"><label>Largeur b (mm)</label><div className="field-row"><input type="number" value={b} onChange={e=>setB(+e.target.value)} /><span className="field-unit">mm</span></div></div>
            <div className="field"><label>Hauteur h (mm)</label><div className="field-row"><input type="number" value={h} onChange={e=>setH(+e.target.value)} /><span className="field-unit">mm</span></div></div>
            <div className="field"><label>Portée L (m)</label><div className="field-row"><input type="number" value={L} step="0.25" onChange={e=>setL(+e.target.value)} /><span className="field-unit">m</span></div></div>
          </div>
          <div className="card">
            <div className="card-title">Chargement</div>
            <div className="field"><label>Charge permanente Gk (kN/m)</label><div className="field-row"><input type="number" value={g} step="0.5" onChange={e=>setG(+e.target.value)} /><span className="field-unit">kN/m</span></div></div>
            <div className="field"><label>Charge variable Qk (kN/m)</label><div className="field-row"><input type="number" value={q} step="0.5" onChange={e=>setQ(+e.target.value)} /><span className="field-unit">kN/m</span></div></div>
            <div className="field"><label>MEd = 1.35G + 1.5Q (estimé)</label><div className="field-row"><input readOnly value={((1.35*g + 1.5*q)*L*L/8).toFixed(1)} /><span className="field-unit">kN.m</span></div></div>
          </div>
        </div>

        <button className="btn-primary" onClick={calc} disabled={loading}>
          {loading ? <><div className="spinner"/>&nbsp;Calcul en cours...</> : '▶  Calculer la poutre'}
        </button>
        {res && <button className="btn-ai" onClick={analyseIA} disabled={aiLoading}>{aiLoading ? '🤖 Analyse...' : '🤖 Analyser avec l\'IA'}</button>}

        {res && (
          <div className="grid-2" style={{marginTop:14}}>
            <div className="card">
              <div className="card-title">Flexion</div>
              <table className="result-table">
                <tbody>
                  <tr><td>Hauteur utile d</td><td>{res.d} mm</td></tr>
                  <tr><td>Moment réduit μ</td><td className={res.mu <= mu_lim ? 'ok' : 'err'}>{res.mu}</td></tr>
                  <tr><td>Pivot</td><td>{res.pivot}</td></tr>
                  <tr><td>α (x/d)</td><td>{res.alpha}</td></tr>
                  <tr><td>As calculé</td><td>{res.As_calc} mm²</td></tr>
                  <tr><td>As minimum</td><td>{res.As_min} mm²</td></tr>
                  <tr className="highlight"><td>As retenu</td><td>{res.As_retenu} mm²</td></tr>
                  <tr className="highlight"><td>Choix</td><td>{res.choix_armatures}</td></tr>
                </tbody>
              </table>
            </div>
            <div className="card">
              <div className="card-title">Vérifications</div>
              <div className="verif-panel">
                <div className="verif-item"><div className={`verif-dot ${res.mu <= mu_lim ? 'vd-ok' : 'vd-err'}`}/><span className="verif-name">Section simplement armée (μ ≤ {mu_lim})</span><span className="verif-val">μ = {res.mu}</span></div>
                <div className="verif-item"><div className={`verif-dot ${res.As_calc >= res.As_min ? 'vd-ok' : 'vd-err'}`}/><span className="verif-name">Armature minimale</span><span className="verif-val">{res.As_calc} ≥ {res.As_min} mm²</span></div>
                <div className="verif-item"><div className={`verif-dot ${!res.armatures_cisaillement ? 'vd-ok' : 'vd-warn'}`}/><span className="verif-name">Cisaillement béton seul</span><span className="verif-val">VEd={res.VEd} kN</span></div>
              </div>
              {res.messages?.map((m: string, i: number) => (
                <div key={i} className={`msg ${m.includes('⚠') ? 'msg-warn' : m.includes('ERREUR') ? 'msg-err' : 'msg-info'}`}>{m}</div>
              ))}
            </div>
          </div>
        )}

        {aiComment && (
          <div className="card" style={{marginTop:14, borderColor:'rgba(163,113,247,0.3)'}}>
            <div className="card-title" style={{color:'var(--color-purple)'}}>🤖 Analyse IA</div>
            <p style={{fontSize:13, lineHeight:1.7, color:'var(--color-text2)', whiteSpace:'pre-wrap'}}>{aiComment}</p>
          </div>
        )}
      </div>
    </div>
  );
}
