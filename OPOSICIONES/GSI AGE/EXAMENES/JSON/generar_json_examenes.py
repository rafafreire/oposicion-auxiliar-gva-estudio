import json
import re
from pathlib import Path


DIRECTORY = Path(__file__).resolve().parent
QUESTION_PATTERN = re.compile(r'^\*\*(\d+)\.\*\*\s*(.*?)\s*$')
OPTION_PATTERN = re.compile(r'^([a-dA-D])\)\s*(.*?)\s*$')
KEYS_FILE = DIRECTORY / 'PLANTILLAS_OFICIALES_GSI.json'


def clean_text(parts):
    text = ' '.join(part for part in parts if part)
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
    return re.sub(r'\s+', ' ', text.replace('\xa0', ' ')).strip()


def parse_exam(path):
    questions = []
    current = None
    active_option = None

    def finish_question():
        if current is not None:
            questions.append(current)

    for raw_line in path.read_text(encoding='utf-8-sig').replace('\r', '').splitlines():
        line = raw_line.replace('\xa0', ' ').strip()
        question_match = QUESTION_PATTERN.match(line)
        if question_match:
            finish_question()
            current = {
                'numero': int(question_match.group(1)),
                'question_parts': [question_match.group(2)],
                'option_parts': {}
            }
            active_option = None
            continue

        option_match = OPTION_PATTERN.match(line)
        if option_match and current is not None:
            option = option_match.group(1).lower()
            if option in current['option_parts']:
                raise ValueError(f'{path.name}: opción {option} repetida en la pregunta {current["numero"]}')
            current['option_parts'][option] = [option_match.group(2)]
            active_option = option
            continue

        if line and current is not None:
            if active_option is None:
                current['question_parts'].append(line)
            else:
                current['option_parts'][active_option].append(line)

    finish_question()
    if not questions:
        raise ValueError(f'{path.name}: no se encontraron preguntas')

    output = []
    for expected_number, question in enumerate(questions, start=1):
        if question['numero'] != expected_number:
            raise ValueError(f'{path.name}: se esperaba la pregunta {expected_number}, se encontró {question["numero"]}')
        if set(question['option_parts']) != {'a', 'b', 'c', 'd'}:
            raise ValueError(f'{path.name}: opciones incompletas en la pregunta {question["numero"]}')
        output.append({
            'numero': question['numero'],
            'pregunta': clean_text(question['question_parts']),
            'opciones': {
                option: clean_text(question['option_parts'][option])
                for option in ('a', 'b', 'c', 'd')
            }
        })
    return output


def answer_for(question_number, answer_key):
    if answer_key is None:
        return None
    if answer_key.get('estructura') == 'bloques_50':
        if question_number <= 50:
            block, block_question = 'I y II', question_number
        elif question_number <= 100:
            block, block_question = 'III', question_number - 50
        else:
            block, block_question = 'IV', question_number - 100
        return answer_key['respuestas_por_bloque'][block].get(str(block_question))
    answers = answer_key['respuestas'] if question_number <= 100 else answer_key['reserva']
    answer_number = question_number if question_number <= 100 else question_number - 100
    return answers.get(str(answer_number))


def add_answer_data(questions, year, official_keys):
    answer_key = official_keys.get(year)
    source = answer_key['fuente_oficial'] if answer_key else None
    output = []
    for question in questions:
        answer = answer_for(question['numero'], answer_key)
        if answer == 'ANULADA':
            explanation = 'Pregunta anulada según la plantilla definitiva del INAP; no se puntúa.'
        elif answer:
            explanation = f'Plantilla definitiva del INAP: respuesta {answer}.'
        else:
            explanation = 'No se dispone de plantilla de respuestas para esta pregunta; se muestra sin puntuación automática.'
        output.append({
            **question,
            'respuesta_correcta': answer.title() if answer == 'ANULADA' else answer.lower() if answer else None,
            'explicacion': explanation,
            'tema_numero': None,
            'fuente_oficial': source
        })
    return output


def main():
    official_keys = json.loads(KEYS_FILE.read_text(encoding='utf-8'))
    sources = sorted(DIRECTORY.glob('EXAMEN GSI *.md'), key=lambda path: int(path.stem.rsplit(' ', 1)[1]))
    if not sources:
        raise FileNotFoundError(f'No se encontraron fuentes markdown en {DIRECTORY}')

    total_questions = 0
    for source in sources:
        year = source.stem.rsplit(' ', 1)[1]
        questions = add_answer_data(parse_exam(source), year, official_keys)
        destination = DIRECTORY / f'EXAMEN_GSI_{year}.json'
        destination.write_text(json.dumps(questions, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        total_questions += len(questions)
        scored = sum(question['respuesta_correcta'] in {'a', 'b', 'c', 'd'} for question in questions)
        print(f'{destination.name}: {len(questions)} preguntas; {scored} puntuables')
    print(f'Total: {total_questions} preguntas en {len(sources)} exámenes.')


if __name__ == '__main__':
    main()
