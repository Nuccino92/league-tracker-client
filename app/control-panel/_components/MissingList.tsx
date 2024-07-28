import classNames from 'classnames';
import { ReactElement, ReactNode } from 'react';

type Props = {
  text: string;
  icon?: ReactElement;
  link?: ReactNode;
  textClasses?: string;
};

export default function MissingList({ text, icon, link, textClasses }: Props) {
  return (
    <div className='flex h-full w-full flex-col items-center justify-center space-y-4 text-center'>
      {icon ? icon : null}
      <div className={classNames('text-2xl font-medium italic', textClasses)}>
        {text}
      </div>

      {link ? link : null}
    </div>
  );
}
