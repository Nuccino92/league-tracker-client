const QUERY_KEYS = {
  CONTROL_PANEL: {
    LEAGUE: 'league-control-panel',
    ARCHIVED_SEASONS: 'archived-seasons-control-panel',
    SEASON_SETTINGS: 'season-settings-control-panel',
    DETAILED_SEASONS: 'detailed-seasons',
    DETAILED_SEASON_TEAMS: 'detailed-season-teams',

    TEAMS: 'teams-control-panel',
    TEAM: 'team-control-panel',
    TEAMS_FOR_DROPDOWN: 'teams-for-dropdown-control-panel',
    ARCHIVED_TEAMS: 'archived-teams-control-panel',
    FULL_LIST_OF_TEAMS_FOR_SEASON: 'teams-full-list-for-season',
    TEAM_IS_IN_ACTIVE_SEASON: 'team-is-in-active-season-control-panel',

    PLAYERS: 'players-control-panel',
    PLAYER: 'player-control-panel',
    ARCHIVED_PLAYERS: 'archived-players-control-panel',
    FREE_AGENTS: 'free-agents-control-panel',

    MEMBERS: 'members-control-panel',
    MEMBER: 'member-control-panel',

    REGISTRATION: 'registration-control-pane',
    REGISTRATIONS: 'registrations-control-panel',
    REGISTRANTS: 'registrants-control-panel',

    NOTICES_STATISTICS: 'notices-statistics-control-panel',
    NOTICES_LIST: 'notices-list-control-panel',
    NOTICES_DETAILS: 'notices-details-control-panel',
    NOTICE_SELECTION_SCOPE_TOTALS:
      'notice-selection-scope-totals-control-panel',
  },

  EVENTS: {
    LEAGUE_EVENTS: 'league-events',
  },

  REGISTRATION: {
    FIND: 'registration',
  },

  CREATE_LEAGUE_SPORTS: 'create-league-sports',
  SUBSCRIPTION_PLANS: 'subscription-plans',
};

export default QUERY_KEYS;

//TODO: possibly refactor into factory
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
