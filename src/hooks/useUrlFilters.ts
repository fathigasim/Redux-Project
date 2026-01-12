// hooks/useUrlFilters.ts
// Custom Hook for URL Filters (Reusable)
import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";

export interface FilterConfig {
  [key: string]: string | number;
}

export const useUrlFilters = <T extends FilterConfig>(defaults: Partial<T> = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get current filters from URL
  const filters = useMemo(() => {
    const params: any = { ...defaults };
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params as T;
  }, [searchParams, defaults]);

  // Update filters
  const updateFilters = useCallback(
    (newFilters: Partial<T>, resetPage = true) => {
      const params: any = {
        ...Object.fromEntries(searchParams),
        ...newFilters,
      };

      if (resetPage && params.page) {
        params.page = "1";
      }

      // Remove empty values
      Object.keys(params).forEach(key => {
        if (params[key] === "" || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  // Clear single filter
  const clearFilter = useCallback(
    (key: keyof T) => {
      const params = Object.fromEntries(searchParams);
      delete params[key as string];
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  return {
    filters,
    updateFilters,
    resetFilters,
    clearFilter,
  };
};