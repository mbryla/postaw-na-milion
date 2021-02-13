export interface Question {
  id: string;
  text: string;
  answers: Array<string>;
  correctAnswerIndex: number;
  possibleCategories: Array<string>;
  shouldBeAskedLast?: boolean;
}

export type QuestionsById = Record<string, Question>;
