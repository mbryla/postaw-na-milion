import { ChangeEvent, FC, KeyboardEvent, useState } from 'react';

import { Question, QuestionsById } from '../state/Question';
import { Button } from './Button';

interface QuestionsLoaderProps {
  onQuestionsLoad: (questions: QuestionsById) => void;
}

export const QuestionsLoader: FC<QuestionsLoaderProps> = ({
  onQuestionsLoad,
}) => {
  const [questionsJson, setQuestionsJson] = useState('');

  const loadQuestions = () => {
    const questionsArray = JSON.parse(questionsJson) as Array<Question>;

    const questionsById: Record<string, Question> = {};
    questionsArray.forEach(
      (question) => (questionsById[question.id] = question)
    );

    onQuestionsLoad(questionsById);
  };

  const handleQuestionsChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuestionsJson(event.target.value);
  };

  const handleQuestionsKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      loadQuestions();
    }
  };

  const handleQuestionsClick = () => {
    loadQuestions();
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <label htmlFor="questions">wczytaj pytania:</label>
      <input
        type="text"
        value={questionsJson}
        onChange={handleQuestionsChange}
        onKeyDown={handleQuestionsKeyDown}
        style={{ flexGrow: 1, margin: '0 10px' }}
      />
      <Button onClick={handleQuestionsClick} color="lightcoral">
        wczytaj
      </Button>
    </div>
  );
};
