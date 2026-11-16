(() => {
  const content = document.getElementById('reader-content');
  const errorMessage = document.getElementById('reader-error');
  const titleLabel = document.getElementById('reader-title');

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.hidden = false;
    content.replaceChildren();
  }

  function findTopic(number) {
    let nextNumber = 1;
    for (const block of window.gsiAgeData.blocks) {
      for (let index = 0; index < block.topics.length; index++) {
        if (nextNumber === number) {
          return {
            block,
            title: block.topics[index],
            path: `OPOSICIONES/GSI AGE/TEMARIO/BLOQUE ${block.id}/TEMA ${String(number).padStart(2, '0')}.md`
          };
        }
        nextNumber++;
      }
    }
    return null;
  }

  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[character]));
  }

  function inlineMarkdown(text) {
    return escapeHtml(text)
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1 ↗</a>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  function markdownToHtml(markdown) {
    const output = [];
    let listType = '';

    function closeList() {
      if (listType) {
        output.push(`</${listType}>`);
        listType = '';
      }
    }

    for (const rawLine of markdown.replace(/\r/g, '').split('\n')) {
      const line = rawLine.trim();
      if (!line) {
        closeList();
        continue;
      }

      const heading = line.match(/^(#{1,6})\s+(.+)$/);
      if (heading) {
        closeList();
        const level = heading[1].length;
        output.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
        continue;
      }

      const unordered = line.match(/^[-*+]\s+(.+)$/);
      const ordered = line.match(/^\d+[.)]\s+(.+)$/);
      if (unordered || ordered) {
        const nextType = unordered ? 'ul' : 'ol';
        if (listType !== nextType) {
          closeList();
          output.push(`<${nextType}>`);
          listType = nextType;
        }
        output.push(`<li>${inlineMarkdown((unordered || ordered)[1])}</li>`);
        continue;
      }

      const quote = line.match(/^>\s?(.*)$/);
      if (quote) {
        closeList();
        output.push(`<blockquote>${inlineMarkdown(quote[1])}</blockquote>`);
        continue;
      }

      if (/^(?:---+|\*\*\*|___+)$/.test(line)) {
        closeList();
        output.push('<hr>');
        continue;
      }

      closeList();
      output.push(`<p>${inlineMarkdown(line)}</p>`);
    }

    closeList();
    return output.join('');
  }

  function loadSpeechControls() {
    const script = document.createElement('script');
    script.src = new URL('js/topic-reader-speech.js', location.href).href;
    script.onerror = () => {
      document.getElementById('speak-start').disabled = true;
      document.getElementById('speak-status').textContent = 'No se pudieron cargar los controles de lectura';
    };
    document.body.append(script);
  }

  document.getElementById('reader-back').addEventListener('click', () => {
    if (window.opener) {
      window.close();
    } else if (history.length > 1) {
      history.back();
    } else {
      location.href = 'gsi-age.html#temario';
    }
  });

  const number = Number(new URLSearchParams(location.search).get('tema'));
  if (!Number.isInteger(number) || number < 1 || number > 57) {
    showError('El número de tema no es válido.');
    return;
  }

  const topic = findTopic(number);
  if (!topic) {
    showError('No se encontró el tema solicitado.');
    return;
  }

  document.title = `GSI AGE · Tema ${String(number).padStart(2, '0')}`;
  titleLabel.textContent = `GSI AGE · Bloque ${topic.block.id} · Tema ${String(number).padStart(2, '0')}`;
  const encodedPath = topic.path.split('/').map(encodeURIComponent).join('/');

  fetch(new URL(encodedPath, location.href), { cache: 'no-cache' })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.text();
    })
    .then(markdown => {
      content.innerHTML = markdownToHtml(markdown);
      loadSpeechControls();
    })
    .catch(error => {
      console.error(`No se pudo cargar el tema GSI ${number}:`, error);
      showError('No se pudo cargar el contenido del tema. Comprueba que la aplicación se sirve desde un servidor web e inténtalo de nuevo.');
    });
})();
