import { Question, QuestionsById } from './Question';

export interface AdminStateEmpty {
  type: 'admin-state-empty';
}

export interface AdminStateBase {
  type: 'admin-state-base';
  questionsSelectionMode: 'manual' | 'automatic';
  usedQuestions: Array<string>;
  usedCategories: Array<string>;
  answeredQuestionsCount: number;
  questionsById: QuestionsById;
  roundState: RoundState;
}

export interface RoundStateEmpty {
  type: 'round-state-empty';
}

export interface RoundStatePickQuestions {
  type: 'round-state-pick-questions';
  pickedQuestionsIds: Array<string>;
}

export interface RoundStateSelectCategory {
  type: 'round-state-select-category';
  firstQuestion: Question;
  firstQuestionCategory: string;
  secondQuestion: Question;
  secondQuestionCategory: string;
}

export interface RoundStateShowQuestion {
  type: 'round-state-show-question';
  question: Question;
}

export interface RoundStateSelectAnswers {
  type: 'round-state-select-answers';
  question: Question;
}

export type RoundState =
  | RoundStateEmpty
  | RoundStatePickQuestions
  | RoundStateSelectCategory
  | RoundStateShowQuestion
  | RoundStateSelectAnswers;

export const defaultRoundState: RoundState = { type: 'round-state-empty' };

export type AdminState = AdminStateEmpty | AdminStateBase;

export const defaultAdminState: AdminState = { type: 'admin-state-empty' };
