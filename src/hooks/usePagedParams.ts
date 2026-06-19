import { useMemo, useState } from "react";

/** Default page size for list endpoints. */
export const DEFAULT_PAGE_SIZE = 20;

/**
 * Local pagination state for a list query. Combines stable `baseParams` (the
 * active filters/search) with the current page; resets to page 1 whenever the
 * base params change so a new filter set always starts from the top.
 *
 * `baseParams` MUST be a memoized/stable object (e.g. from `useMemo`) — the
 * reset keys off its identity.
 */
export function usePagedParams<T extends object>(
  baseParams: T,
  pageSize: number = DEFAULT_PAGE_SIZE,
) {
  const [page, setPage] = useState(1);

  // Reset to page 1 when the filter set changes. Uses the React "adjust state
  // during render by tracking previous value" pattern — no effect, no ref.
  const [prevBase, setPrevBase] = useState(baseParams);
  if (prevBase !== baseParams) {
    setPrevBase(baseParams);
    setPage(1);
  }

  const params = useMemo(
    () => ({ ...baseParams, page, limit: pageSize }),
    [baseParams, page, pageSize],
  );

  return { params, page, setPage };
}
