import React, { FC, useState } from 'react';
import { Message } from '../pubnub/PubNubMessage';
import { useListener } from '../pubnub/useListener';

import { usePublisher } from '../pubnub/usePublisher';
import { Questions } from '../components/Questions';
import { Button } from '../components/Button';

import { defaultGameState, GameState } from '../state/GameState';
import {
  AdminState,
  defaultAdminState,
  defaultRoundState,
} from '../state/AdminState';
import { QuestionsLoader } from '../components/QuestionsLoader';

export const AdminLayout = () => {
  const [adminState, setAdminState] = useState<AdminState>(defaultAdminState);
  const [gameState, setGameState] = useState<GameState>(defaultGameState);
  const publish = usePublisher();

  useListener((message) => {
    if (message.type === 'admin-state-update') {
      setAdminState(message.state);
    } else if (message.type === 'game-state-update') {
      setGameState(message.state);
    }
  });

  const changeAdminState = (state: AdminState) => {
    publish({ type: 'admin-state-update', state });
  };

  const changeGameState = (state: GameState) => {
    publish({ type: 'game-state-update', state });
  };

  const send = (message: Message) => {
    publish(message)
      .then(() => {
        console.debug(`successfully sent "${message.type}" message`);
      })
      .catch((error) => {
        console.error(`failed to send "${message.type}" message`);
        console.debug(error);
      });
  };

  const startRound = () => {
    if (adminState.type === 'admin-state-base') {
      const questions = Object.values(adminState.questionsById);
      let unusedQuestions = questions
        .filter((question) => !adminState.usedQuestions.includes(question.id))
        .filter((question) => !question.shouldBeAskedLast);

      if (unusedQuestions.length === 0) {
        // use those which shouldBeAskedLast
        unusedQuestions = questions.filter(
          (question) => !adminState.usedQuestions.includes(question.id)
        );

        if (unusedQuestions.length === 0) {
          return;
        }
      }

      const manuallySelectedQuestions =
        adminState.roundState.type === 'round-state-pick-questions'
          ? adminState.roundState.pickedQuestionsIds
          : [];

      const firstQuestion =
        adminState.questionsSelectionMode === 'automatic'
          ? unusedQuestions[0]
          : adminState.questionsById[manuallySelectedQuestions[0]];
      const secondQuestion =
        adminState.questionsSelectionMode === 'automatic'
          ? unusedQuestions.length === 1
            ? firstQuestion
            : unusedQuestions[1]
          : manuallySelectedQuestions.length === 1
          ? firstQuestion
          : adminState.questionsById[manuallySelectedQuestions[1]];

      const firstQuestionCategoryIndex = firstQuestion.possibleCategories.findIndex(
        (cateogry, index) =>
          !adminState.usedCategories.includes(`${firstQuestion.id}-${index}`)
      );
      const firstQuestionCategory =
        firstQuestion.possibleCategories[firstQuestionCategoryIndex];
      const firstQuestionCategoryId = `${firstQuestion.id}-${firstQuestionCategoryIndex}`;

      const secondQuestionCategoryIndex = secondQuestion.possibleCategories.findIndex(
        (category, index) =>
          ![...adminState.usedCategories, firstQuestionCategoryId].includes(
            `${secondQuestion.id}-${index}`
          )
      );
      const secondQuestionCategory =
        secondQuestion.possibleCategories[secondQuestionCategoryIndex];
      const secondQuestionCategoryId = `${secondQuestion.id}-${secondQuestionCategoryIndex}`;

      changeAdminState({
        type: 'admin-state-base',
        questionsSelectionMode: adminState.questionsSelectionMode,
        usedQuestions: adminState.usedQuestions,
        questionsById: adminState.questionsById,
        answeredQuestionsCount: adminState.answeredQuestionsCount,
        usedCategories: [
          ...adminState.usedCategories,
          firstQuestionCategoryId,
          secondQuestionCategoryId,
        ],
        roundState: {
          type: 'round-state-select-category',
          firstQuestion,
          firstQuestionCategory,
          secondQuestion,
          secondQuestionCategory,
        },
      });

      changeGameState({
        type: 'game-state-show-categories',
        categories: [firstQuestionCategory, secondQuestionCategory],
      });
    }
  };

  const showQuestion = () => {
    if (
      adminState.type === 'admin-state-base' &&
      adminState.roundState.type === 'round-state-show-question' &&
      gameState.type === 'game-state-show-question'
    ) {
      send({
        type: 'reset-timer-60',
      });
      changeAdminState({
        type: 'admin-state-base',
        questionsSelectionMode: adminState.questionsSelectionMode,
        questionsById: adminState.questionsById,
        answeredQuestionsCount: adminState.answeredQuestionsCount,
        usedCategories: adminState.usedCategories,
        usedQuestions: adminState.usedQuestions,
        roundState: {
          type: 'round-state-select-answers',
          question: adminState.roundState.question,
        },
      });
      changeGameState({
        type: 'game-state-show-question',
        answers: gameState.answers,
        selectedAnswers: gameState.selectedAnswers,
        question: adminState.roundState.question.text,
      });
    }
  };

  const showGoodAnswers = () => {
    if (
      adminState.type === 'admin-state-base' &&
      adminState.roundState.type === 'round-state-select-answers' &&
      gameState.type === 'game-state-show-question'
    ) {
      send({
        type: 'stop-timer',
      });
      changeAdminState({
        type: 'admin-state-base',
        questionsSelectionMode: adminState.questionsSelectionMode,
        questionsById: adminState.questionsById,
        answeredQuestionsCount: adminState.answeredQuestionsCount,
        usedCategories: adminState.usedCategories,
        usedQuestions: adminState.usedQuestions,
        roundState: {
          type: 'round-state-empty',
        },
      });
      changeGameState({
        type: 'game-state-show-question',
        answers: gameState.answers,
        selectedAnswers: gameState.selectedAnswers,
        question: adminState.roundState.question.text,
        correctAnswerIndex: adminState.roundState.question.correctAnswerIndex,
      });
    }
  };

  const showStatus = () => {
    if (
      adminState.type === 'admin-state-base' &&
      gameState.type === 'game-state-show-question' &&
      gameState.correctAnswerIndex !== undefined
    ) {
      const answeredQuestionsCount = adminState.answeredQuestionsCount;
      const totalQuestionsCount = Object.keys(adminState.questionsById).length;

      changeAdminState({
        type: 'admin-state-base',
        questionsSelectionMode: adminState.questionsSelectionMode,
        questionsById: adminState.questionsById,
        usedCategories: adminState.usedCategories,
        usedQuestions: adminState.usedQuestions,
        answeredQuestionsCount,
        roundState: {
          type: 'round-state-empty',
        },
      });

      changeGameState(
        answeredQuestionsCount === totalQuestionsCount
          ? { type: 'game-state-show-title' }
          : {
              type: 'game-state-show-status',
              answeredQuestionsCount,
              totalQuestionsCount,
            }
      );
    }
  };

  return (
    <div>
      {adminState.type === 'admin-state-base' && (
        <>
          <h1>Nawigacja</h1>
          {adminState.questionsSelectionMode === 'manual' && (
            <Button
              disabled={
                !(
                  (gameState.type === 'game-state-show-title' ||
                    gameState.type === 'game-state-show-status') &&
                  adminState.roundState.type === 'round-state-empty'
                )
              }
              onClick={() =>
                changeAdminState({
                  type: 'admin-state-base',
                  questionsSelectionMode: adminState.questionsSelectionMode,
                  questionsById: adminState.questionsById,
                  answeredQuestionsCount: adminState.answeredQuestionsCount,
                  usedCategories: adminState.usedCategories,
                  usedQuestions: adminState.usedQuestions,
                  roundState: {
                    type: 'round-state-pick-questions',
                    pickedQuestionsIds: [],
                  },
                })
              }
              style={{ marginBottom: '10px' }}
              color="lightgreen"
            >
              wybierz pytania
            </Button>
          )}
          <Button
            disabled={
              !(
                (gameState.type === 'game-state-show-title' ||
                  gameState.type === 'game-state-show-status') &&
                ((adminState.questionsSelectionMode === 'automatic' &&
                  adminState.roundState.type === 'round-state-empty') ||
                  (adminState.roundState.type ===
                    'round-state-pick-questions' &&
                    adminState.roundState.pickedQuestionsIds.length > 0 &&
                    adminState.roundState.pickedQuestionsIds.length <= 2))
              )
            }
            onClick={startRound}
            color="lightgreen"
            style={{ marginBottom: '10px' }}
          >
            rozpocznij rundę
          </Button>
          <Button
            disabled={
              !(adminState.roundState.type === 'round-state-show-question')
            }
            color="lightgreen"
            onClick={showQuestion}
            style={{ marginBottom: '10px' }}
          >
            pokaż pytanie
          </Button>
          <Button
            disabled={
              !(adminState.roundState.type === 'round-state-select-answers') ||
              (gameState.type === 'game-state-show-question' &&
                gameState.selectedAnswers.filter(
                  (selection) => selection === true
                ).length === 0)
            }
            onClick={showGoodAnswers}
            color="lightgreen"
            style={{ marginBottom: '10px' }}
          >
            pokaż poprawne odpowiedzi
          </Button>
          <Button
            disabled={
              !(
                gameState.type === 'game-state-show-question' &&
                gameState.correctAnswerIndex !== undefined
              )
            }
            onClick={showStatus}
            color="lightgreen"
            style={{ marginBottom: '10px' }}
          >
            pokaż podsumowanie
          </Button>

          <ClockSection send={send} />
          {(adminState.roundState.type === 'round-state-select-category' ||
            adminState.roundState.type === 'round-state-select-answers') && (
            <>
              <h1>Rozgrywka</h1>
              {adminState.roundState.type === 'round-state-select-category' && (
                <CategorySelection
                  changeAdminState={changeAdminState}
                  changeGameState={changeGameState}
                  adminState={adminState}
                  gameState={gameState}
                />
              )}
              {adminState.roundState.type === 'round-state-select-answers' && (
                <AnswersSelection
                  changeAdminState={changeAdminState}
                  changeGameState={changeGameState}
                  adminState={adminState}
                  gameState={gameState}
                />
              )}
            </>
          )}
        </>
      )}
      {adminState.type === 'admin-state-base' && (
        <Questions
          questions={Object.values(adminState.questionsById)}
          usedQuestions={adminState.usedQuestions}
          usedCategories={adminState.usedCategories}
          adminState={adminState}
          changeAdminState={changeAdminState}
        />
      )}
      <SynchronizationSection
        adminState={adminState}
        changeAdminState={changeAdminState}
        gameState={gameState}
        changeGameState={changeGameState}
      />
      <h1>Konfiguracja serwisu</h1>
      <QuestionsLoader
        onQuestionsLoad={(questionsById) => {
          changeAdminState({
            type: 'admin-state-base',
            questionsSelectionMode: 'manual',
            usedQuestions: [],
            usedCategories: [],
            answeredQuestionsCount: 0,
            roundState: defaultRoundState,
            questionsById,
          });
          changeGameState(defaultGameState);
        }}
      />
      <p>
        ręczny wybór pytań{' '}
        <input
          type="checkbox"
          disabled={
            !(
              adminState.type === 'admin-state-base' &&
              adminState.roundState.type === 'round-state-empty' &&
              (gameState.type === 'game-state-show-title' ||
                gameState.type === 'game-state-show-status')
            )
          }
          checked={
            adminState.type === 'admin-state-base' &&
            adminState.questionsSelectionMode === 'manual'
          }
          onChange={() => {
            if (adminState.type === 'admin-state-base') {
              changeAdminState({
                ...adminState,
                questionsSelectionMode:
                  adminState.questionsSelectionMode === 'automatic'
                    ? 'manual'
                    : 'automatic',
              });
            }
          }}
        />
      </p>
    </div>
  );
};

interface AnswersSelectionProps {
  adminState: AdminState;
  changeAdminState: (adminState: AdminState) => void;
  gameState: GameState;
  changeGameState: (gameState: GameState) => void;
}

const AnswersSelection: FC<AnswersSelectionProps> = ({
  adminState,
  gameState,
  changeGameState,
}) => {
  if (
    adminState.type !== 'admin-state-base' ||
    adminState.roundState.type !== 'round-state-select-answers'
  ) {
    return null;
  }

  const selectAnswer = (answerIndex: number) => {
    if (
      adminState.type === 'admin-state-base' &&
      adminState.roundState.type === 'round-state-select-answers' &&
      gameState.type === 'game-state-show-question'
    ) {
      const selectedAnswers = [...gameState.selectedAnswers];
      selectedAnswers[answerIndex] = !selectedAnswers[answerIndex];

      changeGameState({
        type: 'game-state-show-question',
        question: gameState.question,
        answers: gameState.answers,
        selectedAnswers,
      });
    }
  };

  return (
    <div>
      <h2>Przełącz zaznaczenie odpowiedzi</h2>
      {adminState.roundState.question.answers.map((answer, index) => {
        return (
          <Button
            key={answer}
            onClick={() => selectAnswer(index)}
            color={
              gameState.type === 'game-state-show-question' &&
              gameState.selectedAnswers[index]
                ? 'yellow'
                : 'lightyellow'
            }
            style={{ marginBottom: '10px' }}
          >
            {answer}
          </Button>
        );
      })}
    </div>
  );
};

interface CategorySelectionProps {
  adminState: AdminState;
  changeAdminState: (adminState: AdminState) => void;
  gameState: GameState;
  changeGameState: (gameState: GameState) => void;
}

const CategorySelection: FC<CategorySelectionProps> = ({
  adminState,
  changeAdminState,
  changeGameState,
}) => {
  if (
    adminState.type !== 'admin-state-base' ||
    adminState.roundState.type !== 'round-state-select-category'
  ) {
    return null;
  }

  const selectCategory = (categoryIndex: number) => {
    if (
      adminState.type === 'admin-state-base' &&
      adminState.roundState.type === 'round-state-select-category'
    ) {
      const question =
        categoryIndex === 0
          ? adminState.roundState.firstQuestion
          : adminState.roundState.secondQuestion;

      changeAdminState({
        type: 'admin-state-base',
        questionsSelectionMode: adminState.questionsSelectionMode,
        usedQuestions: [...adminState.usedQuestions, question.id],
        questionsById: adminState.questionsById,
        answeredQuestionsCount: adminState.answeredQuestionsCount + 1,
        usedCategories: adminState.usedCategories,
        roundState: {
          type: 'round-state-show-question',
          question,
        },
      });
      changeGameState({
        type: 'game-state-show-question',
        answers: question.answers,
        selectedAnswers: new Array(question.answers.length).fill(false),
      });
    }
  };

  return (
    <div>
      <h2>Wskaż wybraną kategorię</h2>
      <Button onClick={() => selectCategory(0)} color="lightgreen">
        {adminState.roundState.firstQuestionCategory}
      </Button>
      <Button onClick={() => selectCategory(1)} color="lightgreen">
        {adminState.roundState.secondQuestionCategory}
      </Button>
    </div>
  );
};

interface ClockSectionProps {
  send: (message: Message) => void;
}

const ClockSection: FC<ClockSectionProps> = ({ send }) => {
  return (
    <div>
      <h1>Zegar</h1>
      <div>
        <Button
          onClick={() => send({ type: 'start-timer' })}
          style={{ marginBottom: '10px' }}
        >
          start
        </Button>
        <Button
          onClick={() => send({ type: 'stop-timer' })}
          style={{ marginBottom: '10px' }}
        >
          stop
        </Button>
        <Button
          onClick={() => send({ type: 'reset-timer-60' })}
          style={{ marginBottom: '10px' }}
        >
          reset 60s
        </Button>
        <Button
          onClick={() => send({ type: 'reset-timer-30' })}
          style={{ marginBottom: '10px' }}
        >
          reset 30s
        </Button>
      </div>
    </div>
  );
};

interface AdminSectionProps {
  adminState: AdminState;
  changeAdminState: (state: AdminState) => void;
  gameState: GameState;
  changeGameState: (state: GameState) => void;
}

const SynchronizationSection: FC<AdminSectionProps> = ({
  adminState,
  changeAdminState,
  gameState,
  changeGameState,
}) => {
  return (
    <div>
      <h1>Synchronizacja</h1>
      <Button
        onClick={() => {
          changeAdminState(adminState);
          changeGameState(gameState);
        }}
        color="yellow"
      >
        wymuś propagację stanu
      </Button>
      <Button
        onClick={() => {
          changeAdminState(defaultAdminState);
          changeGameState(defaultGameState);
        }}
        color="lightcoral"
      >
        resetuj stan
      </Button>
    </div>
  );
};
