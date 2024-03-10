// TODO:look to create a model from API call and use it from there

import classNames from "classnames";
import Link from "next/link";
import ROUTES from "../../routesConfig";

type Data = {
  id: string;
  rank: number;
  team: string;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  winpct: number;
  pf: number;
  pa: number;
  plusminus: number;
  streak: number;
}[];

type Props = {
  data: Data;
  leagueName: string;
};

export default function BasketballStandingsStats({ data, leagueName }: Props) {
  return (
    <tbody>
      {data
        .sort((a, b) => a.rank - b.rank)
        .map((team, index) => {
          return (
            <tr
              key={team.id}
              className={classNames(
                index % 2 === 0 && "bg-slate-50",
                "flex items-center text-sm font-medium h-[60px] hover:bg-slate-200 transition duration-75"
              )}
            >
              <td className="w-20 text-center font-normal">{team.rank}</td>
              <td className="w-[150px] text-center border-r h-full flex items-center justify-center">
                <Link
                  className="hover:text-secondary transition-all truncate"
                  href={`${ROUTES.LEAGUE}/${leagueName}/${ROUTES.TEAMS}/${team.id}`}
                >
                  {team.team}
                </Link>
              </td>

              <td className="w-[45px] text-center">{team.games}</td>
              <td className="w-[45px] text-center">{team.wins}</td>
              <td className="w-[45px] text-center">{team.losses}</td>
              <td className="w-[45px] text-center">{team.draws}</td>
              <td className="w-[45px] text-center">{team.winpct}</td>
              <td className="w-[45px] text-center">{team.pf}</td>
              <td className="w-[45px] text-center">{team.pa}</td>
              <td className="w-[45px] text-center">{team.plusminus}</td>
              <td className="w-[45px] text-center">{team.streak}</td>
            </tr>
          );
        })}
    </tbody>
  );
}
