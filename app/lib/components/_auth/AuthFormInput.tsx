import { Field, ErrorMessage } from 'formik';
import classNames from 'classnames';
import { inputClasses } from '../../globals/styles';

type Props = {
  name: string;
  placeholder: string;
  label: string;
  type: string;
  isError: boolean;
  icon?: JSX.Element;
  iconFn?: () => void;
};

export default function AuthFormInput({
  name,
  placeholder,
  label,
  type,
  isError,
  icon,
  iconFn,
}: Props) {
  return (
    <>
      <label className='mb-1 font-medium text-zinc-600' htmlFor={name}>
        {label}
      </label>
      <div className='relative flex w-full items-center'>
        <Field
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          className={classNames(
            icon ? 'pr-12' : '',
            isError ? 'border-red-500' : '',
            inputClasses
          )}
        />{' '}
        {icon ? (
          <button
            onClick={() => {
              if (!iconFn) return;
              iconFn();
            }}
            type='button'
            className='absolute right-0 mr-4'
          >
            {icon}
          </button>
        ) : null}
      </div>
      <ErrorMessage
        name={name}
        component='div'
        className='ml-2 mt-1 text-sm text-red-400'
      />
    </>
  );
}
