import React from 'react';
import { TaskCommandCenter } from '../components/tasks/TaskCommandCenter';

export function ComplianceRoadmap({ tasks, trusts, onMoveTask }) {
    return (
        <TaskCommandCenter tasks={tasks} trusts={trusts} onMoveTask={onMoveTask} />
    );
}
