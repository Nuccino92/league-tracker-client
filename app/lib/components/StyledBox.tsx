import { ReactNode } from 'react';
import classNames from 'classnames';

type Props = {
  classes?: string;
  boxShadow?: boolean;
  children: ReactNode;
};

export default function StyledBox({ classes, boxShadow, children }: Props) {
  return (
    <div
      className={classNames(
        boxShadow && 'shadow-[0px_4px_24px_-1px_rgba(0,0,0,0.08)]',
        'rounded-xl border border-violet-100 bg-white',
        classes
      )}
    >
      {children}
    </div>
  );
}
