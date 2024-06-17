const QUERY_KEYS = {
  CONTROL_PANEL: {
    LEAGUE: 'league-control-panel',

    TEAMS: 'teams-control-panel',
    TEAM: 'team-control-panel',
    TEAMS_FOR_DROPDOWN: 'teams-for-dropdown-control-panel',
    ARCHIVED_TEAMS: 'archived-teams-control-panel',

    PLAYERS: 'players-control-panel',
    PLAYER: 'player-control-panel',
    ARCHIVED_PLAYERS: 'archived-players-control-panel',
  },
};

export default QUERY_KEYS;

//TODO: possibly refactor into facotry
// reference: https://tkdodo.eu/blog/effective-react-query-keys

/*
  query-key-factory

  const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (filters: string) => [...todoKeys.lists(), { filters }] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id: number) => [...todoKeys.details(), id] as const,
}
 */

/*
  examples

  // 🕺 remove everything related
  // to the todos feature
  queryClient.removeQueries({
  queryKey: todoKeys.all
})

  // 🚀 invalidate all the lists
  queryClient.invalidateQueries({
  queryKey: todoKeys.lists()
})

  // 🙌 prefetch a single todo
  queryClient.prefetchQueries({
  queryKey: todoKeys.detail(id),
  queryFn: () => fetchTodo(id),
})
 */
