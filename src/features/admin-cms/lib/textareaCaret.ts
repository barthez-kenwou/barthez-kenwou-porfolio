export type TextareaCaret = {
  start: number;
  end: number;
  scrollTop: number;
};

export function readTextareaCaret(el: HTMLTextAreaElement): TextareaCaret {
  return {
    start: el.selectionStart,
    end: el.selectionEnd,
    scrollTop: el.scrollTop,
  };
}

/**
 * Keep caret + scroll after a controlled value update.
 * Double rAF beats React overwriting selection on the same commit.
 */
export function restoreTextareaCaret(
  el: HTMLTextAreaElement,
  start: number,
  end: number,
  scrollTop: number,
) {
  const apply = () => {
    const len = el.value.length;
    const s = Math.max(0, Math.min(start, len));
    const e = Math.max(0, Math.min(end, len));
    el.focus({ preventScroll: true });
    el.setSelectionRange(s, e);
    el.scrollTop = scrollTop;
    ensureCaretVisible(el);
  };

  requestAnimationFrame(() => {
    apply();
    requestAnimationFrame(apply);
  });
}

/** Nudge scroll only when the caret sits outside the visible viewport. */
export function ensureCaretVisible(el: HTMLTextAreaElement) {
  const style = window.getComputedStyle(el);
  const lineHeight = parseFloat(style.lineHeight) || 24;
  const paddingTop = parseFloat(style.paddingTop) || 0;
  const lineIndex = el.value.slice(0, el.selectionStart).split('\n').length - 1;
  const caretY = lineIndex * lineHeight + paddingTop;
  const viewTop = el.scrollTop;
  const viewBottom = viewTop + el.clientHeight;
  const margin = lineHeight * 2;

  if (caretY < viewTop + margin) {
    el.scrollTop = Math.max(0, caretY - margin);
  } else if (caretY + lineHeight > viewBottom - margin) {
    el.scrollTop = caretY + lineHeight + margin - el.clientHeight;
  }
}
