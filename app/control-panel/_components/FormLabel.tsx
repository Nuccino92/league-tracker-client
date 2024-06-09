export default function FormLabel({
  htmlFor,
  label,
  required = false,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className='font-bold text-zinc-600'>
      <span>{label}</span>{' '}
      {required ? <span className='text-red-500'>*</span> : null}
    </label>
  );
}
