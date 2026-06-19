/**
 * Shared RTK Query endpoint options that turn a paginated list endpoint into an
 * accumulating ("Показать ещё") one.
 *
 * Works for any response shaped `{ [itemsKey]: { id }[]; page: number; ... }`
 * whose query args carry an optional `page`. Pages of the same filter set are
 * merged into a single cache entry; changing any other arg starts a fresh entry
 * at page 1.
 *
 * Usage inside `builder.query`:
 *   getParts: builder.query<PartsListResponse, PartsSearchParams | void>({
 *     query: (params) => ({ url: "/parts", params: params ?? undefined }),
 *     ...infiniteListConfig<PartsListResponse>("parts"),
 *     providesTags: ...,
 *   }),
 */
export function infiniteListConfig<Res extends { page: number }>(
  itemsKey: keyof Res,
) {
  return {
    serializeQueryArgs: ({
      queryArgs,
      endpointName,
    }: {
      queryArgs: unknown;
      endpointName: string;
    }) => {
      const rest = { ...((queryArgs as Record<string, unknown>) ?? {}) };
      delete rest.page;
      return `${endpointName}(${JSON.stringify(rest)})`;
    },
    merge: (current: Res, incoming: Res): Res => {
      if (incoming.page <= 1) return incoming;
      const currentItems = current[itemsKey] as unknown as { id: string }[];
      const incomingItems = incoming[itemsKey] as unknown as { id: string }[];
      const seen = new Set(currentItems.map((i) => i.id));
      return {
        ...incoming,
        [itemsKey]: [
          ...currentItems,
          ...incomingItems.filter((i) => !seen.has(i.id)),
        ],
      } as Res;
    },
    forceRefetch: ({
      currentArg,
      previousArg,
    }: {
      currentArg: unknown;
      previousArg: unknown;
    }) =>
      (currentArg as { page?: number } | undefined)?.page !==
      (previousArg as { page?: number } | undefined)?.page,
  };
}
