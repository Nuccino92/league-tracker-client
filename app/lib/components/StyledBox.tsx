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
        boxShadow && 'shadow-[0px_10px_55px_0px_rgba(0,0,0,0.05)]',
        'rounded-xl border border-violet-100 bg-white',
        classes
      )}
    >
      {children}
    </div>
  );
}
