import { League } from '../Models/League';
import { BasePlayer } from '../Models/Player';
import { BaseTeam } from '../Models/Team';
import { LeagueInformationResource } from '../Resources/CreateLeagueResource';

export type ControlPanelInformation = {
  league_info: League;
  seasons: Seasons;
};

export type Seasons = {
  all_seasons: { id: number; name: string }[];
  active_season_id: number | null;
};

// region - teams

// TODO: possibly add can_remove property
export type ControlPanelListTeam = {
  league_id: number;
} & BaseTeam;

export type ControlPanelManageTeam = BaseTeam & {
  is_in_active_season: boolean;
  can_remove: boolean;
};

export type ControlPanelArchivedTeam = BaseTeam & {};

// endregion - teams

// region - players

export type ControlPanelPlayer = {} & BasePlayer;

// endregion - players

export type ErrorType = 'inactive' | 'unauthorized';
