import classNames from 'classnames';

type Props = {
  classes?: string;
  isChecked: boolean;
  onClick: () => void;
  disabled?: boolean;
  name?: string;
};

export default function Checkbox({
  classes,
  isChecked = false,
  onClick,
  disabled,
  name = 'checkbox',
}: Props) {
  return (
    <button
      name={name}
      disabled={disabled}
      onClick={onClick}
      type='button'
      className={classNames(
        classes,
        disabled ? 'cursor-not-allowed bg-gray-500 opacity-50' : '',
        isChecked ? 'bg-secondary' : 'bg-gray-200',
        `flex h-4 min-h-[16px] w-4 min-w-[16px] items-center justify-center rounded-sm focus:outline-none focus:ring-2 focus:ring-secondary`
      )}
    >
      {isChecked ? (
        <svg
          className='h-3 min-h-[12px] w-3 min-w-[12px] fill-current text-white'
          viewBox='0 0 20 20'
        >
          <path d='M0 11l2-2 5 5L18 3l2 2L7 18z' />
        </svg>
      ) : null}
    </button>
  );
}
