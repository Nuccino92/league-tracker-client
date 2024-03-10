// "use client";

import classNames from "classnames";
import { SportType } from "../../types/sport.types";
import Link from "next/link";
import ROUTES from "../../routesConfig";

// TODO:look to create a model from API call and use it from there
type Data = {
  id: string;
  name: string;
  team: string;
  rank: number;
  games: number;
  ppg: number;
  rpg: number;
  apg: number;
  fgpct: number;
  threepct: number;
  ftpct: number;
  spg: number;
  blkpg: number;
}[];

type Props = {
  data: Data;
  leagueName: string;
};

//TODO: fix reponsiveness of stats, finish breadcrumb

export default function BasketballPlayerStats({ data, leagueName }: Props) {
  return (
    <tbody className="block border border-indigo-100">
      {data
        .sort((a, b) => a.rank - b.rank)
        .map((player, index) => {
          return (
            <tr
              key={player.id}
              className={classNames(
                index % 2 === 0 && "bg-slate-50",
                "flex items-center text-sm font-medium h-[60px] hover:bg-slate-200 transition duration-75"
              )}
            >
              <td className="w-20 text-center font-normal">{player.rank}</td>
              {/* TODO: make into link to their player page */}
              <td className="w-[150px] text-center border-r h-full flex items-center justify-center">
                <Link
                  className="hover:text-secondary transition-all"
                  href={`${ROUTES.LEAGUE}/${leagueName}/${ROUTES.PLAYER}/${player.id}`}
                >
                  {player.name}
                </Link>
              </td>
              <td className="w-20 text-center">{player.team}</td>
              <td className="w-[45px] text-center">{player.games}</td>
              <td className="w-[45px] text-center">{player.ppg}</td>
              <td className="w-[45px] text-center">{player.rpg}</td>
              <td className="w-[45px] text-center">{player.apg}</td>
              <td className="w-[45px] text-center">{player.fgpct}</td>
              <td className="w-[45px] text-center">{player.threepct}</td>
              <td className="w-[45px] text-center">{player.ftpct}</td>
              <td className="w-[45px] text-center">{player.spg}</td>
              <td className="w-[45px] text-center">{player.blkpg}</td>
            </tr>
          );
        })}
    </tbody>
  );
}
