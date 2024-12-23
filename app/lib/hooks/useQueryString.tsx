'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

function useQueryString() {
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (
      name: string,
      value: string | Array<string | number> | undefined,
      includeOnly?: Array<string | number>
    ) => {
      const params = new URLSearchParams(searchParams.toString());

      if (!value || (Array.isArray(value) && value.length === 0)) {
        params.delete(name);
      } else if (Array.isArray(value)) {
        params.set(name, value.join(','));
      } else {
        params.set(name, value);
      }

      if (includeOnly && includeOnly.length > 0) {
        const scopedParams = new URLSearchParams();
        includeOnly.forEach((key) => {
          const paramValue = params.get(key.toString());
          if (paramValue !== null) {
            scopedParams.append(key.toString(), paramValue);
          }
        });
        return scopedParams.toString();
      }

      return params.toString();
    },
    [searchParams]
  );

  const getFullQueryString = useCallback(() => {
    return searchParams.toString();
  }, [searchParams]);

  const scopeQueryParams = useCallback(
    (includeOnly: string[]) => {
      const params = new URLSearchParams(searchParams.toString());

      if (includeOnly.length === 0) {
        return params.toString();
      }

      const scopedParams = new URLSearchParams();
      includeOnly.forEach((key) => {
        const value = params.get(key);
        if (value !== null) {
          scopedParams.append(key, value);
        }
      });

      return scopedParams.toString();
    },
    [searchParams]
  );

  return { createQueryString, getFullQueryString, scopeQueryParams };
}

export default useQueryString;
