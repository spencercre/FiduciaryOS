import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Plus } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { NewTaskModal } from './NewTaskModal';
import { FilterModal } from './FilterModal';

export function TaskCommandCenter({ tasks, trusts, onMoveTask }) {
    const getTrustName = (id) => trusts.find(t => t.id === id)?.name || "Unknown";
    const [localTasks, setLocalTasks] = useState(tasks);
    const [showNewTaskModal, setShowNewTaskModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filterPriority, setFilterPriority] = useState('all');
    const [filterTrust, setFilterTrust] = useState('all');
    const [newTask, setNewTask] = useState({ title: '', trustId: 1, priority: 'Medium', due: 'Today', status: 'todo' });
    const [isEditing, setIsEditing] = useState(false);
    const [searchParams] = useSearchParams();
    const highlightId = searchParams.get('highlight');

    useEffect(() => { setLocalTasks(tasks); }, [tasks]);

    const handleMove = (taskId, newStatus) => {
        const updated = localTasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
        setLocalTasks(updated);
        if(onMoveTask) onMoveTask(taskId, newStatus);
    };

    const handleAddTask = () => {
        if (isEditing) {
            setLocalTasks(localTasks.map(t => t.id === newTask.id ? newTask : t));
        } else {
            const task = { ...newTask, id: Date.now() };
            setLocalTasks([...localTasks, task]);
        }
        setNewTask({ title: '', trustId: 1, priority: 'Medium', due: 'Today', status: 'todo' });
        setIsEditing(false);
        setShowNewTaskModal(false);
    };

    const filteredTasks = (localTasks || []).filter(t => {
        if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
        if (filterTrust !== 'all' && t.trustId !== parseInt(filterTrust)) return false;
        return true;
    });

    const columns = [
        { key: 'backlog', label: 'Backlog', color: 'text-stone-500', bgColor: 'bg-stone-100' },
        { key: 'todo', label: 'To Do', color: 'text-stone-700', bgColor: 'bg-stone-50' },
        { key: 'in-progress', label: 'In Progress', color: 'text-blue-700', bgColor: 'bg-blue-50' },
        { key: 'review', label: 'Review', color: 'text-purple-700', bgColor: 'bg-purple-50' },
        { key: 'done', label: 'Completed', color: 'text-green-700', bgColor: 'bg-green-50' },
    ];

    return (
        <div className="space-y-6 animate-fadeIn">
            {showNewTaskModal && (
                <NewTaskModal 
                    onClose={() => { setShowNewTaskModal(false); setIsEditing(false); setNewTask({ title: '', trustId: 1, priority: 'Medium', due: 'Today', status: 'todo' }); }} 
                    onAdd={handleAddTask} 
                    newTask={newTask} 
                    setNewTask={setNewTask} 
                    trusts={trusts}
                    isEditing={isEditing}
                />
            )}
            {showFilterModal && (
                <FilterModal 
                    onClose={() => setShowFilterModal(false)} 
                    onApply={() => setShowFilterModal(false)} 
                    onClear={() => { setFilterPriority('all'); setFilterTrust('all'); }} 
                    filterPriority={filterPriority} 
                    setFilterPriority={setFilterPriority} 
                    filterTrust={filterTrust} 
                    setFilterTrust={setFilterTrust} 
                    trusts={trusts} 
                />
            )}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-stone-200 pb-6">
                <div><h1 className="font-serif text-3xl font-bold text-stone-900">Compliance Roadmap</h1><p className="text-stone-500 font-serif italic">Unified Workflow Across All Trusts</p></div>
                <div className="flex space-x-2 mt-4 md:mt-0">
                    <button onClick={() => setShowFilterModal(true)} className={`flex items-center px-4 py-2 border rounded text-sm font-bold transition ${filterPriority !== 'all' || filterTrust !== 'all' ? 'bg-racing-green text-white border-racing-green' : 'bg-white border-stone-300 text-stone-600 hover:bg-stone-50'}`}>
                        <Filter size={16} className="mr-2"/> Filter {(filterPriority !== 'all' || filterTrust !== 'all') && '•'}
                    </button>
                    <button onClick={() => { setIsEditing(false); setNewTask({ title: '', trustId: 1, priority: 'Medium', due: 'Today', status: 'todo' }); setShowNewTaskModal(true); }} className="flex items-center px-4 py-2 bg-racing-green text-white rounded font-bold text-sm hover:bg-stone-800 shadow-md"><Plus size={16} className="mr-2"/> New Task</button>
                </div>
            </div>
            {/* 5-Column Kanban */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto">
                {columns.map(col => (
                    <div key={col.key} className={`${col.bgColor} rounded-lg p-3 border border-stone-200 min-h-[400px]`}>
                        <h3 className={`font-bold ${col.color} uppercase tracking-widest text-xs mb-3 flex items-center justify-between`}>
                            {col.label}
                            <span className="bg-white px-2 py-0.5 rounded-full text-stone-600 font-mono text-[10px]">{filteredTasks.filter(t => t.status === col.key).length}</span>
                        </h3>
                        <div className="space-y-2">
                            {filteredTasks.filter(t => t.status === col.key).map((task) => (
                                <div key={task.id} className={String(task.id) === highlightId ? "ring-4 ring-amber-400 rounded-lg animate-pulse" : ""}>
                                    <TaskCard 
                                        task={task} 
                                        getTrustName={getTrustName} 
                                        onMove={handleMove} 
                                        onEdit={(t) => {
                                            setNewTask(t);
                                            setIsEditing(true);
                                            setShowNewTaskModal(true);
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
