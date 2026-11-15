const GSI_PROGRESS_KEY = 'opogva-progress-gsi-age-v1';
const GSI_DATA = window.gsiAgeData;
const $gsi = selector => document.querySelector(selector);
const gsiTopics = GSI_DATA.blocks.flatMap(block => block.topics.map((title, index) => ({
  id: `${block.id}-${index + 1}`,
  block: block.id,
  blockTitle: block.title,
  number: index + 1,
  title
})));

function gsiFreshState() {
  return { topicProgress: {} };
}

function gsiState() {
  try {
    return { ...gsiFreshState(), ...JSON.parse(localStorage.getItem(GSI_PROGRESS_KEY) || '{}') };
  } catch {
    return gsiFreshState();
  }
}

function gsiEscape(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));
}

function gsiProgress(state, topicId) {
  return state.topicProgress?.[topicId] || 'pending';
}

function gsiSave(state) {
  localStorage.setItem(GSI_PROGRESS_KEY, JSON.stringify(state));
  gsiRenderStats();
}

function gsiView(name) {
  document.querySelectorAll('.view').forEach(section => section.classList.remove('active-view'));
  $gsi(`#gsi-view-${name}`).classList.add('active-view');
  document.querySelectorAll('[data-gsi-view]').forEach(button => {
    button.classList.toggle('active', button.dataset.gsiView === name);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function gsiRenderStats() {
  const state = gsiState();
  const completed = gsiTopics.filter(topic => gsiProgress(state, topic.id) === 'done').length;
  $gsi('#gsi-topics-done').textContent = completed;
  $gsi('#gsi-topic-progress').style.width = `${completed / gsiTopics.length * 100}%`;
  const examDocuments = new Set([
    ...GSI_DATA.examGroups.flatMap(group => group.files.map(file => file.path)),
    ...GSI_DATA.testExams.map(exam => exam.answerTemplate).filter(Boolean)
  ]);
  $gsi('#gsi-exam-document-count').textContent = examDocuments.size;

  const pending = gsiTopics.filter(topic => gsiProgress(state, topic.id) !== 'done');
  $gsi('#gsi-remaining').innerHTML = pending.length
    ? `<p>Te quedan <strong>${pending.length} temas</strong> por completar:</p><ul>${pending.slice(0, 6).map(topic => {
      const progress = gsiProgress(state, topic.id);
      const status = progress === 'progress' ? 'En curso' : 'Pendiente';
      return `<li>Bloque ${topic.block} · Tema ${String(topic.number).padStart(2, '0')} · ${gsiEscape(topic.title)} <span>${status}</span></li>`;
    }).join('')}</ul>${pending.length > 6 ? `<small>y ${pending.length - 6} más</small>` : ''}`
    : '<p class="all-topics-done">✓ Has completado todos los temas.</p>';
}

function gsiRenderTopics() {
  const state = gsiState();
  $gsi('#gsi-topic-list').innerHTML = GSI_DATA.blocks.map(block => {
    const topics = block.topics.map((title, index) => {
      const id = `${block.id}-${index + 1}`;
      const status = gsiProgress(state, id);
      const statusLabel = status === 'done' ? 'Estudiado' : status === 'progress' ? 'En curso' : 'Pendiente';
      return `<article class="topic-card age-topic">
        <div class="age-topic-open">
          <span class="topic-number">${String(index + 1).padStart(2, '0')}</span>
          <span class="topic-title"><small>BLOQUE ${block.id} · ${gsiEscape(block.title).toUpperCase()}</small><strong>${gsiEscape(title)}</strong></span>
          <span class="topic-state ${status === 'done' ? 'is-done' : ''}">${statusLabel}</span>
        </div>
        <div class="study-controls"><label>Progreso<select data-gsi-progress="${id}" aria-label="Progreso del bloque ${block.id}, tema ${index + 1}">
          <option value="pending" ${status === 'pending' ? 'selected' : ''}>Pendiente</option>
          <option value="progress" ${status === 'progress' ? 'selected' : ''}>En curso</option>
          <option value="done" ${status === 'done' ? 'selected' : ''}>Estudiado</option>
        </select></label></div>
      </article>`;
    }).join('');
    return `<section class="gsi-topic-block"><div class="panel-heading"><div><p class="eyebrow">BLOQUE ${block.id}</p><h2>${gsiEscape(block.title)}</h2></div><span>${block.topics.length} temas</span></div><div class="topic-list">${topics}</div></section>`;
  }).join('');

  document.querySelectorAll('[data-gsi-progress]').forEach(select => {
    select.addEventListener('change', () => {
      const next = gsiState();
      next.topicProgress[select.dataset.gsiProgress] = select.value;
      gsiSave(next);
      gsiRenderTopics();
    });
  });
}

function gsiExamCard(group) {
  const links = group.files.map(file => `<li><a href="${encodeURI(file.path)}" target="_blank" rel="noopener">${gsiEscape(file.label)} ↗</a></li>`).join('');
  return `<article class="panel"><div class="panel-heading"><div><p class="eyebrow">INGRESO LIBRE</p><h2>Convocatoria ${group.year}</h2></div></div><ul>${links}</ul><a class="material-link" href="${group.source}" target="_blank" rel="noopener">Ver convocatoria y publicaciones en el INAP ↗</a></article>`;
}

function gsiRenderExams() {
  $gsi('#gsi-exam-list').innerHTML = GSI_DATA.examGroups.map(gsiExamCard).join('');
  $gsi('#gsi-json-exam-list').innerHTML = GSI_DATA.testExams.map(exam => {
    const answerLink = exam.answerTemplate
      ? `<a class="material-link" href="${encodeURI(exam.answerTemplate)}" target="_blank" rel="noopener">Plantilla definitiva ↗</a>`
      : '<p class="panel-description">Sin plantilla definitiva en los archivos disponibles; el test no se puntuará automáticamente.</p>';
    return `<article class="panel"><div class="panel-heading"><div><p class="eyebrow">CUESTIONARIO · ${exam.answerTemplate ? 'CON PLANTILLA' : 'SIN PLANTILLA'}</p><h2>Examen ${exam.year}</h2></div></div><p><button class="primary-button" type="button" data-gsi-open-test="${exam.year}">Practicar este examen →</button></p>${answerLink}<a class="material-link" href="${encodeURI(exam.path)}" download>Descargar preguntas JSON ↗</a>${exam.source ? `<a class="material-link" href="${exam.source}" target="_blank" rel="noopener">Fuente oficial ↗</a>` : ''}</article>`;
  }).join('');
  document.querySelectorAll('[data-gsi-open-test]').forEach(button => {
    button.addEventListener('click', () => {
      gsiView('test');
      $gsi('#gsi-test-year').value = button.dataset.gsiOpenTest;
      $gsi('#gsi-test-size').value = 'all';
      gsiStartTest();
    });
  });
}

function gsiRenderDocuments() {
  $gsi('#gsi-document-list').innerHTML = GSI_DATA.documents.map(document => {
    const link = document.path
      ? `<a class="material-link" href="${encodeURI(document.path)}" target="_blank" rel="noopener">Abrir PDF ↗</a>`
      : '';
    return `<article class="panel"><p class="eyebrow">INSTITUTO NACIONAL DE ADMINISTRACIÓN PÚBLICA</p><h2>${gsiEscape(document.label)}</h2><p class="panel-description">${gsiEscape(document.description)}</p>${link}<a class="material-link" href="${document.source}" target="_blank" rel="noopener">Consultar fuente oficial ↗</a></article>`;
  }).join('');
}

function gsiRenderTestSelect() {
  $gsi('#gsi-test-year').innerHTML = '<option value="all">Todos los exámenes disponibles</option>'
    + GSI_DATA.testExams.map(exam => `<option value="${exam.year}">Examen ${exam.year}${exam.answerTemplate ? ' · con plantilla' : ''}</option>`).join('');
}

const gsiExamCache = new Map();
let gsiQuiz = { questions: [], index: 0, right: 0, wrong: 0, ungraded: 0, selection: 'all' };

async function gsiLoadExam(exam) {
  if (gsiExamCache.has(exam.year)) return gsiExamCache.get(exam.year);
  const response = await fetch(new URL(encodeURI(exam.path), location.href));
  if (!response.ok) throw new Error(`No se pudo cargar el examen ${exam.year}: HTTP ${response.status}`);
  const records = await response.json();
  if (!Array.isArray(records)) throw new Error(`El archivo JSON del examen ${exam.year} no tiene el formato esperado`);
  const questions = records.map(record => {
    const letters = ['a', 'b', 'c', 'd'];
    const options = letters.map(letter => record.opciones?.[letter]);
    if (!Number.isInteger(record.numero) || typeof record.pregunta !== 'string'
      || options.some(option => typeof option !== 'string')) {
      throw new Error(`Pregunta no válida en el examen ${exam.year}`);
    }
    const answer = typeof record.respuesta_correcta === 'string'
      ? record.respuesta_correcta.toLowerCase()
      : '';
    return {
      id: `${exam.year}-${record.numero}`,
      year: exam.year,
      number: record.numero,
      question: record.pregunta,
      options,
      correct: letters.indexOf(answer) >= 0 ? letters.indexOf(answer) : null,
      annulled: answer === 'anulada',
      explanation: record.explicacion || '',
      source: exam.answerTemplate || record.fuente_oficial || null
    };
  });
  gsiExamCache.set(exam.year, questions);
  return questions;
}

function gsiShuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
  }
  return shuffled;
}

function gsiTestSourceHtml(exams, questions) {
  const links = exams.map(exam => {
    const answerLink = exam.answerTemplate
      ? `<a class="material-link" href="${encodeURI(exam.answerTemplate)}" target="_blank" rel="noopener">Plantilla definitiva ${exam.year} ↗</a>`
      : '';
    const sourceLink = exam.source
      ? `<a class="material-link" href="${exam.source}" target="_blank" rel="noopener">INAP ${exam.year} ↗</a>`
      : '';
    return `<span>${exam.year} · ${questions.filter(question => question.year === exam.year).length} preguntas</span>${answerLink}${sourceLink}`;
  }).join('');
  const scored = questions.filter(question => question.correct !== null).length;
  return `${links}<span>${questions.length} preguntas cargadas · ${scored} con respuesta puntuable</span>`;
}

async function gsiStartTest() {
  const startButton = $gsi('#gsi-start-test');
  const area = $gsi('#gsi-quiz-area');
  const selection = $gsi('#gsi-test-year').value;
  const exams = selection === 'all'
    ? GSI_DATA.testExams
    : GSI_DATA.testExams.filter(exam => exam.year === selection);
  startButton.disabled = true;
  area.innerHTML = '<div class="panel">Cargando el cuestionario…</div>';
  $gsi('#gsi-quiz-source').innerHTML = '';
  try {
    if (!exams.length) throw new Error(`No hay cuestionario disponible para ${selection}`);
    const questionSets = await Promise.all(exams.map(gsiLoadExam));
    const pool = gsiShuffle(questionSets.flat());
    const size = $gsi('#gsi-test-size').value;
    gsiQuiz = {
      questions: pool.slice(0, size === 'all' ? pool.length : Number(size)),
      index: 0,
      right: 0,
      wrong: 0,
      ungraded: 0,
      selection
    };
    $gsi('#gsi-quiz-source').innerHTML = gsiTestSourceHtml(exams, gsiQuiz.questions);
    if (!gsiQuiz.questions.length) throw new Error('Los archivos seleccionados no contienen preguntas');
    gsiRenderQuestion();
  } catch (error) {
    console.error('No se pudo iniciar el test GSI:', error);
    area.innerHTML = `<div class="feedback bad"><strong>No se pudo cargar el test</strong><p>${gsiEscape(error.message)}</p></div>`;
  } finally {
    startButton.disabled = false;
  }
}

function gsiRenderQuestion() {
  window.stopQuizSpeech();
  const area = $gsi('#gsi-quiz-area');
  if (gsiQuiz.index >= gsiQuiz.questions.length) {
    area.innerHTML = `<div class="result-card panel"><span class="stat-icon green">✓</span><h2>Test terminado</h2><p>Has acertado <strong>${gsiQuiz.right}</strong> y fallado <strong>${gsiQuiz.wrong}</strong> preguntas.${gsiQuiz.ungraded ? ` ${gsiQuiz.ungraded} se han practicado sin puntuación por no tener plantilla o estar anuladas.` : ''}</p><button class="primary-button" id="gsi-test-again">Hacer otro test →</button></div>`;
    $gsi('#gsi-test-again').addEventListener('click', gsiStartTest);
    return;
  }

  const question = gsiQuiz.questions[gsiQuiz.index];
  area.innerHTML = `<div class="quiz-card panel">
    <div class="quiz-meta"><span>EXAMEN ${question.year} · PREGUNTA ${question.number} · ${gsiQuiz.index + 1} / ${gsiQuiz.questions.length}</span><span>${question.correct === null ? (question.annulled ? 'ANULADA' : 'SIN PLANTILLA') : 'CON PLANTILLA'}</span></div>
    <div class="quiz-progress"><span style="width:${(gsiQuiz.index + 1) / gsiQuiz.questions.length * 100}%"></span></div>
    <div class="quiz-question"><h2>${gsiEscape(question.question)}</h2><div class="quiz-speech-controls"><button class="secondary-button read-question" type="button" data-read-question aria-pressed="false" ${window.quizSpeechAvailable() ? '' : 'disabled title="La lectura en voz alta no está disponible en este navegador"'}>🔊 Escuchar pregunta y respuestas</button><label class="quiz-speech-rate">Velocidad<select data-quiz-speech-rate aria-label="Velocidad de lectura">${[[0.75, '0,75×'], [1, '1×'], [1.25, '1,25×'], [1.5, '1,5×'], [1.75, '1,75×'], [2, '2×']].map(([rate, label]) => `<option value="${rate}" ${window.quizSpeechRate === rate ? 'selected' : ''}>${label}</option>`).join('')}</select></label></div></div>
    <div class="answers">${question.options.map((option, index) => `<button class="answer" data-gsi-answer="${index}"><b>${String.fromCharCode(65 + index)}</b>${gsiEscape(option)}</button>`).join('')}</div>
    <div class="feedback-slot"></div>
    <div class="quiz-actions"><button class="secondary-button" id="gsi-next-question" disabled>${gsiQuiz.index + 1 === gsiQuiz.questions.length ? 'Ver resultado' : 'Siguiente pregunta →'}</button></div>
  </div>`;
  area.querySelectorAll('[data-gsi-answer]').forEach(button => {
    button.addEventListener('click', () => gsiRespond(question, Number(button.dataset.gsiAnswer), area));
  });
  $gsi('#gsi-next-question').addEventListener('click', () => {
    gsiQuiz.index++;
    gsiRenderQuestion();
  });
}

function gsiRespond(question, choice, area) {
  area.querySelectorAll('.answer').forEach(button => { button.disabled = true; });
  const feedback = area.querySelector('.feedback-slot');
  if (question.correct === null) {
    gsiQuiz.ungraded++;
    const message = question.annulled
      ? 'Pregunta anulada según la plantilla oficial.'
      : 'No se dispone de plantilla de respuestas para esta pregunta.';
    feedback.innerHTML = `<div class="feedback"><strong>Pregunta sin puntuación</strong><p>${gsiEscape(question.explanation || message)}</p>${question.source ? `<a href="${encodeURI(question.source)}" target="_blank" rel="noopener">Consultar plantilla o fuente ↗</a>` : ''}</div>`;
  } else {
    const isCorrect = choice === question.correct;
    if (isCorrect) gsiQuiz.right++;
    else gsiQuiz.wrong++;
    area.querySelectorAll('.answer').forEach((button, index) => {
      if (index === question.correct) button.classList.add('correct');
      else if (index === choice) button.classList.add('incorrect');
    });
    feedback.innerHTML = `<div class="feedback ${isCorrect ? 'good' : 'bad'}"><strong>${isCorrect ? '¡Correcto!' : 'Respuesta incorrecta'}</strong><p>${gsiEscape(question.explanation)} Respuesta: ${String.fromCharCode(65 + question.correct)}.</p>${question.source ? `<a href="${encodeURI(question.source)}" target="_blank" rel="noopener">Consultar plantilla oficial ↗</a>` : ''}</div>`;
  }
  $gsi('#gsi-next-question').disabled = false;
}

document.querySelectorAll('[data-gsi-view]').forEach(button => {
  button.addEventListener('click', () => gsiView(button.dataset.gsiView));
});
document.querySelectorAll('[data-gsi-go]').forEach(button => {
  button.addEventListener('click', () => gsiView(button.dataset.gsiGo));
});
$gsi('#opposition-switch-gsi').addEventListener('change', event => {
  const destinations = {
    gva: 'index.html',
    age: 'age.html',
    valencia: 'valencia.html',
    'gsi-age': 'gsi-age.html'
  };
  window.location.href = destinations[event.target.value];
});
$gsi('#gsi-start-test').addEventListener('click', gsiStartTest);

gsiRenderTopics();
gsiRenderExams();
gsiRenderDocuments();
gsiRenderTestSelect();
gsiRenderStats();
