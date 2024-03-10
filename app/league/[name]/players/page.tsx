import { getPlayersLinks } from "@/app/lib/collections/breadcrumbLinks";
import Breadcrumb from "@/app/lib/components/Breadcrumb";
import PlayerStats from "@/app/lib/components/playerStats/PlayerStats";
import { SportType } from "@/app/lib/types/sport.types";

const league = {
  name: "NBA",
  type: "basketball" as SportType,
}; // TODO: create a league provider to pass league information

// implement pagination + filter

export default function Players() {
  return (
    <div className="flex justify-center py-10 flex-col items-center">
      <div>
        <Breadcrumb links={getPlayersLinks({ name: league.name })} />
        <PlayerStats name={league.name} type={league.type} />
      </div>
    </div>
  );
}
