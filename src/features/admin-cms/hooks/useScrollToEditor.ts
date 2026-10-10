import React from 'react';

export function useScrollToEditor(editing: unknown) {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const tableRef = React.useRef<HTMLDivElement>(null);
  const wasEditingRef = React.useRef(Boolean(editing));

  const scrollToEditor = React.useCallback(() => {
    editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const scrollToTable = React.useCallback(() => {
    tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  React.useEffect(() => {
    const isEditing = Boolean(editing);
    const wasEditing = wasEditingRef.current;
    wasEditingRef.current = isEditing;

    if (isEditing && !wasEditing) {
      requestAnimationFrame(() => scrollToEditor());
      return;
    }

    if (!isEditing && wasEditing) {
      requestAnimationFrame(() => scrollToTable());
    }
  }, [editing, scrollToEditor, scrollToTable]);

  return { editorRef, tableRef, scrollToEditor, scrollToTable };
}
