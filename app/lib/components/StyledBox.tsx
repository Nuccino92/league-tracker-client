import { ReactNode } from 'react';
import classNames from 'classnames';

type Props = {
  classes?: string;
  children: ReactNode;
};

export default function StyledBox({ classes, children }: Props) {
  return (
    <div
      className={classNames(
        'rounded-xl border border-violet-100 bg-white',
        classes
      )}
    >
      {children}
    </div>
  );
}
