import type { Focus } from '@/lib/imageFocus';

// Opens the admin image editor (crop + focus point, see app/admin/ImageEditor.tsx) and waits for the result.
export type EditorOptions = { aspect?: number };
/** `file` is null when the picture itself was not changed (only the focus point). */
export type EditorResult = { file: File | null; focus: Focus | null };
export type EditorRequest = { source: File | string; options: EditorOptions; resolve: (r: EditorResult | null) => void };

export const EDITOR_EVENT = 'admin-image-editor';
let hostMounted = false;
export const setEditorHost = (mounted: boolean) => { hostMounted = mounted; };

export function openImageEditor(source: File | string, options: EditorOptions = {}): Promise<EditorResult | null> {
  if (typeof window === 'undefined' || !hostMounted) {
    return Promise.resolve({ file: typeof source === 'string' ? null : source, focus: null });
  }
  return new Promise(resolve => {
    window.dispatchEvent(new CustomEvent<EditorRequest>(EDITOR_EVENT, { detail: { source, options, resolve } }));
  });
}
