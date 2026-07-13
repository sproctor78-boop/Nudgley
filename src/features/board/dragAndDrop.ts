import { useState, type DragEvent } from 'react';
import { useAppDispatch } from '../../app/providers/AppProviders';

export const TASK_DRAG_MIME = 'text/nudgley-task';

export function useTaskDrag(taskId: string) {
  const [dragging, setDragging] = useState(false);
  function onDragStart(event: DragEvent) {
    event.dataTransfer.setData(TASK_DRAG_MIME, taskId);
    event.dataTransfer.effectAllowed = 'move';
    setDragging(true);
  }
  function onDragEnd() { setDragging(false); }
  return { dragging, onDragStart, onDragEnd };
}

export function useColumnDropTarget(bucket: string) {
  const dispatch = useAppDispatch();
  const [isOver, setIsOver] = useState(false);

  function onDragOver(event: DragEvent) {
    if (!event.dataTransfer.types.includes(TASK_DRAG_MIME)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    if (!isOver) setIsOver(true);
  }
  function onDragLeave(event: DragEvent) {
    if (event.currentTarget.contains(event.relatedTarget as Node)) return;
    setIsOver(false);
  }
  function onDrop(event: DragEvent) {
    event.preventDefault();
    setIsOver(false);
    const taskId = event.dataTransfer.getData(TASK_DRAG_MIME);
    if (taskId) dispatch({ type: 'moveTask', taskId, bucket });
  }
  return { isOver, onDragOver, onDragLeave, onDrop };
}
