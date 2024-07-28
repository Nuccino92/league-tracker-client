type TransformOptions<T> = {
  labelKey: keyof T;
  valueKey: keyof T;
};

type TransformInput<T> = T[] | [keyof T, keyof T][];

function transformIntoOptions<T>(
  input: TransformInput<T>,
  options?: TransformOptions<T>
): { label: string; value: string }[] {
  if (options) {
    // Transform array of objects
    const { labelKey, valueKey } = options;
    return (input as T[]).map((item) => ({
      label: String(item[labelKey]),
      value: String(item[valueKey]),
    }));
  } else {
    // Transform array of entries
    return (input as [keyof T, keyof T][]).map(([label, value]) => ({
      label: String(label),
      value: String(value),
    }));
  }
}

export default transformIntoOptions;
