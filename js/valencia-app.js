const VALENCIA_KEY = 'opogva-progress-ayuntamiento-valencia-v1';
const VALENCIA_EXAM_PATH = 'OPOSICIONES/AUX ADM AYUNT VALENCIA/EXAMENES/EXAMEN_AUXADMVAL_2025.json';
const VALENCIA_EXAM_PDF = 'OPOSICIONES/AUX ADM AYUNT VALENCIA/EXAMENES/EXAMENES_AUXILIAR_ADMINISTRATIVO.pdf';
const valenciaTopics = [
  { n: 1, block: 'BLOQUE I', title: 'La Constitución Española de 1978. Derechos y libertades fundamentales' },
  { n: 2, block: 'BLOQUE I', title: 'La Corona. Las Cortes Generales. El Tribunal Constitucional' },
  { n: 3, block: 'BLOQUE I', title: 'El Gobierno, la Administración y la protección de datos' },
  { n: 4, block: 'BLOQUE I', title: 'La organización territorial del Estado y el Estatuto de Autonomía' },
  { n: 5, block: 'BLOQUE I', title: 'Fuentes del derecho público' },
  { n: 6, block: 'BLOQUE I', title: 'El procedimiento administrativo. Ley 39/2015' },
  { n: 7, block: 'BLOQUE I', title: 'Fases del procedimiento. Terminación y silencio administrativo' },
  { n: 8, block: 'BLOQUE I', title: 'Validez de los actos administrativos y recursos' },
  { n: 9, block: 'BLOQUE I', title: 'Prevención de riesgos laborales' },
  { n: 10, block: 'BLOQUE I', title: 'Régimen Jurídico del Sector Público. Ley 40/2015' },
  { n: 11, block: 'BLOQUE II', title: 'Régimen Local Español. La Provincia' },
  { n: 12, block: 'BLOQUE II', title: 'El Municipio, población y participación ciudadana' },
  { n: 13, block: 'BLOQUE II', title: 'Competencias y órganos municipales' },
  { n: 14, block: 'BLOQUE II', title: 'Ordenanzas y Reglamentos de las Entidades Locales' },
  { n: 15, block: 'BLOQUE II', title: 'Funcionamiento de los órganos colegiados locales' },
  { n: 16, block: 'BLOQUE II', title: 'Personal al servicio de la Administración Local' },
  { n: 17, block: 'BLOQUE II', title: 'Contratación del sector público' },
  { n: 18, block: 'BLOQUE II', title: 'Licencias y servicios públicos locales' },
  { n: 19, block: 'BLOQUE II', title: 'Haciendas Locales y ordenanzas fiscales' },
  { n: 20, block: 'BLOQUE II', title: 'Igualdad efectiva y protección frente a la violencia de género' },
  { n: 21, block: 'BLOQUE II', title: 'Plataforma Integral de Administración Electrónica (PIAE)' }
];
const $vlc = selector => document.querySelector(selector);
const valenciaFreshState = () => ({
  topicProgress: {},
  wrong: [],
  answers: {},
  stats: { answered: 0, correct: 0 }
});
let valenciaQuestions = [];
let valenciaTest = [];
let valenciaIndex = 0;
let valenciaSession = { right: 0, wrong: 0 };
let valenciaTopicCache = new Map();

function valenciaState() {
  try {
    return { ...valenciaFreshState(), ...JSON.parse(localStorage.getItem(VALENCIA_KEY) || '{}') };
  } catch {
    return valenciaFreshState();
  }
}

function valenciaEscape(text) {
  return String(text).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
}

function valenciaSave(state) {
  localStorage.setItem(VALENCIA_KEY, JSON.stringify(state));
  valenciaRenderStats();
}

function valenciaTopicProgress(state, number) {
  return state.topicProgress?.[number] || { status: 'pending', rating: 0 };
}

function valenciaRenderStats() {
  const state = valenciaState();
  const complete = valenciaTopics.filter(topic => valenciaTopicProgress(state, topic.n).status === 'done').length;
  $vlc('#vlc-topics-done').textContent = complete;
  $vlc('#vlc-topic-progress').style.width = `${complete / valenciaTopics.length * 100}%`;
  $vlc('#vlc-answered-count').textContent = state.stats.answered;
  $vlc('#vlc-correct-count').textContent = state.stats.correct;
  $vlc('#vlc-missed-count').textContent = state.wrong.length;
  $vlc('#vlc-error-badge').textContent = state.wrong.length;

  const remaining = valenciaTopics.filter(topic => valenciaTopicProgress(state, topic.n).status !== 'done');
  $vlc('#vlc-remaining').innerHTML = remaining.length
    ? `<p>Te quedan <strong>${remaining.length} temas</strong> por completar:</p><ul>${remaining.slice(0, 6).map(topic => {
      const progress = valenciaTopicProgress(state, topic.n);
      return `<li>Tema ${String(topic.n).padStart(2, '0')} · ${valenciaEscape(topic.title)} <span>${progress.status === 'progress' ? 'En curso' : 'Pendiente'}</span></li>`;
    }).join('')}</ul>${remaining.length > 6 ? `<small>y ${remaining.length - 6} más</small>` : ''}`
    : '<p class="all-topics-done">✓ Has completado todos los temas.</p>';
}

function valenciaSetView(name) {
  document.querySelectorAll('.view').forEach(section => section.classList.remove('active-view'));
  $vlc(`#vlc-view-${name}`).classList.add('active-view');
  document.querySelectorAll('[data-vlc-view]').forEach(button => button.classList.toggle('active', button.dataset.vlcView === name));
  if (name === 'fallos') valenciaRenderReview();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('[data-vlc-view]').forEach(button => button.addEventListener('click', () => valenciaSetView(button.dataset.vlcView)));
document.querySelectorAll('[data-vlc-go]').forEach(button => button.addEventListener('click', () => valenciaSetView(button.dataset.vlcGo)));
$vlc('#opposition-switch-valencia').addEventListener('change', event => {
  if (event.target.value === 'gva') window.location.href = 'index.html';
  if (event.target.value === 'age') window.location.href = 'age.html';
});

function valenciaRenderTopics() {
  const state = valenciaState();
  $vlc('#vlc-topic-list').innerHTML = valenciaTopics.map(topic => {
    const progress = valenciaTopicProgress(state, topic.n);
    const status = progress.status === 'done' ? 'Estudiado' : progress.status === 'progress' ? 'En curso' : 'Pendiente';
    return `<article class="topic-card">
      <button class="topic-open" type="button" data-vlc-open="${topic.n}" aria-label="Abrir el tema ${String(topic.n).padStart(2, '0')} en una ventana nueva">
        <span class="topic-number">${String(topic.n).padStart(2, '0')}</span>
        <span class="topic-title"><small>${topic.block}</small><strong>${valenciaEscape(topic.title)}</strong></span>
        <span class="topic-state ${progress.status === 'done' ? 'is-done' : ''}">${status} · ${progress.rating ? `Nivel ${progress.rating}/5` : 'Sin valorar'}</span>
        <span class="age-topic-arrow" aria-hidden="true">↗</span>
      </button>
      <div class="study-controls">
        <label>Progreso<select data-vlc-status="${topic.n}"><option value="pending" ${progress.status === 'pending' ? 'selected' : ''}>Pendiente</option><option value="progress" ${progress.status === 'progress' ? 'selected' : ''}>En curso</option><option value="done" ${progress.status === 'done' ? 'selected' : ''}>Estudiado</option></select></label>
        <label>Autoevaluación<select data-vlc-rating="${topic.n}"><option value="0" ${!progress.rating ? 'selected' : ''}>Sin valorar</option>${[1, 2, 3, 4, 5].map(rating => `<option value="${rating}" ${progress.rating === rating ? 'selected' : ''}>${rating} · ${['', 'Inicial', 'Básico', 'En progreso', 'Buen dominio', 'Lo domino'][rating]}</option>`).join('')}</select></label>
      </div>
      <button type="button" class="secondary-button" data-vlc-open="${topic.n}">Abrir tema completo ↗</button>
    </article>`;
  }).join('');

  document.querySelectorAll('[data-vlc-status]').forEach(select => select.addEventListener('change', () => {
    const next = valenciaState();
    const number = Number(select.dataset.vlcStatus);
    next.topicProgress[number] = { ...valenciaTopicProgress(next, number), status: select.value };
    valenciaSave(next);
    valenciaRenderTopics();
  }));
  document.querySelectorAll('[data-vlc-rating]').forEach(select => select.addEventListener('change', () => {
    const next = valenciaState();
    const number = Number(select.dataset.vlcRating);
    next.topicProgress[number] = { ...valenciaTopicProgress(next, number), rating: Number(select.value) };
    valenciaSave(next);
    valenciaRenderTopics();
  }));
  document.querySelectorAll('[data-vlc-open]').forEach(button => button.addEventListener('click', () => valenciaOpenTopic(Number(button.dataset.vlcOpen))));
}

function valenciaInlineMarkdown(text) {
  return valenciaEscape(text)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

function valenciaMarkdownToHtml(markdown) {
  const lines = markdown.replace(/\r/g, '').split('\n');
  const output = [];
  let paragraph = [];
  let list = '';

  const closeList = () => {
    if (!list) return;
    output.push(`</${list}>`);
    list = '';
  };
  const flushParagraph = () => {
    if (!paragraph.length) return;
    output.push(`<p>${paragraph.map(valenciaInlineMarkdown).join(' ')}</p>`);
    paragraph = [];
  };
  const flush = () => {
    flushParagraph();
    closeList();
  };
  const tableCells = line => line.trim().replace(/^\||\|$/g, '').split('|').map(cell => cell.trim());
  const isTableLine = line => /^\|.*\|$/.test(line.trim());

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index].trim();
    if (!line) {
      flush();
      continue;
    }
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flush();
      const level = Math.min(heading[1].length, 4);
      output.push(`<h${level}>${valenciaInlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }
    if (/^(-{3,}|_{3,})$/.test(line)) {
      flush();
      output.push('<hr>');
      continue;
    }
    if (isTableLine(line)) {
      flush();
      const rows = [];
      while (index < lines.length && isTableLine(lines[index])) {
        const cells = tableCells(lines[index]);
        if (!cells.every(cell => /^:?-{3,}:?$/.test(cell))) rows.push(cells);
        index++;
      }
      index--;
      if (rows.length) {
        output.push(`<table><thead><tr>${rows[0].map(cell => `<th>${valenciaInlineMarkdown(cell)}</th>`).join('')}</tr></thead><tbody>${rows.slice(1).map(row => `<tr>${row.map(cell => `<td>${valenciaInlineMarkdown(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table>`);
      }
      continue;
    }
    const quote = line.match(/^>\s?(.*)$/);
    if (quote) {
      flush();
      output.push(`<blockquote>${valenciaInlineMarkdown(quote[1])}</blockquote>`);
      continue;
    }
    const unordered = line.match(/^[-*]\s+(.+)$/);
    const ordered = line.match(/^\d+[.)]\s+(.+)$/);
    if (unordered || ordered) {
      flushParagraph();
      const nextList = unordered ? 'ul' : 'ol';
      if (list !== nextList) {
        closeList();
        list = nextList;
        output.push(`<${list}>`);
      }
      output.push(`<li>${valenciaInlineMarkdown((unordered || ordered)[1])}</li>`);
      continue;
    }
    if (list) closeList();
    paragraph.push(line);
  }
  flush();
  return output.join('');
}

async function valenciaLoadTopic(number) {
  if (valenciaTopicCache.has(number)) return valenciaTopicCache.get(number);
  const block = number <= 10 ? 'BLOQUE I' : 'BLOQUE II';
  const file = `OPOSICIONES/AUX ADM AYUNT VALENCIA/TEMARIO/${block}/TEMA ${String(number).padStart(2, '0')}.md`;
  const response = await fetch(new URL(file, location.href), { cache: 'no-cache' });
  if (!response.ok) throw new Error(`No se pudo cargar el Tema ${number}: HTTP ${response.status}`);
  const html = valenciaMarkdownToHtml(await response.text());
  valenciaTopicCache.set(number, html);
  return html;
}

function valenciaReaderPage(topic, content) {
  const speechScript = new URL('js/topic-reader-speech.js', location.href).href;
  const title = valenciaEscape(topic.title);
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>*{box-sizing:border-box}body{margin:0;background:#f5f7f2;color:#263328;font:16px/1.8 system-ui,sans-serif}.bar{position:sticky;top:0;z-index:2;background:#fff;border-bottom:1px solid #e5ebe3;padding:10px 18px}.bar-inner{max-width:900px;margin:auto;display:flex;align-items:center;gap:10px;flex-wrap:wrap}.bar button{border:1px solid #dce8da;border-radius:7px;padding:8px 11px;background:#f5f8f3;color:#286342;font:600 12px system-ui;cursor:pointer}.bar button:disabled{opacity:.5;cursor:default}.reader-title{font-size:12px;color:#55705a}.speech-controls{display:flex;align-items:center;gap:7px;flex-wrap:wrap}.speech-status{font-size:11px;color:#657665}.speech-speed-label{display:flex;align-items:center;gap:5px;color:#55705a;font-size:11px}.speech-speed{border:1px solid #dce8da;border-radius:6px;background:#fff;color:#286342;padding:6px;font:12px system-ui}.speech-progress{max-width:900px;margin:9px auto 0;display:flex;align-items:center;gap:10px}.speech-progress label{font-size:11px;white-space:nowrap}.speech-progress input{flex:1;min-width:70px;accent-color:#286342;cursor:pointer}.speech-progress output{color:#55705a;font-size:11px;white-space:nowrap}.speech-highlight{border-radius:3px;background:#fff2b8!important;color:#263328;box-shadow:inset 0 0 0 1px #e8c94e}::selection{background:#ffe27a;color:#263328}main{max-width:900px;margin:26px auto;padding:30px 42px;background:#fff;border:1px solid #e7ebe4;border-radius:14px}h1{font:700 26px/1.4 system-ui;color:#245c43}h2,h3,h4{color:#286342;line-height:1.45}h2{font-size:20px}h3{font-size:17px}p{margin:10px 0}li{margin:7px 0}table{width:100%;border-collapse:collapse;margin:15px 0;font-size:14px}th,td{border:1px solid #dfe7dd;padding:8px 10px;text-align:left}th{background:#f2f7f1;color:#286342}blockquote{margin:14px 0;padding:12px 15px;border-left:3px solid #83a98a;background:#f4f8f3;color:#526453}a{color:#286342;overflow-wrap:anywhere}code{background:#f2f5f0;padding:2px 5px;border-radius:4px}@media(max-width:700px){main{margin:12px;padding:18px 15px}.bar{padding:9px 11px}.bar-inner{align-items:flex-start}.speech-controls{width:100%}.reader-title{width:100%}.speech-progress{margin-top:8px;gap:7px;flex-wrap:wrap}.speech-progress label{width:100%}.speech-progress output{font-size:10px}}</style></head><body><header class="bar"><div class="bar-inner"><button type="button" id="back">← Volver a OpoGVA</button><span class="reader-title">Auxiliar Administrativo · València · Tema ${String(topic.n).padStart(2, '0')}</span><div class="speech-controls"><button type="button" id="speak-start">▶ Escuchar tema</button><label class="speech-speed-label" for="speak-speed">Velocidad<select class="speech-speed" id="speak-speed"><option value="0.7">0,7×</option><option value="0.85">0,85×</option><option value="1" selected>1×</option><option value="1.25">1,25×</option><option value="1.5">1,5×</option><option value="2">2×</option></select></label><button type="button" id="speak-pause" disabled>⏸ Pausar</button><button type="button" id="speak-stop" disabled>■ Detener</button><span id="speak-status" class="speech-status" aria-live="polite"></span><span id="speak-duration" class="speech-status" aria-live="polite"></span></div></div><div class="speech-progress"><label for="speak-progress">Progreso de lectura</label><input id="speak-progress" type="range" min="0" max="1000" value="0" aria-label="Elegir el punto del tema que quieres escuchar"><output id="speak-position" for="speak-progress">0:00 / 0:00 aprox.</output></div></header><main id="reader-content"><h1>${title}</h1>${content}</main><script src="${speechScript}"></script><script>document.getElementById('back').addEventListener('click',()=>{if(window.opener)window.close();else history.back()});</script></body></html>`;
}

function valenciaOpenTopic(number) {
  const topic = valenciaTopics.find(item => item.n === number);
  if (!topic) return;
  const reader = window.open('about:blank', '_blank');
  if (!reader) return;
  reader.document.open();
  reader.document.write(`<!doctype html><html lang="es"><meta charset="utf-8"><body><p style="font:16px system-ui;padding:24px">Cargando el tema…</p></body></html>`);
  reader.document.close();
  valenciaLoadTopic(number).then(content => {
    if (reader.closed) return;
    reader.document.open();
    reader.document.write(valenciaReaderPage(topic, content));
    reader.document.close();
  }).catch(error => {
    console.error(error);
    if (reader.closed) return;
    reader.document.open();
    reader.document.write(`<!doctype html><html lang="es"><meta charset="utf-8"><body><p style="font:16px system-ui;padding:24px">No se pudo cargar el tema. Comprueba la conexión e inténtalo de nuevo.</p></body></html>`);
    reader.document.close();
  });
}

function valenciaRenderReview() {
  const wrong = valenciaState().wrong;
  if (!wrong.length) {
    $vlc('#vlc-review-area').innerHTML = '<div class="empty-review panel"><span>✦</span><h2>¡Todo al día!</h2><p>Las preguntas que falles aparecerán aquí para repasarlas.</p></div>';
    return;
  }
  $vlc('#vlc-review-area').innerHTML = `<p class="review-count">${wrong.length} pregunta${wrong.length === 1 ? '' : 's'} pendiente${wrong.length === 1 ? '' : 's'}</p>${wrong.map(question => `<article class="review-card panel"><div class="quiz-meta"><span>EXAMEN 2025 · PREGUNTA ${question.number}</span><span>REPASO PENDIENTE</span></div><h2>${valenciaEscape(question.q)}</h2><div class="answers">${question.opts.map((option, index) => `<button class="answer" data-vlc-review="${valenciaEscape(question.id)}" data-answer="${index}">${String.fromCharCode(65 + index)}. ${valenciaEscape(option)}</button>`).join('')}</div><div id="vlc-review-${valenciaEscape(question.id)}"></div><details class="review-source"><summary>Ver explicación</summary><p>${valenciaEscape(question.why)}</p><a href="${VALENCIA_EXAM_PDF}" target="_blank" rel="noopener">PDF del cuestionario ↗</a></details></article>`).join('')}`;
  document.querySelectorAll('[data-vlc-review]').forEach(button => button.addEventListener('click', () => {
    const state = valenciaState();
    const question = state.wrong.find(item => item.id === button.dataset.vlcReview);
    if (!question) return;
    const choice = Number(button.dataset.answer);
    const correct = choice === question.correct;
    document.querySelectorAll(`[data-vlc-review="${CSS.escape(question.id)}"]`).forEach((option, index) => {
      option.disabled = true;
      if (index === question.correct) option.classList.add('correct');
      else if (index === choice) option.classList.add('incorrect');
    });
    if (correct) {
      state.wrong = state.wrong.filter(item => item.id !== question.id);
      valenciaSave(state);
      $vlc(`#vlc-review-${CSS.escape(question.id)}`).innerHTML = '<p class="feedback good">¡Bien! Pregunta repasada y retirada de pendientes.</p>';
      setTimeout(valenciaRenderReview, 800);
    } else {
      $vlc(`#vlc-review-${CSS.escape(question.id)}`).innerHTML = '<p class="feedback bad">Todavía no. Revisa la respuesta correcta e inténtalo otra vez más tarde.</p>';
    }
  }));
}

function valenciaRenderQuestion() {
  window.stopQuizSpeech();
  const area = $vlc('#vlc-quiz-area');
  if (valenciaIndex >= valenciaTest.length) {
    area.innerHTML = `<div class="result-card panel"><span class="stat-icon green">✓</span><h2>Test terminado</h2><p>Has acertado <strong>${valenciaSession.right}</strong> y fallado <strong>${valenciaSession.wrong}</strong> de ${valenciaTest.length} preguntas.</p><button class="primary-button" id="vlc-again">Hacer otro test →</button></div>`;
    $vlc('#vlc-again').addEventListener('click', valenciaBeginTest);
    return;
  }
  const question = valenciaTest[valenciaIndex];
  area.innerHTML = `<div class="quiz-card panel"><div class="quiz-meta"><span>EXAMEN AUXILIAR 2025 · PREGUNTA ${question.number}</span><span>PREGUNTA ${valenciaIndex + 1} / ${valenciaTest.length}</span></div><div class="quiz-progress"><span style="width:${(valenciaIndex + 1) / valenciaTest.length * 100}%"></span></div><div class="quiz-question"><h2>${valenciaEscape(question.q)}</h2><button class="secondary-button read-question" type="button" data-read-question aria-pressed="false" ${window.quizSpeechAvailable() ? '' : 'disabled title="La lectura en voz alta no está disponible en este navegador"'}>🔊 Escuchar pregunta y respuestas</button></div><div class="answers">${question.opts.map((option, index) => `<button class="answer" type="button" data-vlc-answer="${index}"><b>${String.fromCharCode(65 + index)}</b>${valenciaEscape(option)}</button>`).join('')}</div><div class="feedback-slot"></div><div class="quiz-actions"><button class="secondary-button" id="vlc-next" disabled>${valenciaIndex + 1 === valenciaTest.length ? 'Ver resultado' : 'Siguiente pregunta →'}</button></div></div>`;
  area.querySelectorAll('[data-vlc-answer]').forEach(button => button.addEventListener('click', () => valenciaRespond(question, Number(button.dataset.vlcAnswer), area)));
  $vlc('#vlc-next').addEventListener('click', () => {
    valenciaIndex++;
    valenciaRenderQuestion();
  });
}

function valenciaRespond(question, choice, area) {
  const state = valenciaState();
  const correct = choice === question.correct;
  state.stats.answered++;
  if (correct) {
    state.stats.correct++;
    valenciaSession.right++;
    state.wrong = state.wrong.filter(item => item.id !== question.id);
  } else {
    valenciaSession.wrong++;
    if (!state.wrong.some(item => item.id === question.id)) state.wrong.push(question);
  }
  state.answers[question.id] = choice;
  valenciaSave(state);
  area.querySelectorAll('.answer').forEach((button, index) => {
    button.disabled = true;
    if (index === question.correct) button.classList.add('correct');
    else if (index === choice) button.classList.add('incorrect');
  });
  area.querySelector('.feedback-slot').innerHTML = `<div class="feedback ${correct ? 'good' : 'bad'}"><strong>${correct ? '¡Correcto!' : 'Respuesta incorrecta'}</strong><p>${valenciaEscape(question.why)}</p><a href="${VALENCIA_EXAM_PDF}" target="_blank" rel="noopener">Consultar el PDF del cuestionario ↗</a>${correct ? '' : '<small>Se ha añadido a Repasar fallos.</small>'}</div>`;
  $vlc('#vlc-next').disabled = false;
}

function valenciaBeginTest() {
  if (!valenciaQuestions.length) return;
  const size = $vlc('#vlc-test-size').value;
  const ordered = [...valenciaQuestions];
  if (size !== 'all') {
    for (let index = ordered.length - 1; index > 0; index--) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [ordered[index], ordered[swapIndex]] = [ordered[swapIndex], ordered[index]];
    }
  }
  valenciaTest = ordered.slice(0, size === 'all' ? ordered.length : Number(size));
  valenciaIndex = 0;
  valenciaSession = { right: 0, wrong: 0 };
  $vlc('#vlc-quiz-source').innerHTML = `<a class="material-link" href="${VALENCIA_EXAM_PDF}" target="_blank" rel="noopener">PDF del cuestionario Auxiliar Administrativo ↗</a><span>${valenciaQuestions.length} preguntas con respuesta</span>`;
  valenciaRenderQuestion();
}

async function valenciaLoadQuestionBank() {
  const response = await fetch(new URL(VALENCIA_EXAM_PATH, location.href), { cache: 'no-cache' });
  if (!response.ok) throw new Error(`No se pudo cargar el banco de preguntas: HTTP ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data.preguntas) || !data.preguntas.length) throw new Error('El archivo del cuestionario no contiene preguntas.');
  valenciaQuestions = data.preguntas.map(item => {
    const options = Object.entries(item.opciones || {}).sort(([a], [b]) => a.localeCompare(b));
    const correctKey = String(item.respuesta_correcta || '').toLowerCase();
    if (!item.pregunta || options.length < 2 || !options.some(([key]) => key === correctKey)) {
      throw new Error(`La pregunta ${item.numero} tiene opciones o respuesta incorrectas en el JSON.`);
    }
    return {
      id: `valencia-2025-${item.numero}`,
      number: item.numero,
      q: item.pregunta.replace(/^T\d+(?:\+\d+)*\s*[-–:]?\s*/i, '').trim(),
      opts: options.map(([, text]) => text),
      correct: options.findIndex(([key]) => key === correctKey),
      why: item.explicacion || 'Consulta el PDF original y las bases de la convocatoria.'
    };
  });
  $vlc('#vlc-test-size').querySelector('[value="all"]').textContent = `Cuestionario completo · ${valenciaQuestions.length}`;
  $vlc('#vlc-start-test').disabled = false;
  $vlc('#vlc-start-test').textContent = 'Comenzar test →';
  $vlc('#vlc-start-full-exam').disabled = false;
  $vlc('#vlc-exam-status').textContent = `${valenciaQuestions.length} preguntas cargadas; todas incluyen una respuesta indicada y una explicación.`;
}

$vlc('#vlc-start-test').addEventListener('click', valenciaBeginTest);
$vlc('#vlc-start-full-exam').addEventListener('click', () => {
  $vlc('#vlc-test-size').value = 'all';
  valenciaSetView('test');
  valenciaBeginTest();
});
$vlc('#vlc-exam-links').innerHTML = `<a class="material-link" href="${VALENCIA_EXAM_PDF}" target="_blank" rel="noopener">PDF de exámenes Auxiliar Administrativo ↗</a> <a class="material-link" href="OPOSICIONES/AUX ADM AYUNT VALENCIA/TEMARIO/bop 134_bases convocatoria.pdf" target="_blank" rel="noopener">Bases de la convocatoria ↗</a>`;

valenciaRenderStats();
valenciaRenderTopics();
valenciaLoadQuestionBank().catch(error => {
  console.error(error);
  const message = `No se pudo cargar el banco de preguntas. ${error.message}`;
  $vlc('#vlc-exam-status').textContent = message;
  $vlc('#vlc-start-test').textContent = 'Preguntas no disponibles';
});
