import { FC } from 'react';
import { AdminState } from '../state/AdminState';

import { Question } from '../state/Question';

interface QuestionsProps {
  adminState: AdminState;
  changeAdminState: (AdminState: AdminState) => void;
  questions: Array<Question>;
  usedQuestions: Array<string>;
  usedCategories: Array<string>;
}

export const Questions: FC<QuestionsProps> = ({
  questions,
  usedQuestions,
  usedCategories,
  adminState,
  changeAdminState,
}) => {
  return (
    <div>
      <h1>Wczytane pytania ({questions.length})</h1>
      <ul>
        {questions.map((question) => {
          const isQuestionUsed = usedQuestions.includes(question.id);
          const showCheckbox =
            adminState.type === 'admin-state-base' &&
            adminState.questionsSelectionMode === 'manual' &&
            adminState.roundState.type === 'round-state-pick-questions';
          const isQuestionSelected =
            showCheckbox &&
            adminState.type === 'admin-state-base' &&
            adminState.roundState.type === 'round-state-pick-questions' &&
            adminState.roundState.pickedQuestionsIds.includes(question.id);

          const selectQuestion = () => {
            if (
              adminState.type === 'admin-state-base' &&
              adminState.roundState.type === 'round-state-pick-questions'
            ) {
              const pickedQuestionsIds = [
                ...adminState.roundState.pickedQuestionsIds,
              ];
              const thisQuestionIndex = pickedQuestionsIds.findIndex(
                (id) => id === question.id
              );
              if (thisQuestionIndex > -1) {
                pickedQuestionsIds.splice(thisQuestionIndex, 1);
              } else {
                pickedQuestionsIds.push(question.id);
              }

              changeAdminState({
                questionsById: adminState.questionsById,
                answeredQuestionsCount: adminState.answeredQuestionsCount,
                usedCategories: adminState.usedCategories,
                usedQuestions: adminState.usedQuestions,
                questionsSelectionMode: adminState.questionsSelectionMode,
                type: 'admin-state-base',
                roundState: {
                  type: 'round-state-pick-questions',
                  pickedQuestionsIds,
                },
              });
            }
          };

          return (
            <li key={question.id}>
              {showCheckbox && !isQuestionUsed && (
                <input
                  type="checkbox"
                  style={{
                    width: '13px',
                    outline: '5px solid lightgreen',
                    backgroundColor: 'lightyellow',
                    marginRight: '10px',
                  }}
                  checked={isQuestionSelected}
                  onChange={selectQuestion}
                />
              )}
              <span
                style={{
                  textDecoration: isQuestionUsed ? 'line-through' : 'none',
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
          );
        })}
      </ul>
    </div>
  );
};
