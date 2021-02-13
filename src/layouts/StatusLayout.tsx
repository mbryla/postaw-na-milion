import { FC } from 'react';
import { Block } from './QuestionLayout';

interface StatusLayoutProps {
  answeredQuestionsCount: number;
  totalQuestionsCount: number;
}

export const StatusLayout: FC<StatusLayoutProps> = ({
  answeredQuestionsCount,
  totalQuestionsCount,
}) => {
  return (
    <Block>
      odpowiedziano na {answeredQuestionsCount === totalQuestionsCount ? totalQuestionsCount : answeredQuestionsCount} z {totalQuestionsCount} pytań
    </Block>
  );
};
