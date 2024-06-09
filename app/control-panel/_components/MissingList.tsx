import { ReactElement } from 'react';

type Props = {
  text: string;
  icon?: ReactElement;
};

export default function MissingList({ text, icon }: Props) {
  return (
    <div className='flex h-full w-full flex-col items-center justify-center space-y-4 text-center'>
      {icon ? icon : null}
      <div className='text-2xl font-medium italic'>{text}</div>
    </div>
  );
}
