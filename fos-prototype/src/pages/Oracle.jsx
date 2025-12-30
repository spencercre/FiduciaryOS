import React, { useState, useRef, useEffect } from 'react';
import { BrainCircuit, Quote, ChevronDown, FileText, Scale, Users, DollarSign, AlertTriangle } from 'lucide-react';
import { TRUSTS } from '../data/mockData';

export function Oracle({ initialPrompt, contextTrust, onSelectContext }) {
  const getOracleReply = (userText) => {
    const lower = (userText || "").toLowerCase();
    if (lower.includes("greg")) {
      return {
        response: "I have analyzed the last 5 emails from Gregory Smith. The sentiment has shifted from 'Inquisitive' to 'Hostile'.",
        citation: "Source: Email Archive",
      };
    }

    return {
      response: "Based on the trust instrument, Article 4.2 grants you discretion here.",
      citation: "Source: Trust Instrument, Article 4.2",
    };
  };

  const [messages, setMessages] = useState(() => {
    if (contextTrust) {
      return [
        {
          id: 1,
          type: 'ai',
          text: `Hello Larry, I've reviewed the instruments for the **${contextTrust.name}**. How can I help?`,
        },
      ];
    }

    if (initialPrompt) {
      const { response, citation } = getOracleReply(initialPrompt);
      return [
        { id: 1, type: 'user', text: initialPrompt },
        { id: 2, type: 'ai', text: response, citation },
      ];
    }

    return [
      {
        id: 1,
        type: 'ai',
        text: "Hello Larry, I'm looking forward to digging into any trust or questions you might have. What trust are we talking about today?",
      },
    ];
  });
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [expandedCitation, setExpandedCitation] = useState(null);
  const bottomRef = useRef(null);

  // #5: CONTEXT-AWARE PROMPT SUGGESTIONS
  const getPromptSuggestions = () => {
    if (!contextTrust) return [];
    const baseSuggestions = [
      { icon: Scale, text: "What distributions are required?", category: "Distributions" },
      { icon: FileText, text: "Summarize fiduciary duties", category: "Duties" },
      { icon: Users, text: "List all beneficiaries", category: "Beneficiaries" },
    ];
    // Add trust-specific suggestions
    if (contextTrust.type === 'CRT') {
      baseSuggestions.push({ icon: DollarSign, text: "Calculate required charitable distribution", category: "Charitable" });
    }
    if (contextTrust.status === 'critical') {
      baseSuggestions.unshift({ icon: AlertTriangle, text: "What urgent actions are needed?", category: "Urgent" });
    }
    return baseSuggestions;
  };

  // #6: CITATION DETAILS FOR CITE SOURCE BUTTON
  const citationDetails = {
    "Source: Trust Instrument, Article 4.2": {
      title: "Article 4.2 - Discretionary Distributions",
      text: "The Trustee may, in the Trustee's sole and absolute discretion, distribute to or for the benefit of any one or more of the beneficiaries such amounts of income and principal as the Trustee determines...",
      document: "Trust Instrument.pdf",
      page: 12
    },
    "Source: Email Archive": {
      title: "Email Correspondence Analysis",
      text: "5 emails analyzed from Gregory Smith between Oct 15 - Dec 19, 2024. Sentiment trending: Inquisitive → Demanding → Hostile.",
      document: "Email Archive",
      page: null
    }
  };

  const handleSend = (text) => {
    const userText = text || input; if (!userText) return;
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: userText }]); setInput(""); setIsThinking(true);
    setTimeout(() => {
        const { response, citation } = getOracleReply(userText);
        setMessages(prev => [...prev, { id: Date.now() + 1, type: 'ai', text: response, citation: citation }]); setIsThinking(false);
    }, 1500);
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  
  const handleTrustSelect = (trust) => { setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: `Let's discuss: ${trust.name}` }, { id: Date.now()+1, type: 'ai', text: `Context set to ${trust.name} (${trust.situs}). Accessing Asset Ledger... Ready.` }]); if (onSelectContext) onSelectContext(trust.id); };

  const promptSuggestions = getPromptSuggestions();

  return (
    <div className="walnut-card h-[450px] flex flex-col p-0 overflow-hidden animate-fadeIn">
        <div className="p-4 border-b border-stone-200 bg-stone-50 flex justify-between items-center"><h2 className="font-serif font-bold text-stone-800 text-lg flex items-center"><BrainCircuit className="mr-2 text-racing-green" size={24} /> The Oracle</h2><span className="text-xs text-stone-500 font-serif italic">{contextTrust ? `Context: ${contextTrust.name}` : "Global Intelligence"}</span></div>
        <div className="flex-1 overflow-y-auto p-4 bg-[#fdfbf7] space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={msg.type === 'user' ? 'bubble-user' : 'bubble-ai'}>
              <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              {/* #6: CITE SOURCE BUTTON */}
              {msg.citation && (
                <div className="mt-2 pt-2 border-t border-stone-200">
                  <button 
                    onClick={() => setExpandedCitation(expandedCitation === msg.id ? null : msg.id)}
                    className="text-xs text-stone-500 flex items-center font-bold hover:text-racing-green transition-colors"
                  >
                    <Quote size={10} className="mr-1"/> {msg.citation}
                    <ChevronDown size={12} className={`ml-1 transition-transform ${expandedCitation === msg.id ? 'rotate-180' : ''}`}/>
                  </button>
                  {expandedCitation === msg.id && citationDetails[msg.citation] && (
                    <div className="mt-2 p-3 bg-stone-100 rounded border border-stone-200 text-xs">
                      <p className="font-bold text-stone-800 mb-1">{citationDetails[msg.citation].title}</p>
                      <p className="text-stone-600 italic mb-2">"{citationDetails[msg.citation].text}"</p>
                      <div className="flex items-center text-stone-500">
                        <FileText size={10} className="mr-1"/>
                        <span>{citationDetails[msg.citation].document}</span>
                        {citationDetails[msg.citation].page && <span className="ml-2">• Page {citationDetails[msg.citation].page}</span>}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {(!contextTrust && messages.length === 1 && !initialPrompt) && (<div className="flex flex-wrap gap-2 mt-2">{TRUSTS.map(t => (<button key={t.id} onClick={() => handleTrustSelect(t)} className="px-3 py-2 bg-white border border-stone-300 rounded-md text-xs font-serif text-stone-700 hover:border-racing-green hover:text-racing-green shadow-sm">{t.name}</button>))}</div>)}
          {isThinking && <div className="bubble-ai text-stone-400 text-sm italic">Consulting the Trust Instrument...</div>}
          <div ref={bottomRef} />
        </div>
        {/* INPUT AREA WITH #5: PROMPT SUGGESTIONS */}
        <div className="p-4 bg-stone-100 border-t border-stone-200">
          {contextTrust && promptSuggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {promptSuggestions.slice(0, 4).map((suggestion, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleSend(suggestion.text)}
                  className="flex items-center px-3 py-1.5 bg-white border border-stone-200 rounded-full text-xs font-serif text-stone-600 hover:border-racing-green hover:text-racing-green transition-colors shadow-sm"
                >
                  <suggestion.icon size={12} className="mr-1.5"/> {suggestion.text}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask a question..." className="flex-1 p-3 rounded-md border border-stone-300 focus:outline-none focus:border-racing-green font-serif text-sm" />
            <button onClick={() => handleSend()} className="bg-racing-green text-white px-4 py-2 rounded-md font-serif font-bold">Ask</button>
          </div>
        </div>
    </div>
  );
}
