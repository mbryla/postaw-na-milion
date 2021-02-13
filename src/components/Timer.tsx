import { FC } from 'react';

const pad = (value: number, digits: number) => {
  return ('0'.repeat(digits) + value).slice(-1 * digits);
};

interface TimerProps {
  value: number;
}

export const Timer: FC<TimerProps> = ({ value }) => {
  const minutes = Math.floor(value / (1000 * 60));
  const seconds = Math.floor(value / 1000) % 60;

  return (
    <span>
      {pad(minutes, 2)}:{pad(seconds, 2)}
    </span>
  );
};
