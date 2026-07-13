export interface ColumnDef { id: string; label: string; }

export function createColumnId(label: string): string {
  const slug = label.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const suffix = Math.random().toString(36).slice(2, 7);
  return `custom-${slug || 'column'}-${suffix}`;
}
