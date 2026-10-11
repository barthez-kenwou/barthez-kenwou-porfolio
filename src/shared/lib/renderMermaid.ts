type MermaidTheme = 'dark' | 'light';

/** Remove Mermaid temp / error nodes that otherwise stick to document.body */
export function cleanupMermaidDomArtifacts(renderId?: string) {
  if (typeof document === 'undefined') return;

  if (renderId) {
    for (const id of [renderId, `d${renderId}`, `i${renderId}`]) {
      document.getElementById(id)?.remove();
    }
  }

  // Mermaid error UI ("Syntax error in text" + bomb) and orphaned hosts
  document
    .querySelectorAll(
      'body > div[id^="dmermaid"], body > div[id^="dproject-diagram"], body > div[id^="dmermaid-editor"], body > iframe[id^="imermaid"], body > iframe[id^="iproject-diagram"]',
    )
    .forEach((el) => el.remove());
}

/**
 * Render Mermaid to SVG without leaking its error banner into the page footer.
 */
export async function renderMermaidSvg(
  renderId: string,
  definition: string,
  theme: MermaidTheme,
): Promise<string> {
  const mermaid = (await import('mermaid')).default;

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: theme === 'dark' ? 'dark' : 'neutral',
    fontFamily: 'inherit',
    suppressErrorRendering: true,
  });

  try {
    const { svg } = await mermaid.render(renderId, definition);
    return svg;
  } finally {
    cleanupMermaidDomArtifacts(renderId);
  }
}
