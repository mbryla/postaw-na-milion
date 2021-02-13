export interface GameStateShowTitle {
  type: 'game-state-show-title';
}

export interface GameStateShowStatus {
  type: 'game-state-show-status';
  answeredQuestionsCount: number;
  totalQuestionsCount: number;
}

export interface GameStateShowCategories {
  type: 'game-state-show-categories';
  categories: Array<string>;
}

export interface GameStateShowQuestion {
  type: 'game-state-show-question';
  question?: string;
  answers: Array<string>;
  selectedAnswers: Array<boolean>;
  correctAnswerIndex?: number;
}

export type GameState =
  | GameStateShowTitle
  | GameStateShowStatus
  | GameStateShowCategories
  | GameStateShowQuestion;

export const defaultGameState: GameState = { type: 'game-state-show-title' };
