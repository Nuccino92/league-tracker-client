import {
  baseballPitcherStatLabels,
  baseballPlayerStatLabels,
  basketballPlayerStatLabels,
  hockeyGoalieStatLabels,
  hockeyPlayerStatLabels,
  soccerGoalieStatLabels,
  soccerPlayerStatLabels,
} from "../collections/playerStatLabels";
import {
  baseballStandingsLabels,
  basketballStandingsLabels,
  hockeyStandingsLabels,
  soccerStandingsLabels,
} from "../collections/standingsLabels";
import { SportType } from "../types/sport.types";
import { SportPlayerTabs } from "../types/sportPlayerTabs.types";

type Filter = SportPlayerTabs;

// TODO: pass in additional filter (goalie, pitcher)
export const getPlayerStatLabels = (
  type: SportType,
  filter: Filter = undefined
) => {
  if (type === "basketball") return basketballPlayerStatLabels;

  if (type === "soccer" && filter === "fielder") return soccerPlayerStatLabels;
  if (type === "soccer" && filter === "goalie") return soccerGoalieStatLabels;

  if (type === "baseball" && filter === "fielder")
    return baseballPlayerStatLabels;
  if (type === "baseball" && filter === "pitcher")
    return baseballPitcherStatLabels;

  if (type === "hockey" && filter === "skater") return hockeyPlayerStatLabels;
  if (type === "hockey" && filter === "goalie") return hockeyGoalieStatLabels;
};

export const getStandingsLabels = (type: SportType) => {
  if (type === "basketball") return basketballStandingsLabels;
  if (type === "baseball") return baseballStandingsLabels;
  if (type === "hockey") return hockeyStandingsLabels;
  if (type === "soccer") return soccerStandingsLabels;
};
