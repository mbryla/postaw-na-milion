import { FC } from 'react';
import { Button } from './Button';

interface ModeSelectorProps {
  setMode: (mode: 'admin' | 'player') => void;
}

export const ModeSelector: FC<ModeSelectorProps> = ({ setMode }) => {
  const handlePlayerModeButtonClick = () => {
    setMode('player');
  };

  const handleAdminModeButtonClick = () => {
    setMode('admin');
  };

  return (
    <div
      style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
    >
      <Button onClick={handlePlayerModeButtonClick} style={{ marginRight: '40px' }}>gracz</Button>
      <Button onClick={handleAdminModeButtonClick}>admin</Button>
    </div>
  );
};
