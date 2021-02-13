import { ChangeEvent, KeyboardEvent, FC, useState } from 'react';
import { Button } from './Button';

export interface AuthKeyInputProps {
  authKey: string;
  setAuthKey: (authKey: string) => void;
}

export const AuthKeyInput: FC<AuthKeyInputProps> = ({
  authKey,
  setAuthKey,
}) => {
  const [value, setValue] = useState(authKey);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setAuthKey(value);
    }
  };

  const handleClick = () => {
    setAuthKey(value);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <label htmlFor="auth-key">klucz dostępu:</label>
      <input
        autoFocus
        type="password"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        style={{ flexGrow: 1, margin: '0 10px' }}
      />
      <Button onClick={handleClick} color="lightcoral">zmień</Button>
    </div>
  );
};
