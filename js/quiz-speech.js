(() => {
  const buttonLabel = '🔊 Escuchar pregunta y respuestas';
  let activeButton = null;

  window.quizSpeechAvailable = () => Boolean(
    window.speechSynthesis && typeof window.SpeechSynthesisUtterance === 'function'
  );

  window.stopQuizSpeech = () => {
    if (!activeButton) return;
    activeButton.textContent = buttonLabel;
    activeButton.setAttribute('aria-pressed', 'false');
    activeButton = null;
    window.speechSynthesis?.cancel();
  };

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-read-question]');
    if (!button) return;

    const speech = window.speechSynthesis;
    if (!speech || typeof window.SpeechSynthesisUtterance !== 'function') return;
    if (activeButton === button) {
      window.stopQuizSpeech();
      return;
    }

    window.stopQuizSpeech();
    const card = button.closest('.quiz-card');
    const question = card?.querySelector('h2')?.textContent.trim();
    const answers = [...(card?.querySelectorAll('.answers .answer') || [])].map((answer, index) => {
      const label = answer.querySelector('b')?.textContent.trim() || String.fromCharCode(65 + index);
      const copy = answer.cloneNode(true);
      copy.querySelector('b')?.remove();
      return `Opción ${label}: ${copy.textContent.trim()}`;
    });

    if (!question || !answers.length) return;

    const utterance = new window.SpeechSynthesisUtterance(`${question}. ${answers.join('. ')}`);
    utterance.lang = 'es-ES';
    const spanishVoice = speech.getVoices().find(voice => /^es[-_]/i.test(voice.lang));
    if (spanishVoice) utterance.voice = spanishVoice;

    activeButton = button;
    button.textContent = '■ Detener lectura';
    button.setAttribute('aria-pressed', 'true');
    const resetButton = (failed = false) => {
      if (activeButton !== button) return;
      activeButton = null;
      button.textContent = failed ? 'No se pudo leer' : buttonLabel;
      button.setAttribute('aria-pressed', 'false');
    };
    utterance.onend = resetButton;
    utterance.onerror = () => resetButton(true);
    speech.speak(utterance);
  });
})();
