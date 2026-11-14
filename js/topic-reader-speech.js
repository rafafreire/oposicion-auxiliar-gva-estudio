// Shared playback controls for standalone topic readers.
(() => {
  const start = document.getElementById('speak-start');
  const pause = document.getElementById('speak-pause');
  const stop = document.getElementById('speak-stop');
  const speed = document.getElementById('speak-speed');
  const status = document.getElementById('speak-status');
  const duration = document.getElementById('speak-duration');
  const progress = document.getElementById('speak-progress');
  const position = document.getElementById('speak-position');
  const reader = document.getElementById('reader-content');
  const synth = window.speechSynthesis;
  let chunks = [];
  let index = 0;
  let chunkOffset = 0;
  let active = false;
  let playbackId = 0;
  let totalChars = 0;
  let totalWords = 0;
  let selectedRange = null;
  let boundaryTimer = null;

  if (!synth || typeof SpeechSynthesisUtterance !== 'function') {
    start.disabled = true;
    status.textContent = 'Lectura en voz alta no disponible en este navegador';
    return;
  }

  function clearHighlight() {
    if (!selectedRange) return;
    if (selectedRange.fallback) {
      selectedRange.fallback.classList.remove('speech-highlight');
    } else {
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
    }
    selectedRange = null;
  }

  function visibleText(element) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let text = '';
    let node;
    while ((node = walker.nextNode())) {
      nodes.push({ node, start: text.length, end: text.length + node.nodeValue.length });
      text += node.nodeValue;
    }
    return { text, nodes };
  }

  function buildChunks() {
    chunks = [];
    totalWords = 0;
    const selector = 'h1,h2,h3,h4,h5,h6,p,li,blockquote,td';
    const blocks = [...reader.querySelectorAll(selector)]
      .filter(element => !element.querySelector(selector));

    for (const element of blocks) {
      const data = visibleText(element);
      const text = data.text.trim();
      if (!text) continue;

      const leading = data.text.length - data.text.trimStart().length;
      totalWords += (text.match(/\S+/g) || []).length;
      for (let startAt = 0; startAt < text.length;) {
        let endAt = Math.min(startAt + 1400, text.length);
        if (endAt < text.length) {
          const space = text.lastIndexOf(' ', endAt);
          if (space > startAt + 700) endAt = space;
        }
        const untrimmed = text.slice(startAt, endAt);
        const part = untrimmed.trim();
        const trimStart = untrimmed.length - untrimmed.trimStart().length;
        if (part) {
          chunks.push({
            text: part,
            element,
            nodes: data.nodes,
            start: leading + startAt + trimStart,
            weight: part.length
          });
        }
        startAt = endAt;
      }
    }

    totalChars = chunks.reduce((sum, chunk) => sum + chunk.weight, 0);
  }

  function secondsFor(chars) {
    return Math.round((chars / 5) / (155 * Number(speed.value)) * 60);
  }

  function timeLabel(seconds) {
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  }

  function updateProgress(offset) {
    const bounded = Math.max(0, Math.min(totalChars, offset));
    progress.value = totalChars
      ? String(Math.round(bounded / totalChars * 1000))
      : '0';
    position.textContent = `${timeLabel(secondsFor(bounded))} / ${timeLabel(secondsFor(totalChars))} aprox.`;
  }

  function updateDuration() {
    duration.textContent = totalWords
      ? `Duración aprox. ${timeLabel(secondsFor(totalChars))}`
      : '';
    updateProgress(0);
  }

  function locate(charOffset, nodes) {
    for (const entry of nodes) {
      if (charOffset <= entry.end) {
        return { node: entry.node, offset: Math.max(0, charOffset - entry.start) };
      }
    }
    const last = nodes[nodes.length - 1];
    return last ? { node: last.node, offset: last.node.length } : null;
  }

  function highlightChunk(chunk, charIndex, charLength, shouldScroll = false) {
    clearHighlight();
    if (!chunk) return;
    const startAt = locate(chunk.start + Math.max(0, charIndex), chunk.nodes);
    const endAt = locate(chunk.start + Math.max(0, charIndex) + (charLength || 1), chunk.nodes);
    if (!startAt || !endAt) return;

    try {
      const range = document.createRange();
      range.setStart(startAt.node, Math.min(startAt.offset, startAt.node.length));
      range.setEnd(endAt.node, Math.min(endAt.offset, endAt.node.length));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      selectedRange = range;
    } catch (error) {
      chunk.element.classList.add('speech-highlight');
      selectedRange = { fallback: chunk.element };
    }
    if (shouldScroll) chunk.element.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  function reset() {
    active = false;
    pause.disabled = true;
    stop.disabled = true;
    start.disabled = false;
    pause.textContent = '⏸ Pausar';
  }

  function speakNext(currentPlayback) {
    if (currentPlayback !== playbackId) return;
    if (!active) return;
    if (index >= chunks.length) {
      clearHighlight();
      status.textContent = 'Lectura terminada';
      updateProgress(totalChars);
      reset();
      return;
    }

    const chunk = chunks[index];
    const chunkIndex = index++;
    const prefix = chunks.slice(0, chunkIndex).reduce((sum, item) => sum + item.weight, 0);
    const localStart = chunkOffset;
    chunkOffset = 0;
    const utterance = new SpeechSynthesisUtterance(chunk.text.slice(localStart));
    utterance.lang = 'es-ES';
    utterance.rate = Number(speed.value);
    const voice = synth.getVoices().find(item => /^es[-_]/i.test(item.lang));
    if (voice) utterance.voice = voice;

    utterance.onstart = () => {
      if (currentPlayback !== playbackId) return;
      status.textContent = 'Leyendo…';
      highlightChunk(chunk, localStart, 1, true);
      updateProgress(prefix + localStart);
      boundaryTimer = setTimeout(() => {
        clearHighlight();
        chunk.element.classList.add('speech-highlight');
        selectedRange = { fallback: chunk.element };
      }, 700);
    };
    utterance.onboundary = event => {
      if (currentPlayback !== playbackId) return;
      if (event.name !== 'word' && !event.charLength) return;
      clearTimeout(boundaryTimer);
      boundaryTimer = null;
      const charIndex = localStart + event.charIndex;
      const spokenLength = event.charLength
        || ((chunk.text.slice(charIndex).match(/^\S+/) || [''])[0].length)
        || 1;
      highlightChunk(chunk, charIndex, spokenLength);
      updateProgress(prefix + Math.min(chunk.weight, charIndex));
    };
    utterance.onend = () => {
      if (currentPlayback !== playbackId) return;
      clearTimeout(boundaryTimer);
      boundaryTimer = null;
      updateProgress(prefix + chunk.weight);
      speakNext(currentPlayback);
    };
    utterance.onerror = () => {
      if (currentPlayback !== playbackId) return;
      clearTimeout(boundaryTimer);
      boundaryTimer = null;
      status.textContent = 'No se pudo continuar la lectura';
      reset();
    };
    synth.speak(utterance);
  }

  function startFrom(target) {
    if (!chunks.length) buildChunks();
    const currentPlayback = ++playbackId;
    clearTimeout(boundaryTimer);
    boundaryTimer = null;
    synth.cancel();
    clearHighlight();

    const chars = totalChars * (target / 1000);
    let passed = 0;
    index = 0;
    while (index < chunks.length && passed + chunks[index].weight <= chars) {
      passed += chunks[index].weight;
      index++;
    }
    chunkOffset = index < chunks.length ? chars - passed : 0;
    active = true;
    pause.disabled = false;
    stop.disabled = false;
    start.disabled = true;
    status.textContent = 'Preparando lectura…';
    updateProgress(passed);
    speakNext(currentPlayback);
  }

  progress.addEventListener('change', () => startFrom(Number(progress.value)));
  speed.addEventListener('change', () => {
    if (active) startFrom(Number(progress.value));
    else updateDuration();
  });
  start.addEventListener('click', () => startFrom(Number(progress.value)));
  pause.addEventListener('click', () => {
    if (synth.paused) {
      synth.resume();
      pause.textContent = '⏸ Pausar';
      status.textContent = 'Leyendo…';
    } else if (synth.speaking) {
      synth.pause();
      pause.textContent = '▶ Continuar';
      status.textContent = 'Lectura en pausa';
    }
  });
  stop.addEventListener('click', () => {
    playbackId++;
    clearTimeout(boundaryTimer);
    boundaryTimer = null;
    synth.cancel();
    clearHighlight();
    status.textContent = 'Lectura detenida';
    reset();
  });

  buildChunks();
  updateDuration();
  window.addEventListener('beforeunload', () => {
    playbackId++;
    synth.cancel();
  });
})();
