import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import PoutreSimple from './components/PoutreSimple';
import Poteau from './components/Poteau';
import Semelle from './components/Semelle';
import Radier from './components/Radier';
import DallePleine from './components/DallePleine';
import PoutreContinue from './components/PoutreContinue';
import AssistantIA from './components/AssistantIA';
import LecturePlans from './components/LecturePlans';

const API = 'http://127.0.0.1:8000';

const NAV = [
  {
    section: 'Fondations', icon: 'layers-subtract', items: [
      { id: 'semelle',  label: 'Semelle filante',  icon: 'border-bottom', badge: '' },
      { id: 'radier',   label: 'Radier général',   icon: 'grid-dots',     badge: 'NEW' },
    ]
  },
  {
    section: 'Structure verticale', icon: 'square', items: [
      { id: 'poteau',   label: 'Poteau BA',        icon: 'square',        badge: '' },
      { id: 'voile',    label: 'Voile BA',          icon: 'rectangle',     badge: 'bientôt' },
    ]
  },
  {
    section: 'Structure horizontale', icon: 'line-dashed', items: [
      { id: 'poutre',   label: 'Poutre simple',    icon: 'line-dashed',   badge: '' },
      { id: 'poutre-continue', label: 'Poutre continue', icon: 'wave-sine', badge: 'NEW' },
      { id: 'dalle',    label: 'Dalle pleine',      icon: 'layout-rows',   badge: 'NEW' },
      { id: 'dalle-champignon', label: 'Dalle champignon', icon: 'layout-distribute-vertical', badge: 'bientôt' },
    ]
  },
  {
    section: 'Éléments secondaires', icon: 'stairs', items: [
      { id: 'escalier', label: 'Escalier',          icon: 'stairs',        badge: 'bientôt' },
      { id: 'acrotere', label: 'Acrotère',           icon: 'border-top',    badge: 'bientôt' },
      { id: 'linteau',  label: 'Linteau',            icon: 'minus',         badge: 'bientôt' },
    ]
  },
  {
    section: 'IA & Outils', icon: 'robot', items: [
      { id: 'assistant-ia', label: 'Assistant IA',  icon: 'robot',         badge: 'IA' },
      { id: 'lecture-plans', label: 'Lecture plans', icon: 'file-search',  badge: 'IA' },
    ]
  },
];

export default function App() {
  const [active, setActive] = useState('poutre');
  const [projet, setProjet] = useState('Projet test');
  const [ingenieur, setIngenieur] = useState('Ing. Dupont');
  const [norme, setNorme] = useState('EC2');
  const [beton, setBeton] = useState('C25/30');
  const [acier, setAcier] = useState('B500B');
  const [enrobage, setEnrobage] = useState('XC1');
  const [materiaux, setMateriaux] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    axios.get(`${API}/materiaux`).then(r => setMateriaux(r.data)).catch(() => {});
  }, []);

  const renderMain = () => {
    const props = { projet, ingenieur, norme, beton, acier, enrobage, API };
    switch (active) {
      case 'poutre':          return <PoutreSimple {...props} />;
      case 'poteau':          return <Poteau {...props} />;
      case 'semelle':         return <Semelle {...props} />;
      case 'radier':          return <Radier {...props} />;
      case 'dalle':           return <DallePleine {...props} />;
      case 'poutre-continue': return <PoutreContinue {...props} />;
      case 'assistant-ia':    return <AssistantIA {...props} />;
      case 'lecture-plans':   return <LecturePlans {...props} />;
      default: return (
        <div className="coming-soon">
          <span className="cs-icon">🚧</span>
          <h2>Bientôt disponible</h2>
          <p>Ce module est en cours de développement.</p>
        </div>
      );
    }
  };

  return (
    <div className="app-layout">
      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="sb-logo">
          <div className="sb-logo-icon">🏗️</div>
          {sidebarOpen && (
            <div className="sb-logo-text">
              <span className="sb-name">StructAI Pro</span>
              <span className="sb-sub">EC2 · BAEL · EC8</span>
            </div>
          )}
          <button className="sb-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="sb-nav">
          {NAV.map(group => (
            <div key={group.section} className="sb-group">
              {sidebarOpen && <div className="sb-section-label">{group.section}</div>}
              {group.items.map(item => (
                <button
                  key={item.id}
                  className={`sb-item ${active === item.id ? 'active' : ''} ${item.badge === 'bientôt' ? 'disabled' : ''}`}
                  onClick={() => item.badge !== 'bientôt' && setActive(item.id)}
                  title={!sidebarOpen ? item.label : ''}
                >
                  <span className="sb-item-icon">
                    {item.id === 'poutre' ? '━' : item.id === 'poteau' ? '▪' : item.id === 'semelle' ? '▬' :
                     item.id === 'radier' ? '⊞' : item.id === 'dalle' ? '▦' : item.id === 'poutre-continue' ? '∿' :
                     item.id === 'assistant-ia' ? '🤖' : item.id === 'lecture-plans' ? '📐' :
                     item.id === 'escalier' ? '╱' : item.id === 'acrotere' ? '⌐' : '·'}
                  </span>
                  {sidebarOpen && (
                    <>
                      <span className="sb-item-label">{item.label}</span>
                      {item.badge === 'NEW' && <span className="badge-new">NEW</span>}
                      {item.badge === 'IA'  && <span className="badge-ai">IA</span>}
                      {item.badge === 'bientôt' && <span className="badge-soon">bientôt</span>}
                    </>
                  )}
                </button>
              ))}
              {sidebarOpen && <div className="sb-divider" />}
            </div>
          ))}
        </nav>

        {sidebarOpen && (
          <div className="sb-bottom">
            <div className="sb-project-card">
              <div className="sb-project-label">Projet actif</div>
              <input
                className="sb-project-input"
                value={projet}
                onChange={e => setProjet(e.target.value)}
                placeholder="Nom du projet"
              />
            </div>
            <div className="sb-settings">
              <select value={norme}   onChange={e => setNorme(e.target.value)}>
                <option>EC2</option><option>BAEL</option>
              </select>
              <select value={beton}   onChange={e => setBeton(e.target.value)}>
                {materiaux?.betons?.map((b: string) => <option key={b}>{b}</option>)}
              </select>
              <select value={acier}   onChange={e => setAcier(e.target.value)}>
                {materiaux?.aciers?.map((a: string) => <option key={a}>{a}</option>)}
              </select>
              <select value={enrobage} onChange={e => setEnrobage(e.target.value)}>
                {materiaux?.enrobages?.map((e: string) => <option key={e}>{e}</option>)}
              </select>
            </div>
          </div>
        )}
      </aside>

      {/* MAIN */}
      <main className="main-content">
        {renderMain()}
      </main>
    </div>
  );
}
