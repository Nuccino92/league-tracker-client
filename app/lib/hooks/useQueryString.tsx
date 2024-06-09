'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

function useQueryString() {
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value) {
        params.delete(name);
      } else {
        params.set(name, value);
      }

      return params.toString();
    },
    [searchParams]
  );

  const getFullQueryString = useCallback(() => {
    return searchParams.toString();
  }, [searchParams]);

  return { createQueryString, getFullQueryString };
}

export default useQueryString;
