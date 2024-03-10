import ROUTES from "@/app/lib/routesConfig";

type LinkProps = {
  name: string;
};

type TeamLinksProps = {
  name: string;
  team: string;
  id: string;
};

export function getPlayersLinks({ name }: LinkProps) {
  return [
    {
      label: "Home",
      href: `${ROUTES.LEAGUE}/${name}`,
    },
    {
      label: "Players",
      href: `${ROUTES.LEAGUE}/${name}/${ROUTES.PLAYERS}`,
    },
  ];
}

export function getStandingsLinks({ name }: LinkProps) {
  return [
    {
      label: "Home",
      href: `${ROUTES.LEAGUE}/${name}`,
    },
    {
      label: "Standings",
      href: `${ROUTES.LEAGUE}/${name}/${ROUTES.STANDINGS}`,
    },
  ];
}

export function getTeamLinks({ name, team, id }: TeamLinksProps) {
  return [
    {
      label: "Home",
      href: `${ROUTES.LEAGUE}/${name}`,
    },
    {
      label: team,
      href: `${ROUTES.LEAGUE}/${name}/${ROUTES.TEAMS}/${id}`,
    },
  ];
}

export function getTeamsLinks({ name }: LinkProps) {
  return [
    {
      label: "Home",
      href: `${ROUTES.LEAGUE}/${name}`,
    },
    {
      label: "Teams",
      href: `${ROUTES.LEAGUE}/${name}/${ROUTES.TEAMS}`,
    },
  ];
}
