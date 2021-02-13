import { FC } from 'react';

import { Question } from '../state/Question';

interface QuestionsProps {
  questions: Array<Question>;
  usedQuestions: Array<string>;
  usedCategories: Array<string>;
}

export const Questions: FC<QuestionsProps> = ({
  questions,
  usedQuestions,
  usedCategories,
}) => {
  return (
    <div>
      <h1>Wczytane pytania ({questions.length})</h1>
      <ul>
        {questions.map((question) => (
          <li key={question.id}>
            <span
              style={{
                textDecoration: usedQuestions.includes(question.id)
                  ? 'line-through'
                  : 'none',
              }}
            >
              {question.text}
            </span>
            <ul>
              <li>
                kategorie:{' '}
                {question.possibleCategories
                  .filter(
                    (possibleCategory, index) =>
                      !usedCategories.includes(`${question.id}-${index}`)
                  )
                  .join(', ')}
              </li>
              <li>
                zużyte kategorie:{' '}
                <span style={{ textDecoration: 'line-through' }}>
                  {question.possibleCategories
                    .filter((possibleCategory, index) =>
                      usedCategories.includes(`${question.id}-${index}`)
                    )
                    .join(', ')}
                </span>
              </li>
              <li>odpowiedzi: {question.answers.join(', ')}</li>
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};
