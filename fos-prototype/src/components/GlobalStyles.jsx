import React from 'react';

export function GlobalStyles() {
  return (
  <style>{`
    :root {
      --racing-green: #004225;
      --racing-green-light: #e5f0eb;
      --stone-50: #fafaf9;
      --stone-100: #f5f5f4;
      --stone-200: #e7e5e4;
      --stone-800: #292524;
      --stone-900: #1c1917;
      --paper-cream: #fdfbf7;
      --gold-500: #d4af37;
    }
    body { background-color: var(--stone-50); }
    
    .bg-racing-green { background-color: var(--racing-green); }
    .text-racing-green { color: var(--racing-green); }
    .border-racing-green { border-color: var(--racing-green); }
    .bg-racing-green-light { background-color: var(--racing-green-light); }
    
    .font-serif { font-family: 'Times New Roman', Times, serif; }
    .font-sans { font-family: system-ui, -apple-system, sans-serif; }
    
    .walnut-card { 
      background-color: white; 
      border: 1px solid var(--stone-200); 
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05); 
      margin-bottom: 16px;
    }

    .sidebar-link:hover {
      background-color: var(--stone-800);
      color: var(--stone-100);
    }
    .sidebar-link.active {
      background-color: var(--racing-green);
      color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .toggle-switch { position: relative; display: inline-block; width: 40px; height: 22px; margin-left: 8px; }
    .toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 22px; }
    .toggle-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 2px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%; }
    input:checked + .toggle-slider { background-color: var(--racing-green); }
    input:checked + .toggle-slider:before { transform: translateX(18px); }
    .toggle-red input:checked + .toggle-slider { background-color: #991b1b; }

    .kanban-card { background: white; border: 1px solid var(--stone-200); border-radius: 6px; padding: 12px; margin-bottom: 12px; box-shadow: 0 1px 2px rgba(0,0,0,0.05); transition: transform 0.1s; }
    .kanban-card:hover { transform: translateY(-2px); box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-color: var(--racing-green); }

    .accounting-table th { font-family: system-ui, -apple-system, sans-serif; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.7rem; color: var(--stone-500); background-color: var(--stone-50); border-bottom: 1px solid var(--stone-200); padding: 12px; text-align: left; font-weight: 600; }
    .accounting-table td { padding: 12px; border-bottom: 1px solid var(--stone-100); font-family: 'Times New Roman', serif; font-size: 0.95rem; }
    .accounting-total { font-weight: bold; border-top: 2px solid var(--stone-800); border-bottom: 4px double var(--stone-800); }
    
    .bubble-user { background-color: var(--racing-green); color: white; border-radius: 12px 12px 0 12px; padding: 12px 16px; font-family: 'Times New Roman', serif; max-width: 80%; margin-left: auto; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
    .bubble-ai { background-color: var(--paper-cream); border: 1px solid var(--stone-200); color: var(--stone-900); border-radius: 12px 12px 12px 0; padding: 12px 16px; font-family: 'Times New Roman', serif; max-width: 80%; margin-right: auto; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
  `}</style>
  );
}
