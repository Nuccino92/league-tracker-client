import { useState } from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { format, parseISO } from 'date-fns';

import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import { ControlPanelDetailedSeasonsListItem } from '@/app/lib/types/Responses/control-panel.types';
import {
  IconBxCalendarMinus,
  IconEllipsisVertical,
  IconLeaf,
  IconPersonCircle,
  IconSettingsOutline,
  IconTeamLine,
  Spinner,
} from '@/app/lib/SVGs';
import ROUTES from '@/app/lib/globals/routes';

import DropdownMenu from '@/app/lib/components/DropdownMenu';
import { MENU_ITEM_CLASSES } from '@/app/lib/globals/styles';
import SeasonSettingsModal from '@/app/control-panel/league/[slug]/seasons/_components/SeasonSettingsModal';
import ConcludeSeasonModal from '@/app/control-panel/league/[slug]/seasons/_components/ConcludeSeasonModal';

type Props = {
  seasons: ControlPanelDetailedSeasonsListItem[] | undefined;
  onLinkClick: () => void;
  isLoading: boolean;
};

export default function SeasonsList({
  seasons,
  onLinkClick,
  isLoading,
}: Props) {
  const { activeSeason } = useLeagueControlPanel();

  // TODO: add teams + players + created at

  // TODO: use separate api call

  return (
    <div>
      <div className='grid grid-cols-6 gap-4 border-b p-4 text-sm font-medium'>
        <div>Name</div>
        <div>Registrations</div>
        <div>Teams</div>
        <div>Players</div>
        <div>Created Date</div>
        <div></div>
      </div>

      {seasons && seasons.length > 0 && !isLoading && (
        <div className='divide-y'>
          {[...seasons]
            .sort((a, b) => {
              if (activeSeason?.id === a.id) return -1;
              if (activeSeason?.id === b.id) return 1;
              return 0;
            })
            .map((season) => (
              <SeasonItem
                key={season.id}
                season={season}
                onLinkClick={onLinkClick}
              />
            ))}
        </div>
      )}

      {seasons && seasons.length === 0 && !isLoading && (
        <div className='flex h-[300px] items-center justify-center'>
          Click the &quot;Create a new Season&quot; button to create a season
        </div>
      )}

      {isLoading && !seasons && (
        <div className='flex h-[300px] items-center justify-center'>
          <Spinner height={30} width={30} />
        </div>
      )}
    </div>
  );
}

function SeasonItem({
  season,
  onLinkClick,
}: {
  season: ControlPanelDetailedSeasonsListItem;
  onLinkClick: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { activeSeason, slug, hasSeasons } = useLeagueControlPanel();

  const seasonParam = searchParams.get('season');

  const [showConcludeSeasonModal, setShowConcludeSeasonModal] = useState(false);
  const [showSeasonSettingsModal, setShowSeasonSettingsModal] = useState(false);

  const dropdownOptions = [
    {
      label: 'Registrants',
      action: () => {
        router.push(
          `${ROUTES.CONTROL_PANEL}${ROUTES.LEAGUE}/${slug}${ROUTES.CONTROL_PANEL_SUBROUTES.REGISTRATIONS}?season=${season.id}`
        );
      },
      icon: <IconPersonCircle height={16} width={16} />,
    },
    {
      label: 'Teams',
      action: () => {
        router.push(pathname + '?' + `season=${season.id.toString()}`);
      },
      icon: <IconTeamLine height={16} width={16} />,
    },
    {
      label: 'Settings',
      action: () => setShowSeasonSettingsModal(true),
      icon: <IconSettingsOutline height={16} width={16} />,
    },
    ...(activeSeason?.id === season.id
      ? [
          {
            label: 'Conclude Season',
            action: () => setShowConcludeSeasonModal(true),
            icon: <IconBxCalendarMinus height={16} width={16} />,
          },
        ]
      : []),
  ];

  return (
    <>
      <div className='grid grid-cols-6 items-center gap-4 px-4 py-2 text-sm'>
        <Link
          onClick={() => {
            if (seasonParam === season.id.toString()) {
              onLinkClick();
            }
          }}
          href={pathname + '?' + `season=${season.id.toString()}`}
          className={classNames(
            season.id.toString() === searchParams.get('season') &&
              'text-secondary',
            'flex items-center gap-1 truncate font-medium hover:text-secondary'
          )}
        >
          <span className='truncate'>{season.name}</span>

          {activeSeason?.id === season.id && (
            <IconLeaf height={16} width={16} color='green' />
          )}
        </Link>

        <Link
          href={`${ROUTES.CONTROL_PANEL}${ROUTES.LEAGUE}/${slug}${ROUTES.CONTROL_PANEL_SUBROUTES.REGISTRATIONS}?season=${season.id}`}
          className='font-medium text-[#5454e6] hover:underline'
        >
          {season.registrants}
        </Link>
        <div>{season.teams}</div>
        <div>{season.players}</div>
        <div>{format(parseISO(season.created_at), 'PPP')}</div>

        <div className='flex justify-end gap-2'>
          <DropdownMenu
            items={dropdownOptions}
            buttonIcon={(open) => (
              <IconEllipsisVertical color={open ? 'white' : 'currentColor'} />
            )}
            itemContainerClasses='!left-[-11rem]'
            itemClasses={`${MENU_ITEM_CLASSES}`}
          />
        </div>
      </div>{' '}
      {showConcludeSeasonModal ? (
        <ConcludeSeasonModal
          panelClasses='sm:w-[450px] w-full'
          isOpen={showConcludeSeasonModal}
          close={() => {
            // TODO: send api request to conclude season
            setShowConcludeSeasonModal(false);
          }}
        />
      ) : null}
      {showSeasonSettingsModal ? (
        <SeasonSettingsModal
          panelClasses='sm:w-[450px] w-full'
          isOpen={showSeasonSettingsModal}
          close={() => {
            setShowSeasonSettingsModal(false);
          }}
          seasonId={season.id}
        />
      ) : null}
    </>
  );
}
