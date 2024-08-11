export enum DefaultColors {
  Primary = '#00337C',
  Secondary = '#03C988',
}

export enum MemberRolesEnum {
  Owner = 'owner',
  'Super Admin' = 'super-admin',
  Admin = 'admin',
  Member = 'member',
  Player = 'player',
}

export enum RolePermissions {
  MANAGE_LEAGUE = 'manage_league', //owner only (monthly sub end, delete league)
  EDIT_LEAGUE_INFO = 'edit_league_info', //owner, super-admin only

  MANAGE_PLAYERS = 'manage_players', //manage players
  MANAGE_REGISTRATIONS = 'manage_registrations',
  MANAGE_NEWS = 'manage_news',
  MANAGE_CALENDAR = 'manage_calendar',
  MANAGE_SEASONS = 'manage_seasons', //(add season, delete season, set active season, add/remove teams from season)

  MANAGE_ROSTER = 'manage_roster', //for season page
  MANAGE_TEAMS = 'manage_teams', //change teams info, (scoped), if scoped only allow editing scoped teams
}

export enum ControlPanelLeaguePages {
  INDEX = 'index',
  HOME = 'home',
  MEMBERS = 'members',
  SEASONS = 'seasons',
  TEAMS = 'teams',
  PLAYERS = 'players',
  CALENDAR = 'calendar',
  REGISTRATIONS = 'registrations',
  NEWS = 'news',
}
