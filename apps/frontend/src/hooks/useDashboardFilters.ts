import { useMemo, useState } from 'react';

export function useDashboardFilters() {
  const [query, setQuery] = useState('');

  return useMemo(
    () => ({
      query,
      setQuery,
    }),
    [query],
  );
}
