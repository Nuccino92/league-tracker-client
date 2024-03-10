type Props = {
  label: string;
};

export default function AuthFormButton({ label }: Props) {
  return (
    <button
      type="submit"
      className="border h-10 rounded-md px-2 bg-secondary font-bold text-white !mt-4 transition-all hover:text-gray-200 w-full"
    >
      {label}
    </button>
  );
}
