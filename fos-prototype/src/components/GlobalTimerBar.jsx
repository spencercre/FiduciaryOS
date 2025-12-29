import React from 'react';
import { Clock, Play, Pause, Square, X } from 'lucide-react';

export function GlobalTimerBar({ isRunning, isPaused, time, trustName, onPlay, onPause, onStop, onDiscard }) {
  if (!isRunning && time === 0) return null; // Don't show if no active session
  
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}h : ${m.toString().padStart(2, '0')}m : ${s.toString().padStart(2, '0')}s`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-stone-900 text-white shadow-2xl border-t border-stone-700" style={{ height: '48px' }}>
      <div className="h-full flex items-center justify-between px-4 max-w-screen-2xl mx-auto">
        {/* Left: Status indicator */}
        <div className="flex items-center space-x-3">
          <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-green-500'} ${!isPaused && isRunning ? 'animate-pulse' : ''}`}></div>
          <span className="text-xs text-stone-400 font-serif">
            {trustName ? `Tracking: ${trustName}` : 'Time Entry Active'}
          </span>
        </div>
        
        {/* Center: Timer display */}
        <div className="flex items-center space-x-4">
          <Clock size={16} className="text-stone-400" />
          <span className="font-mono text-lg font-bold tracking-wider">{formatTime(time)}</span>
        </div>
        
        {/* Right: Controls */}
        <div className="flex items-center space-x-2">
          {/* Play/Pause button */}
          {isPaused ? (
            <button 
              onClick={onPlay} 
              className="p-2 hover:bg-stone-700 rounded transition-colors" 
              title="Resume"
            >
              <Play size={18} className="text-green-400 fill-green-400" />
            </button>
          ) : (
            <button 
              onClick={onPause} 
              className="p-2 hover:bg-stone-700 rounded transition-colors" 
              title="Pause"
            >
              <Pause size={18} className="text-yellow-400" />
            </button>
          )}
          
          {/* Stop & Log button */}
          <button 
            onClick={onStop} 
            className="p-2 hover:bg-stone-700 rounded transition-colors" 
            title="Stop & Log Entry"
          >
            <Square size={18} className="text-red-400 fill-red-400" />
          </button>
          
          {/* Discard button */}
          <button 
            onClick={onDiscard} 
            className="p-2 hover:bg-stone-700 rounded transition-colors text-stone-500 hover:text-red-400" 
            title="Discard"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
