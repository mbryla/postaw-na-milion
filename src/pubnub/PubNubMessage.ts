import { AdminState } from '../state/AdminState';
import { GameState } from '../state/GameState';

export type Message =
  | AdminStateUpdate
  | GameStateUpdate
  | StartTimer
  | StopTimer
  | ResetTimer30
  | ResetTimer60;

export interface AdminStateUpdate {
  type: 'admin-state-update';
  state: AdminState;
}

export interface GameStateUpdate {
  type: 'game-state-update';
  state: GameState;
}

export interface StartTimer {
  type: 'start-timer';
}

export interface StopTimer {
  type: 'stop-timer';
}

export interface ResetTimer60 {
  type: 'reset-timer-60';
}
export interface ResetTimer30 {
  type: 'reset-timer-30';
}
