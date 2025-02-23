const ROUTES = {
  LOGIN: '/login',
  GAME: '/game',
  GAMES: '/games',
  TEAMS: '/teams',
  PLAYERS: '/players',
  STANDINGS: '/standings',
  PLAYER: '/player',
  REGISTER: '/register',
  LEAGUE: '/league',
  ABOUT: '/about',
  PROFILE: '/profile',
  NOTIFICATIONS: '/notifications',
  FOLLOWED_LEAGUES: '/followed-leagues',
  BILLING_AND_SUBSCRIPTION: '/followed-leagues/billing-and-subscription',
  HELP: '/help',
  CREATE: '/create',
  PROFILE_SUBROUTES: {
    LEAGUES_ORGS: '/league-and-organizations',
  },

  // NEED TO REFACTOR THE ROUTES FOR CONTROL PANEL TO INCLUDE LEAGUE/ORGANIZATION PREFIX AND INCLUDE THE /CONTROL-PANEL INSIDE EACH OF THE CONTROL PANEL SUBROUTES +
  //  DELETE   CONTROL_PANEL: '/control-panel'

  CONTROL_PANEL: '/control-panel',
  CONTROL_PANEL_SUBROUTES: {
    DASHBOARD: '/dashboard',
    MEMBERS: '/members',
    SEASONS: '/seasons',
    TOURNAMENTS: '/tournaments',
    SCHEDULE: '/schedule',
    REGISTRATIONS: '/registrations',
    PLAYERS: '/players',
    TEAMS: '/teams',
    NOTICES: '/notices',
    SETTINGS: '/settings',
  },
};

export default ROUTES;
