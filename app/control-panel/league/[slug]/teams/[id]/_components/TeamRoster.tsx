'use client';

import { useEffect, useState } from 'react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';

import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import {
  EditIcon,
  IconEllipsisVertical,
  IconTeamLine,
  IconUserDelete,
  Spinner,
} from '@/app/lib/SVGs';
import { usePlayers } from '@/app/lib/hooks/api/control-panel/players';
import useQueryString from '@/app/lib/hooks/useQueryString';
import Image from 'next/image';
import getInitials from '@/app/lib/utils/getInitials';
import { BasePlayer } from '@/app/lib/types/Models/Player';
import DropdownMenu from '@/app/lib/components/DropdownMenu';
import { MENU_ITEM_CLASSES } from '@/app/lib/globals/styles';
import PlayerForm from '@/app/control-panel/league/[slug]/players/_components/PlayerForm';
import RemoveFromRosterModal from '@/app/control-panel/league/[slug]/players/_components/RemoveFromRosterModal';

export default function TeamRoster() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const pathname = usePathname();

  const { leagueData, activeSeason, hasSeasons } = useLeagueControlPanel();

  const selectedSeason = searchParams.get('season')
    ? leagueData.seasons.all_seasons.find(
        (season) => season.id === parseInt(searchParams.get('season') as string)
      )?.id
    : null;

  const doesURLContainCorrectTeamSearchParam =
    !searchParams.get('team') || searchParams.get('team') !== params.id
      ? false
      : true;

  const { data, status } = usePlayers({
    slug: params.slug as string,
    includeOnly: ['season', 'team', 'search'],
    enabled: doesURLContainCorrectTeamSearchParam,
  });

  const { createQueryString } = useQueryString();

  useEffect(() => {
    if (!doesURLContainCorrectTeamSearchParam) {
      router.push(pathname + '?' + createQueryString('team', params.id));
    }
  }, [
    createQueryString,
    doesURLContainCorrectTeamSearchParam,
    params.id,
    pathname,
    router,
  ]);

  // if(!searchParams.get('team')|| searchParams.get('team') !== params.id) {
  //   router.push('')
  // }

  /**
   * If the team is involved in the season, display the roster. Only allow editing if they are in the active season
   *
   * if no season is selected then display message to select season if the league actually has seasons. if they are not involved in a selected season then display message saying that this team isnt involved in the selected season
   */

  return (
    <div>
      {hasSeasons ? (
        <div className='p-8'>
          {status === 'success' && data && (
            <div className='divide-y'>
              {data.length > 0 &&
                data.map((player) => (
                  <Player key={player.id} player={player} />
                ))}
              {data.length === 0 && <div>empty</div>}
            </div>
          )}

          {status === 'loading' ? (
            <div className='flex items-center justify-center py-[300px]'>
              <Spinner height={30} width={30} />
            </div>
          ) : null}
        </div>
      ) : (
        <div className='flex flex-col items-center space-y-2 border border-transparent py-[132px] text-center text-lg font-medium'>
          <IconTeamLine height={44} width={44} />

          <div>
            <span className='font-bold'>{leagueData.league_info.name}</span>{' '}
            does not have an active season
          </div>
        </div>
      )}
    </div>
  );
}

function Player({ player }: { player: BasePlayer }) {
  const [showPlayerEditModal, setShowPlayerEditModal] = useState(false);
  const [showRemoveFromRosterModal, setShowRemoveFromRosterModal] =
    useState(false);

  const dropdownOption = [
    {
      label: 'Edit',
      action: () => setShowPlayerEditModal(true),
      icon: <EditIcon width={20} height={20} />,
    },
    {
      label: 'Remove from team',
      action: () => setShowRemoveFromRosterModal(true),
      icon: <IconUserDelete width={20} height={20} />,
    },
  ];

  return (
    <>
      <div key={player.id} className='flex items-center justify-between py-4'>
        <div className='flex items-center gap-2'>
          {player.avatar ? (
            <Image
              src={player.avatar}
              alt='Player avatar'
              height={40}
              width={40}
              className='h-10 w-10 rounded-md border'
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className='flex h-10 w-10 items-center justify-center rounded-md border bg-primary font-medium text-white'>
              {getInitials(player.name)}
            </div>
          )}

          <button
            className='hover:text-secondary'
            onClick={() => setShowPlayerEditModal(true)}
          >
            {player.name}
          </button>
        </div>

        <DropdownMenu
          items={dropdownOption}
          buttonIcon={(open) => (
            <IconEllipsisVertical color={open ? 'white' : 'currentColor'} />
          )}
          itemContainerClasses='!left-[-11rem]'
          itemClasses={`${MENU_ITEM_CLASSES}`}
        />
      </div>

      {showPlayerEditModal ? (
        <PlayerForm
          isOpen={showPlayerEditModal}
          close={() => setShowPlayerEditModal(false)}
          playerId={player.id}
        />
      ) : null}

      {showRemoveFromRosterModal && (
        <RemoveFromRosterModal
          isOpen={showRemoveFromRosterModal}
          close={() => setShowRemoveFromRosterModal(false)}
        />
      )}
    </>
  );
}
