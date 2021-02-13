import { FC, ReactNode } from 'react';

export interface ButtonProps {
  color?: string;
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  style?: Record<string, unknown>;
}

export const Button: FC<ButtonProps> = ({
  color = '#efefef',
  disabled,
  onClick,
  children,
  style = {},
  ...rest
}) => {
  return (
    <button
      style={{
        backgroundColor: disabled ? '#efefef' : color,
        marginRight: '10px',
        padding: '5px',
        ...style,
      }}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};
