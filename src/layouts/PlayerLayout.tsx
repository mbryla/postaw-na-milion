import React, { useState } from 'react';

import { useListener } from '../pubnub/useListener';
import { defaultGameState, GameState } from '../state/GameState';
import { useInterval } from '../useInterval';

import { CategoriesLayout } from './CategoriesLayout';
import { QuestionLayout } from './QuestionLayout';
import { StatusLayout } from './StatusLayout';
import { TitleLayout } from './TitleLayout';

const DEFAULT_TIME_MS = 60 * 1000;
const TIME_STEP_MS = 1000;

export const PlayerLayout = () => {
  const [state, setState] = useState<GameState>(defaultGameState);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [time, setTime] = useState<number>(DEFAULT_TIME_MS);

  useListener((message) => {
    if (message.type === 'game-state-update') {
      setState(message.state);
    } else if (message.type === 'reset-timer-60') {
      setTime(DEFAULT_TIME_MS);
    } else if (message.type === 'reset-timer-30') {
      setTime(DEFAULT_TIME_MS / 2);
    } else if (message.type === 'start-timer') {
      setIsTimerRunning(true);
    } else if (message.type === 'stop-timer') {
      setIsTimerRunning(false);
    }
  });

  useInterval(
    () => {
      setTime((time) => time - TIME_STEP_MS);
    },
    isTimerRunning && time > 0 ? TIME_STEP_MS : undefined
  );

  return (
    <div
      style={{
        width: '100wh',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        background: 'linear-gradient(to right, #0575e6, #021b79)',
        fontSize: '2em',
      }}
    >
      {state.type === 'game-state-show-title' && <TitleLayout />}
      {state.type === 'game-state-show-status' && (
        <StatusLayout
          answeredQuestionsCount={state.answeredQuestionsCount}
          totalQuestionsCount={state.totalQuestionsCount}
        />
      )}
      {state.type === 'game-state-show-categories' && (
        <CategoriesLayout categories={state.categories} />
      )}
      {state.type === 'game-state-show-question' && (
        <QuestionLayout
          question={state.question}
          answers={state.answers}
          selectedAnswers={state.selectedAnswers}
          correctAnswerIndex={state.correctAnswerIndex}
          time={state.question ? time : undefined}
        />
      )}
    </div>
  );
};
