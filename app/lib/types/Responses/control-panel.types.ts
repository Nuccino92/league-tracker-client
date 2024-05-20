import { League } from '../Models/League';
import { LeagueInformationResource } from '../Resources/CreateLeagueResource';

export type ControlPanelInformation = {
  league_info: League;
  seasons: Seasons;
};

export type Seasons = {
  all_seasons: { id: string; name: string }[];
  active_season: string;
};

export type ErrorType = 'inactive' | 'unauthorized';
