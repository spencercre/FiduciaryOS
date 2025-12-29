import React from 'react';

export const NewTaskModal = ({ onClose, onAdd, newTask, setNewTask, trusts, isEditing }) => {
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
                <div className="p-6 border-b border-stone-200">
                    <h2 className="text-xl font-serif font-bold text-stone-900">{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Task Title</label>
                        <input type="text" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} placeholder="Enter task description..." className="w-full p-3 border border-stone-300 rounded font-serif text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Trust</label>
                            <select value={newTask.trustId} onChange={(e) => setNewTask({...newTask, trustId: parseInt(e.target.value)})} className="w-full p-3 border border-stone-300 rounded font-serif text-sm">
                                {trusts.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Priority</label>
                            <select value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value})} className="w-full p-3 border border-stone-300 rounded font-serif text-sm">
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Due Date</label>
                        <select value={newTask.due} onChange={(e) => setNewTask({...newTask, due: e.target.value})} className="w-full p-3 border border-stone-300 rounded font-serif text-sm">
                            <option value="Today">Today</option>
                            <option value="Tomorrow">Tomorrow</option>
                            <option value="This Week">This Week</option>
                            <option value="Next Week">Next Week</option>
                            <option value="ASAP">ASAP</option>
                        </select>
                    </div>
                </div>
                <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 text-stone-600 font-bold text-sm">Cancel</button>
                    <button onClick={onAdd} disabled={!newTask.title} className="px-6 py-2 bg-racing-green text-white font-bold rounded shadow-md disabled:opacity-50 disabled:cursor-not-allowed">{isEditing ? 'Save Changes' : 'Create Task'}</button>
                </div>
            </div>
        </div>
    );
};
