import classNames from 'classnames';

type Props = {
  classes?: string;
  isChecked: boolean;
  onClick: () => void;
};

export default function Checkbox({
  classes,
  isChecked = false,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      type='button'
      className={classNames(
        classes,
        isChecked ? 'bg-secondary' : 'bg-gray-200',
        `flex h-4 w-4 items-center justify-center rounded-sm focus:outline-none focus:ring-2 focus:ring-secondary`
      )}
    >
      {isChecked ? (
        <svg className='h-3 w-3 fill-current text-white' viewBox='0 0 20 20'>
          <path d='M0 11l2-2 5 5L18 3l2 2L7 18z' />
        </svg>
      ) : null}
    </button>
  );
}
