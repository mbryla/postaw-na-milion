import { FC, ReactNode } from 'react';
import { Timer } from '../components/Timer';

interface BlockProps {
  children: ReactNode;
  isSelected?: boolean;
  isCorrect?: boolean;
}

export const Block: FC<BlockProps> = ({
  children,
  isSelected = false,
  isCorrect,
}) => {
  const color =
    isCorrect === undefined
      ? '#f1f1f1'
      : isCorrect
      ? 'lightgreen'
      : 'lightcoral';

  return (
    <div
      style={{
        margin: '20px',
        padding: '20px',
        backgroundColor: color,
        borderRadius: '8px',
        border: '2px solid gray',
        boxShadow: isSelected ? '0 0 7pt 7pt yellow' : 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {children}
    </div>
  );
};

export interface QuestionLayoutProps {
  question?: string;
  answers?: Array<string>;
  selectedAnswers?: Array<boolean>;
  correctAnswerIndex?: number;
  time?: number;
}

export const QuestionLayout: FC<QuestionLayoutProps> = ({
  question,
  answers,
  selectedAnswers,
  correctAnswerIndex,
  time,
}) => {
  return (
    <>
      {question && <Block>{question}</Block>}
      {answers && selectedAnswers && (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          {answers.map((answer, index) => {
            const isSelected = selectedAnswers[index];
            const isCorrect =
              correctAnswerIndex === undefined
                ? undefined
                : correctAnswerIndex === index;

            return (
              <Block key={answer} isSelected={isSelected} isCorrect={isCorrect}>
                {answer}
              </Block>
            );
          })}
        </div>
      )}
      {time !== undefined && (
        <Block isSelected={(time <= 10 * 1000 && time > 0) ? true : undefined} isCorrect={time === 0 ? false : undefined}>
          <Timer value={time} />
        </Block>
      )}
    </>
  );
};
