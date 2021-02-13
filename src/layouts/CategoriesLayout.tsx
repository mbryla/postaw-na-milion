import { FC } from 'react';
import { Block } from './QuestionLayout';

interface CategoriesLayoutProps {
  categories: Array<string>;
}

export const CategoriesLayout: FC<CategoriesLayoutProps> = ({ categories }) => {
  return (
    <>
      {categories.map((category) => (
        <Block key={category}>{category}</Block>
      ))}
    </>
  );
};
