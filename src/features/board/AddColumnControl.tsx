import { useRef, useState } from 'react';
import { useAppDispatch } from '../../app/providers/AppProviders';
import { createColumnId } from '../../domain/columns/columnTypes';
import { PlusIcon } from '../../components/icons/Icons';
import { useClickOutside } from '../../hooks/useClickOutside';

export function AddColumnControl() {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  useClickOutside(wrapperRef, () => { setOpen(false); setLabel(''); }, open);

  function submit() {
    const trimmed = label.trim();
    if (trimmed) dispatch({ type: 'addColumn', column: { id: createColumnId(trimmed), label: trimmed } });
    setLabel('');
    setOpen(false);
  }

  if (!open) {
    return <button type="button" className="add-column-button" onClick={() => setOpen(true)}>
      <PlusIcon width={15} height={15} /><span>Add column</span>
    </button>;
  }

  return <div className="add-column-form" ref={wrapperRef}>
    <label className="sr-only" htmlFor="new-column-name">Column name</label>
    <input
      id="new-column-name"
      autoFocus
      value={label}
      onChange={(event: any) => setLabel(event.target.value)}
      onKeyDown={(event: any) => { if (event.key === 'Enter') submit(); if (event.key === 'Escape') { setOpen(false); setLabel(''); } }}
      placeholder="Column name…"
    />
    <button type="button" className="primary-action" onClick={submit} disabled={!label.trim()}>Add</button>
  </div>;
}
