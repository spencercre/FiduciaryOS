import React from 'react';
import { TaskCommandCenter } from '../components/tasks/TaskCommandCenter';

export function Tasks({ tasks, trusts, onMoveTask }) {
    return (
        <TaskCommandCenter tasks={tasks} trusts={trusts} onMoveTask={onMoveTask} />
    );
}
