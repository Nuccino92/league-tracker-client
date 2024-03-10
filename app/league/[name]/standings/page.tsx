"use client";

import classNames from "classnames";
import cryptoRandomString from "crypto-random-string";

import { SportType } from "@/app/lib/types/sport.types";
import Breadcrumb from "@/app/lib/components/Breadcrumb";
import { getStandingsLinks } from "@/app/lib/collections/breadcrumbLinks";
import { getStandingsLabels } from "@/app/lib/utils/sportInformation";
import BasketballStandingsStats from "@/app/lib/components/standingsStats/BasketballStandingsStats";
import BaseballStandingsStats from "@/app/lib/components/standingsStats/BaseballStandingsStats";
import HockeyStandingsStats from "@/app/lib/components/standingsStats/HockeyStandingsStats";
import SoccerStandingsStats from "@/app/lib/components/standingsStats/SoccerStandingsStats";

const league = {
  name: "NBA",
  type: "basketball" as SportType,
}; // TODO: create a league provider to pass league information

export default function Standings() {
  const standingsLabels = getStandingsLabels(league.type);
  return (
    <div className="flex justify-center py-10 flex-col items-center">
      <div>
        <Breadcrumb links={getStandingsLinks({ name: league.name })} />
        <div className="w-[900px]">
          <div className="bg-secondary text-white font-medium w-full p-3">
            {league.name} SEASON STANDINGS
          </div>
          <div className="w-full">
            {/* STANDINGS LABELS */}
            <div className="text-white font-medium text-sm bg-primary flex items-center py-2">
              {standingsLabels?.map((label, index) => {
                return (
                  <div
                    onClick={() => {
                      if (index === 0) return;
                      if (index === 1) return;
                      else {
                        //TODO: implement fetching new list with label.value as a filter
                        console.log("FILTERING BY:", label.value);
                      }
                    }}
                    className={classNames(
                      standingsData.meta.filter === label.value &&
                        "!text-secondary",
                      index === 0 && "!w-20 !cursor-default hover:!text-white",
                      index === 1 &&
                        "!w-[150px] !cursor-default hover:!text-white",
                      "flex items-center justify-center w-[45px] cursor-pointer transition hover:text-secondary"
                    )}
                    key={cryptoRandomString({ length: 8 })}
                  >
                    {label.label}
                  </div>
                );
              })}
            </div>

            {/* STANDINGS LIST */}
            <table className="w-full">
              {league.type === "basketball" ? (
                <BasketballStandingsStats
                  leagueName={league.name}
                  data={standingsData.data}
                />
              ) : null}
              {league.type === "baseball" ? (
                <BaseballStandingsStats
                  leagueName={league.name}
                  data={standingsData.data}
                />
              ) : null}
              {league.type === "hockey" ? (
                <HockeyStandingsStats
                  leagueName={league.name}
                  data={standingsData.data}
                />
              ) : null}
              {league.type === "soccer" ? (
                <SoccerStandingsStats
                  leagueName={league.name}
                  data={standingsData.data}
                />
              ) : null}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const standingsData = {
  meta: {
    filter: null,
  },
  data: [
    {
      id: "1",
      rank: 1,
      team: "Toronto Raptors",
      games: 17,
      wins: 15,
      losses: 2,
      draws: 0,
      winpct: 88,
      pf: 77,
      pa: 55,
      plusminus: 22,
      streak: 9,
    },
    {
      id: "2",
      rank: 2,
      team: "Toronto Raptors",
      games: 17,
      wins: 15,
      losses: 2,
      draws: 0,
      winpct: 88,
      pf: 77,
      pa: 55,
      plusminus: 22,
      streak: 9,
    },
    {
      id: "3",
      rank: 3,
      team: "Toronto Raptors",
      games: 17,
      wins: 15,
      losses: 2,
      draws: 0,
      winpct: 88,
      pf: 77,
      pa: 55,
      plusminus: 22,
      streak: 9,
    },
    {
      id: "4",
      rank: 4,
      team: "Toronto Raptors",
      games: 17,
      wins: 15,
      losses: 2,
      draws: 0,
      winpct: 88,
      pf: 77,
      pa: 55,
      plusminus: 22,
      streak: 9,
    },
    {
      id: "5",
      rank: 5,
      team: "Toronto Raptors",
      games: 17,
      wins: 15,
      losses: 2,
      draws: 0,
      winpct: 88,
      pf: 77,
      pa: 55,
      plusminus: 22,
      streak: 9,
    },

    {
      id: "6",
      rank: 6,
      team: "Toronto Raptors",
      games: 17,
      wins: 15,
      losses: 2,
      draws: 0,
      winpct: 88,
      pf: 77,
      pa: 55,
      plusminus: 22,
      streak: 9,
    },
    {
      id: "7",
      rank: 7,
      team: "Toronto Raptors",
      games: 17,
      wins: 15,
      losses: 2,
      draws: 0,
      winpct: 88,
      pf: 77,
      pa: 55,
      plusminus: 22,
      streak: 9,
    },
    {
      id: "8",
      rank: 8,
      team: "Toronto Raptors",
      games: 17,
      wins: 15,
      losses: 2,
      draws: 0,
      winpct: 88,
      pf: 77,
      pa: 55,
      plusminus: 22,
      streak: 9,
    },
    {
      id: "9",
      rank: 9,
      team: "Toronto Raptors",
      games: 17,
      wins: 15,
      losses: 2,
      draws: 0,
      winpct: 88,
      pf: 77,
      pa: 55,
      plusminus: 22,
      streak: 9,
    },
    {
      id: "10",
      rank: 10,
      team: "Toronto Raptors",
      games: 17,
      wins: 15,
      losses: 2,
      draws: 0,
      winpct: 88,
      pf: 77,
      pa: 55,
      plusminus: 22,
      streak: 9,
    },
  ],
};
