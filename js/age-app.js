const AGE_KEY='opogva-progress-age-v1';
const AGE_PROGRAM='https://boe.es/buscar/doc.php?id=BOE-A-2025-26262';
const agePdf={
 '2008':'EXAMEN_AUXADMAGE_2008.pdf','2009':'EXAMEN_AUXADMAGE_2009.pdf',
 '2018-A':'EXAMEN_AUXADMAGE_2018_A.pdf','2018-B':'EXAMEN_AUXADMAGE_2018_B.pdf',
 '2019':'EXAMEN_AUXADMAGE_2019.pdf','2022':'EXAMEN_AUXADMAGE_2022.pdf',
 '2024-A':'EXAMEN_AUXADMAGE_2024_A.pdf','2024-B':'EXAMEN_AUXADMAGE_2024_B.pdf',
 '2025-A':'EXAMEN_AUXADMAGE_2025_A.pdf','2025-B':'EXAMEN_AUXADMAGE_2025_B.pdf'
};
const ageTopics=[
['Organización pública',[
'Constitución Española: principios, derechos y garantías.',
'Tribunal Constitucional, reforma constitucional y Corona.',
'Cortes Generales y Defensor del Pueblo.',
'Poder Judicial y organización judicial española.',
'Gobierno y Administración General del Estado.',
'Gobierno abierto, Agenda 2030 y Objetivos de Desarrollo Sostenible.',
'Transparencia, acceso a la información y buen gobierno.',
'Órganos centrales y territoriales de la Administración del Estado.',
'Organización territorial: comunidades autónomas y administración local.',
'Instituciones y funcionamiento de la Unión Europea.',
'Procedimiento administrativo, régimen jurídico y recursos.',
'Protección de datos personales.',
'Personal funcionario: selección, provisión y situaciones administrativas.',
'Derechos, deberes, carrera y retribuciones del personal funcionario.',
'Presupuestos Generales del Estado y ciclo presupuestario.',
'Igualdad, diversidad, discapacidad y dependencia.'
]],
['Actividad administrativa y ofimática',[
'Atención al público y atención a personas con discapacidad.',
'Información administrativa, iniciativas, quejas y reclamaciones.',
'Documentos, registros y archivos.',
'Administración electrónica y servicios a la ciudadanía.',
'Informática básica, hardware, software y seguridad.',
'Entorno Windows 11 y sus elementos principales.',
'Explorador de Windows, carpetas, archivos y búsquedas.',
'Procesador de textos Word 365.',
'Hojas de cálculo Excel 365.',
'Bases de datos Access 365.',
'Correo electrónico Outlook 365.',
'Internet, protocolos, servicios y navegadores.'
]]
].flatMap(([block,titles])=>titles.map((title,index)=>({n:index+1+(block==='Actividad administrativa y ofimática'?16:0),block,title})));
const $age=s=>document.querySelector(s);
const ageFresh=()=>({topicProgress:{},wrong:[],stats:{answered:0,correct:0}});
function ageState(){try{return {...ageFresh(),...JSON.parse(localStorage.getItem(AGE_KEY)||'{}')}}catch{return ageFresh()}}
function ageSave(s){localStorage.setItem(AGE_KEY,JSON.stringify(s));ageRenderStats()}
function ageView(name){document.querySelectorAll('.view').forEach(x=>x.classList.remove('active-view'));$age(`#age-view-${name}`).classList.add('active-view');document.querySelectorAll('[data-age-view]').forEach(x=>x.classList.toggle('active',x.dataset.ageView===name));if(name==='fallos')ageRenderReview();window.scrollTo({top:0,behavior:'smooth'})}
document.querySelectorAll('[data-age-view]').forEach(button=>button.addEventListener('click',()=>ageView(button.dataset.ageView)));
document.querySelectorAll('[data-age-go]').forEach(button=>button.addEventListener('click',()=>ageView(button.dataset.ageGo)));
$age('#opposition-switch-age').addEventListener('change',event=>{if(event.target.value==='gva')window.location.href='index.html'});
function ageProgress(s,n){return s.topicProgress?.[n]||{status:'pending',rating:0}}
function ageRenderStats(){const s=ageState(),done=ageTopics.filter(t=>ageProgress(s,t.n).status==='done').length;$age('#age-topics-done').textContent=done;$age('#age-topic-progress').style.width=`${done/ageTopics.length*100}%`;$age('#age-answered-count').textContent=s.stats.answered;$age('#age-correct-count').textContent=s.stats.correct;$age('#age-missed-count').textContent=s.wrong.length;$age('#age-error-badge').textContent=s.wrong.length;const pending=ageTopics.filter(t=>ageProgress(s,t.n).status!=='done');$age('#age-remaining').innerHTML=pending.length?`<p>Te quedan <strong>${pending.length} temas</strong> por completar:</p><ul>${pending.slice(0,6).map(t=>`<li>Tema ${String(t.n).padStart(2,'0')} · ${t.title} <span>${ageProgress(s,t.n).status==='progress'?'En curso':'Pendiente'}</span></li>`).join('')}</ul>${pending.length>6?`<small>y ${pending.length-6} más</small>`:''}`:'<p class="all-topics-done">✓ Has completado todos los temas.</p>'}
function ageRenderTopics(){const s=ageState();$age('#age-topic-list').innerHTML=ageTopics.map(t=>{const p=ageProgress(s,t.n);return `<article class="topic-card age-topic"><div class="age-topic-heading"><span class="topic-number">${String(t.n).padStart(2,'0')}</span><div class="topic-title"><small>${t.block.toUpperCase()}</small><strong>${t.title}</strong></div></div><div class="study-controls"><label>Progreso<select data-age-status="${t.n}"><option value="pending" ${p.status==='pending'?'selected':''}>Pendiente</option><option value="progress" ${p.status==='progress'?'selected':''}>En curso</option><option value="done" ${p.status==='done'?'selected':''}>Estudiado</option></select></label><label>Autoevaluación<select data-age-rating="${t.n}"><option value="0" ${!p.rating?'selected':''}>Sin valorar</option><option value="1" ${p.rating===1?'selected':''}>1 · Inicial</option><option value="2" ${p.rating===2?'selected':''}>2 · Básico</option><option value="3" ${p.rating===3?'selected':''}>3 · En progreso</option><option value="4" ${p.rating===4?'selected':''}>4 · Buen dominio</option><option value="5" ${p.rating===5?'selected':''}>5 · Lo domino</option></select></label></div><a class="age-program-link" href="${AGE_PROGRAM}" target="_blank" rel="noopener">Consultar programa oficial en el BOE ↗</a></article>`}).join('');const save=(n,changes)=>{const st=ageState();st.topicProgress[n]={...ageProgress(st,n),...changes};ageSave(st);ageRenderTopics()};document.querySelectorAll('[data-age-status]').forEach(el=>el.addEventListener('change',()=>save(Number(el.dataset.ageStatus),{status:el.value})));document.querySelectorAll('[data-age-rating]').forEach(el=>el.addEventListener('change',()=>save(Number(el.dataset.ageRating),{rating:Number(el.value)})))}
function agePdfUrl(key){return encodeURI(`OPOSICIONES/AUX ADM AGE/EXAMENES/${agePdf[key]}`)}
function ageExamOptions(){return Object.keys(agePdf).map(key=>({key,label:`Examen ${key.replace('-',' · Modelo ')}`}))}
function fillAgeExamSelect(select){select.innerHTML='<option value="all">Todos los exámenes · 2008–2025</option>'+ageExamOptions().map(x=>`<option value="${x.key}">${x.label}</option>`).join('')}
fillAgeExamSelect($age('#age-test-exam'));fillAgeExamSelect($age('#age-exam-select'));
function agePool(selection){const keys=selection==='all'?Object.keys(agePdf):[selection];return keys.flatMap(key=>(window.agePastExams?.[key]||[]).map((q,index)=>{const letters=Object.keys(q.options||{}),opts=letters.map(letter=>q.options[letter]),correct=letters.indexOf(q.correct);return {id:`age-${key}-${q.section}-${q.number}-${index}`,n:q.number,number:q.number,year:key,section:q.section,q:q.question,opts,correct:correct<0?null:correct,why:q.explanation|| (correct<0?'El JSON de este examen no contiene plantilla de respuestas.':'Respuesta indicada en el JSON del examen.'),source:[`PDF del examen ${key}`,agePdfUrl(key)]}}).filter(q=>q.opts.length>=2))}
let ageQuestions=[],ageIndex=0,ageSession={right:0,wrong:0,ungraded:0},ageTarget='#age-quiz-area';
function ageStart(selection,size,target,sourceTarget){ageTarget=target;const pool=agePool(selection);ageQuestions=pool.slice(0,size==='all'?pool.length:Number(size));ageIndex=0;ageSession={right:0,wrong:0,ungraded:0};const years=selection==='all'?Object.keys(agePdf):[selection];$age(sourceTarget).innerHTML=years.map(key=>`<a class="material-link" href="${agePdfUrl(key)}" target="_blank" rel="noopener">PDF ${key} ↗</a>`).join(' ')+`<span>${pool.length} preguntas · ${pool.filter(q=>q.correct!==null).length} con plantilla</span>`;ageRenderQuestion()}
function ageRenderQuestion(){const area=$age(ageTarget);if(ageIndex>=ageQuestions.length){area.innerHTML=`<div class="result-card panel"><span class="stat-icon green">✓</span><h2>Test terminado</h2><p>Has acertado <strong>${ageSession.right}</strong> y fallado <strong>${ageSession.wrong}</strong> preguntas.${ageSession.ungraded?` ${ageSession.ungraded} no tenían plantilla y no se han puntuado.`:''}</p><button class="primary-button" id="age-again">Hacer otro test →</button></div>`;$age('#age-again').addEventListener('click',()=>ageStart($age(ageTarget==='#age-quiz-area'?'#age-test-exam':'#age-exam-select').value,$age(ageTarget==='#age-quiz-area'?'#age-test-size':'#age-exam-size').value,ageTarget,ageTarget==='#age-quiz-area'?'#age-quiz-source':'#age-exam-source'));return}const q=ageQuestions[ageIndex];area.innerHTML=`<div class="quiz-card panel"><div class="quiz-meta"><span>${q.year} · ${q.section} · PREGUNTA ${q.number} / ${ageQuestions.length}</span><span>${q.correct===null?'SIN PLANTILLA':'CON PLANTILLA'}</span></div><div class="quiz-progress"><span style="width:${(ageIndex+1)/ageQuestions.length*100}%"></span></div><h2>${q.q}</h2><div class="answers">${q.opts.map((answer,i)=>`<button class="answer" data-age-answer="${i}"><b>${String.fromCharCode(65+i)}</b>${answer}</button>`).join('')}</div><div class="feedback-slot"></div><div class="quiz-actions"><button class="secondary-button" id="age-next" disabled>${ageIndex+1===ageQuestions.length?'Ver resultado':'Siguiente pregunta →'}</button></div></div>`;area.querySelectorAll('[data-age-answer]').forEach(button=>button.addEventListener('click',()=>ageRespond(q,Number(button.dataset.ageAnswer),area)));$age('#age-next').addEventListener('click',()=>{ageIndex++;ageRenderQuestion()})}
function ageRespond(q,choice,area){area.querySelectorAll('.answer').forEach(b=>b.disabled=true);if(q.correct===null){ageSession.ungraded++;area.querySelector('.feedback-slot').innerHTML=`<div class="feedback"><strong>Pregunta practicada, sin puntuación</strong><p>${q.why}</p><a href="${q.source[1]}" target="_blank" rel="noopener">Abrir PDF original ↗</a></div>`;$age('#age-next').disabled=false;return}const s=ageState(),ok=choice===q.correct;s.stats.answered++;if(ok){s.stats.correct++;ageSession.right++;s.wrong=s.wrong.filter(x=>x.id!==q.id)}else{ageSession.wrong++;if(!s.wrong.some(x=>x.id===q.id))s.wrong.push(q)}s.answers=s.answers||{};s.answers[q.id]=choice;ageSave(s);area.querySelectorAll('.answer').forEach((b,i)=>{if(i===q.correct)b.classList.add('correct');else if(i===choice)b.classList.add('incorrect')});area.querySelector('.feedback-slot').innerHTML=`<div class="feedback ${ok?'good':'bad'}"><strong>${ok?'¡Correcto!':'Respuesta incorrecta'}</strong><p>${q.why} Respuesta: ${String.fromCharCode(65+q.correct)}.</p><a href="${q.source[1]}" target="_blank" rel="noopener">Abrir PDF original ↗</a>${ok?'':'<small>Se ha añadido a Repasar fallos.</small>'}</div>`;$age('#age-next').disabled=false}
function ageRenderReview(){const area=$age('#age-review-area'),s=ageState();if(!s.wrong.length){area.innerHTML='<div class="empty-review panel"><span>✦</span><h2>¡Todo al día!</h2><p>Los fallos de preguntas con plantilla aparecerán aquí.</p></div>';return}area.innerHTML=s.wrong.map(q=>`<article class="review-card panel"><div class="quiz-meta"><span>EXAMEN ${q.year} · PREGUNTA ${q.number}</span><span>REPASO PENDIENTE</span></div><h2>${q.q}</h2><div class="answers">${q.opts.map((a,i)=>`<button class="answer" data-age-review="${q.id}" data-answer="${i}">${String.fromCharCode(65+i)}. ${a}</button>`).join('')}</div><div class="review-feedback" id="age-review-${q.id}"></div><p>${q.why}</p><a class="material-link" href="${q.source[1]}" target="_blank" rel="noopener">${q.source[0]} ↗</a></article>`).join('');document.querySelectorAll('[data-age-review]').forEach(button=>button.addEventListener('click',()=>{const st=ageState(),q=st.wrong.find(x=>x.id===button.dataset.ageReview),choice=Number(button.dataset.answer),ok=choice===q.correct;document.querySelectorAll(`[data-age-review="${q.id}"]`).forEach((el,i)=>{el.disabled=true;if(i===q.correct)el.classList.add('correct');else if(i===choice)el.classList.add('incorrect')});if(ok){st.wrong=st.wrong.filter(x=>x.id!==q.id);ageSave(st);$age(`#age-review-${q.id}`).innerHTML='<p class="feedback good">¡Bien! Fallo repasado.</p>';setTimeout(ageRenderReview,700)}else $age(`#age-review-${q.id}`).innerHTML='<p class="feedback bad">Revisa la opción correcta y vuelve a intentarlo.</p>'}))}
$age('#age-start-test').addEventListener('click',()=>ageStart($age('#age-test-exam').value,$age('#age-test-size').value,'#age-quiz-area','#age-quiz-source'));
$age('#age-start-exam').addEventListener('click',()=>ageStart($age('#age-exam-select').value,$age('#age-exam-size').value,'#age-exam-area','#age-exam-source'));
ageRenderTopics();ageRenderStats();
