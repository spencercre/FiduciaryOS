import React, { useState, useEffect } from 'react';
import { Clock, BadgeCheck, ChevronUp, ChevronDown } from 'lucide-react';

export const TaskCard = ({ task, getTrustName, onMove, onEdit }) => {
    const [expandedTaskId, setExpandedTaskId] = useState(null);
    const [stamping, setStamping] = useState(false);
    const [hidden, setHidden] = useState(false);
    const stampedText = task.status === 'review' ? 'FILED' : 'COMPLETED';

    const toggleExpand = () => {
        setExpandedTaskId(expandedTaskId === task.id ? null : task.id);
    };
    const handleComplete = () => {
        if (stamping) return;
        setStamping(true);
        setTimeout(() => {
            if (onMove) onMove(task.id, 'done');
            setHidden(true);
        }, 1500);
    };

    return (
        <div className={`kanban-card group flex flex-col bg-white border border-stone-200 rounded shadow-sm hover:shadow-md transition-all relative ${hidden ? 'opacity-0 h-0 overflow-hidden pointer-events-none duration-500' : ''}`}>
            {stamping && (
                <div className={`absolute inset-0 flex items-center justify-center pointer-events-none`}>
                    <div className={`stamp-overlay ${task.status === 'review' ? 'text-green-700' : 'text-red-700'} animate-stamp-slam`}>
                        {stampedText}
                    </div>
                </div>
            )}
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${task.priority === 'High' ? 'bg-red-100 text-red-700' : task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{task.priority}</span>
                    <span className="text-[10px] text-stone-400 flex items-center"><Clock size={10} className="mr-1"/> {task.due}</span>
                </div>
                <p className="text-sm font-bold text-stone-800 mb-1">{task.title}</p>
                <div className="flex items-center mt-2">
                   <BadgeCheck size={12} className="text-racing-green mr-1" />
                   <p className="text-xs text-racing-green font-bold font-serif">{getTrustName(task.trustId)}</p>
                </div>
            </div>
            {/* Expandable Details Button */}
            <button onClick={toggleExpand} className="w-full py-1.5 text-center text-xs font-bold text-stone-400 bg-stone-50 hover:bg-stone-100 hover:text-racing-green flex items-center justify-center transition-colors border-t border-stone-100">
                {expandedTaskId === task.id ? "Show Less" : "Details"} {expandedTaskId === task.id ? <ChevronUp size={12} className="ml-1"/> : <ChevronDown size={12} className="ml-1"/>}
            </button>
            {/* Expanded Details */}
            {expandedTaskId === task.id && (
                <div className="p-3 bg-stone-50 border-t border-stone-100 text-xs space-y-2">
                    <div className="flex justify-between"><span className="text-stone-500">Status:</span><span className="font-bold text-stone-700 capitalize">{task.status.replace('-', ' ')}</span></div>
                    <div className="flex justify-between"><span className="text-stone-500">Assigned:</span><span className="font-bold text-stone-700">Larry Lahr</span></div>
                    <div className="flex justify-between"><span className="text-stone-500">Created:</span><span className="font-bold text-stone-700">Dec 15, 2024</span></div>
                    <div className="flex space-x-2 pt-2 border-t border-stone-200">
                        {task.status !== 'done' && (
                            <button
                              onClick={task.status === 'todo' ? () => onMove(task.id, 'in-progress') : handleComplete}
                              className="flex-1 py-1.5 bg-[#059669] hover:bg-[#047857] text-white rounded text-xs font-bold shadow-sm transition"
                            >
                              {task.status === 'todo' ? 'Start' : 'Complete'}
                            </button>
                        )}
                        <button onClick={() => onEdit(task)} className="flex-1 py-1.5 bg-white border border-stone-300 text-stone-600 rounded text-xs font-bold hover:bg-stone-50 transition">Edit</button>
                    </div>
                </div>
            )}
        </div>
    );
};
