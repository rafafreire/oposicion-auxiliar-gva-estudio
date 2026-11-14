(() => {
  const escapeHtml = text => text.replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));

  const ignoredLine = line => line.includes('Aprovecha el transporte')
    || /^(?:\d+\s+ley(?:es)?|\d+\s+artículos de tu programa|\d+\s+artículos? preguntados? en examen oficial|Actualizado a\b.*|¿Quieres verla completa\b.*|Esta ley$|Todo el tema$|Escuchar$|Configurar$|Aprovecha\b|AA$|Hacer test\b.*|🔧.*|Elegir cuántas$|Subir$|Examen$|\d+)$/.test(line)
    || /^\d+ de \d+ artículos\b/.test(line);

  window.ageFormatMaterial = source => {
    const lines = source.replace(/\r/g, '').split('\n').map(line => line.trim());
    const firstLaw = lines.indexOf('LEY');
    const firstArticle = lines.findIndex(line => /^Art\.\s/i.test(line));
    const starts = [firstLaw, firstArticle].filter(index => index >= 0);
    const start = starts.length ? Math.min(...starts) : -1;
    const output = [];
    const heading = lines[0];
    const description = lines[1];
    let listType = '';
    let articleOpen = false;
    let lawHeadings = 0;

    if (heading) {
      output.push(`<h2 class="age-material-title">${escapeHtml(heading)}</h2>`);
    }

    if (description && !ignoredLine(description)) {
      output.push(`<p class="age-material-lead">${escapeHtml(description)}</p>`);
    }

    const closeList = () => {
      if (listType) {
        output.push(`</${listType}>`);
        listType = '';
      }
    };

    const closeArticle = () => {
      closeList();
      if (articleOpen) {
        output.push('</section>');
        articleOpen = false;
      }
    };

    for (let index = Math.max(start, 0); index < lines.length; index++) {
      const line = lines[index];
      if (!line || ignoredLine(line)) continue;

      if (line === 'LEY') {
        closeArticle();
        output.push('<hr>');
        lawHeadings = 2;
        continue;
      }

      if (lawHeadings) {
        closeList();
        output.push(lawHeadings === 2
          ? `<h2 class="age-law-code">${escapeHtml(line)}</h2>`
          : `<p class="age-law-title">${escapeHtml(line)}</p>`);
        lawHeadings--;
        continue;
      }

      if (/^(?:Título|Capítulo|Sección)\b/i.test(line)) {
        closeList();
        output.push(`<p class="age-material-hierarchy">${escapeHtml(line)}</p>`);
        continue;
      }

      if (/^Art\.\s/i.test(line)) {
        closeArticle();
        output.push(`<section class="age-material-article"><h3>${escapeHtml(line)}</h3>`);
        articleOpen = true;
        continue;
      }

      const followingLines = lines.slice(index + 1, index + 4).filter(Boolean);
      if (/(?:…|\.{3})$/.test(line) && followingLines.some(next => /^(?:Título|Capítulo|Sección)\b/i.test(next))) {
        continue;
      }

      const unorderedItem = line.match(/^[•*-]\s+(.+)$/);
      const orderedItem = line.match(/^\d+[.)]\s+(.+)$/);
      if (unorderedItem || orderedItem) {
        const type = unorderedItem ? 'ul' : 'ol';
        if (listType !== type) {
          closeList();
          output.push(`<${type}>`);
          listType = type;
        }
        output.push(`<li>${escapeHtml((unorderedItem || orderedItem)[1])}</li>`);
        continue;
      }

      closeList();
      if (line.length <= 120 && (line === line.toLocaleUpperCase('es') || line.endsWith(':'))) {
        output.push(`<h4>${escapeHtml(line.replace(/:$/, ''))}</h4>`);
      } else {
        output.push(`<p>${escapeHtml(line)}</p>`);
      }
    }

    closeArticle();
    closeList();
    return output.join('');
  };
})();
