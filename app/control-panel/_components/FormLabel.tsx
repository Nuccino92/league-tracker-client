import classNames from 'classnames';

export default function FormLabel({
  htmlFor,
  label,
  required = false,
  classes,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
  classes?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={classNames(
        classes,
        'whitespace-nowrap font-bold text-zinc-600'
      )}
    >
      <span>{label}</span>{' '}
      {required ? <span className='text-red-500'>*</span> : null}
    </label>
  );
}
