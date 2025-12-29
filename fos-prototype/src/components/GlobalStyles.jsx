import React from 'react';

export function GlobalStyles() {
  return (
  <style>{`
    :root {
      /* "Defense" Design System Colors */
      --color-safe: #059669;       /* Emerald Green */
      --color-warning: #d97706;    /* Amber Gold */
      --color-hostile: #dc2626;    /* Burnt Crimson */
      
      --bg-legal-pad: #fdfbf7;     /* Legal Pad Off-White */
      --card-white: #ffffff;       /* Pure White */
      --border-subtle: #e5e7eb;    /* 1px gray border */
      
      --text-primary: #1c1917;
      --text-secondary: #57534e;
      
      --racing-green: var(--color-safe); /* Backward compatibility */
      --racing-green-light: #ecfdf5;
    }
    
    body { 
      background-color: var(--bg-legal-pad); 
      color: var(--text-primary);
      font-family: 'Inter', sans-serif;
    }
    
    /* Typography Overrides */
    h1, h2, h3, h4, h5, h6, .font-serif {
      font-family: 'Merriweather', serif;
    }
    
    .font-mono, .font-financial {
      font-family: 'JetBrains Mono', monospace;
    }
    
    .font-sans {
      font-family: 'Inter', sans-serif;
    }
    
    /* Component Styles */
    .walnut-card { 
      background-color: var(--card-white); 
      border: 1px solid var(--border-subtle); 
      border-radius: 4px; /* Sharper corners for legal feel */
      padding: 24px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* Sharp shadow-md */
      margin-bottom: 16px;
    }

    /* Utility Classes for Status */
    .status-safe { color: var(--color-safe); }
    .bg-status-safe { background-color: var(--color-safe); }
    
    .status-warning { color: var(--color-warning); }
    .bg-status-warning { background-color: var(--color-warning); }
    
    .status-hostile { color: var(--color-hostile); }
    .bg-status-hostile { background-color: var(--color-hostile); }

    /* Navigation & Interactive */
    .sidebar-link:hover {
      background-color: #292524;
      color: #f5f5f4;
    }
    .sidebar-link.active {
      background-color: var(--color-safe);
      color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .toggle-switch { position: relative; display: inline-block; width: 40px; height: 22px; margin-left: 8px; }
    .toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 22px; }
    .toggle-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 2px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%; }
    input:checked + .toggle-slider { background-color: var(--color-safe); }
    input:checked + .toggle-slider:before { transform: translateX(18px); }
    .toggle-red input:checked + .toggle-slider { background-color: var(--color-hostile); }

    .kanban-card { 
      background: var(--card-white); 
      border: 1px solid var(--border-subtle); 
      border-radius: 4px; 
      padding: 12px; 
      margin-bottom: 12px; 
      box-shadow: 0 1px 2px rgba(0,0,0,0.05); 
      transition: transform 0.1s; 
    }
    .kanban-card:hover { transform: translateY(-2px); box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-color: var(--color-safe); }

    .accounting-table th { font-family: 'Inter', sans-serif; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.7rem; color: var(--text-secondary); background-color: #f9fafb; border-bottom: 1px solid var(--border-subtle); padding: 12px; text-align: left; font-weight: 600; }
    .accounting-table td { padding: 12px; border-bottom: 1px solid var(--border-subtle); font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; }
    .accounting-total { font-weight: bold; border-top: 2px solid #1c1917; border-bottom: 4px double #1c1917; }
    
    .bubble-user { background-color: var(--color-safe); color: white; border-radius: 12px 12px 0 12px; padding: 12px 16px; font-family: 'Inter', sans-serif; max-width: 80%; margin-left: auto; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
    .bubble-ai { background-color: var(--card-white); border: 1px solid var(--border-subtle); color: var(--text-primary); border-radius: 12px 12px 12px 0; padding: 12px 16px; font-family: 'Inter', sans-serif; max-width: 80%; margin-right: auto; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }

    /* Stamp animation */
    .stamp-overlay {
      font-family: 'Merriweather', serif;
      font-weight: 900;
      font-size: 22px;
      letter-spacing: 0.15em;
      border: 2px solid currentColor;
      padding: 6px 12px;
      transform: translateY(0) rotate(-8deg);
      opacity: 0.85;
      background: rgba(255,255,255,0.1);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      text-transform: uppercase;
    }
    @keyframes stampSlam {
      0% { transform: scale(1.25) rotate(-8deg); opacity: 0.8; }
      100% { transform: scale(1.0) rotate(-8deg); opacity: 0.85; }
    }
    .animate-stamp-slam { animation: stampSlam 300ms ease-out forwards; }
  `}</style>
  );
}
