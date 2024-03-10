"use client";

import cryptoRandomString from "crypto-random-string";
import Link from "next/link";
import ROUTES from "@/app/lib/routesConfig";
import { usePathname } from "next/navigation";

type Props = {
  stats: any;
};

export default function LeagueLeaders({ stats }: Props) {
  return (
    <div className=" text-sm text-slate-900">
      <div className="text-base font-medium mb-2">League Leaders</div>

      <div>
        {stats.sport === "hockey" ? <HockeyStats stats={stats} /> : null}
        {stats.sport === "soccer" ? <SoccerStats stats={stats} /> : null}
        {stats.sport === "baseball" ? <BaseBallStats stats={stats} /> : null}
        {stats.sport === "basketball" ? (
          <BasketballStats stats={stats} />
        ) : null}
      </div>
    </div>
  );
}

function HockeyStats({ stats }: Props) {
  return <div>this is hockey</div>;
}

function SoccerStats({ stats }: Props) {
  return <div>this is soccer</div>;
}

function BaseBallStats({ stats }: Props) {
  return <div>this is baseball</div>;
}

type BasketballLeader = {
  playerID: string;
  type: string;
  total: number;
  name: string;
};

function BasketballStats({ stats }: Props) {
  const pathname = usePathname();

  return (
    <div className="space-y-4">
      <div>
        <div className="border-b w-full font-medium mb-1 flex items-center justify-between">
          <span>Points</span> <span className="text-xs">PTS</span>
        </div>
        <div className="space-y-1">
          {stats.leaders
            .sort(
              (a: BasketballLeader, b: BasketballLeader) => b.total - a.total
            )
            .map((leader: BasketballLeader) => {
              if (leader.type !== "points") return;
              return (
                <div
                  key={cryptoRandomString({ length: 10 })}
                  className="flex items-center justify-between"
                >
                  <Link
                    className="hover:text-secondary hover:underline"
                    href={`${pathname}/${ROUTES.PLAYER}/${leader.playerID}`}
                  >
                    {leader.name}
                  </Link>
                  <span className="font-medium text-sm">{leader.total}</span>
                </div>
              );
            })}{" "}
        </div>
      </div>
      <div>
        <div className="border-b w-full font-medium mb-1 flex items-center justify-between">
          <span>Assists</span>
          <span className="text-xs">AST</span>{" "}
        </div>
        <div className="space-y-1">
          {stats.leaders
            .sort(
              (a: BasketballLeader, b: BasketballLeader) => b.total - a.total
            )
            .map((leader: BasketballLeader) => {
              if (leader.type !== "assists") return;
              return (
                <div
                  key={cryptoRandomString({ length: 10 })}
                  className="flex items-center justify-between"
                >
                  <Link
                    className="hover:text-secondary hover:underline"
                    href={`${pathname}/${ROUTES.PLAYER}/${leader.playerID}`}
                  >
                    {leader.name}
                  </Link>
                  <span className="font-medium text-sm">{leader.total}</span>
                </div>
              );
            })}{" "}
        </div>
      </div>
      <div>
        <div className="border-b w-full font-medium mb-1 flex items-center justify-between">
          <span>Rebounds</span> <span className="text-xs">REB</span>
        </div>
        <div className="space-y-1">
          {stats.leaders
            .sort(
              (a: BasketballLeader, b: BasketballLeader) => b.total - a.total
            )
            .map((leader: BasketballLeader) => {
              if (leader.type !== "rebounds") return;
              return (
                <div
                  key={cryptoRandomString({ length: 10 })}
                  className="flex items-center justify-between"
                >
                  <Link
                    className="hover:text-secondary hover:underline"
                    href={`${pathname}/${ROUTES.PLAYER}/${leader.playerID}`}
                  >
                    {leader.name}
                  </Link>
                  <span className="font-medium text-sm">{leader.total}</span>
                </div>
              );
            })}{" "}
        </div>
      </div>
    </div>
  );
}
