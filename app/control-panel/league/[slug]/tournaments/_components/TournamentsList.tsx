'use client';

import { format, parseISO } from 'date-fns';

import StyledBox from '@/app/lib/components/StyledBox';
import { useTournaments } from '@/app/lib/hooks/api/control-panel/tournaments';
import { TournamentListItem } from '@/app/lib/types/Models/Tournament';
import { cn } from '@/app/lib/utils';
import Link from 'next/link';
import { HeroChevronRight } from '@/app/lib/SVGs';
import ROUTES from '@/app/lib/globals/routes';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';

export default function TournamentsList() {
  const { response, status } = useTournaments();

  return (
    <div>
      {response && status === 'success' && (
        <div>
          <div className='space-y-6'>
            {response.data.map((tournament) => {
              return <Tournament key={tournament.id} tournament={tournament} />;
            })}{' '}
          </div>
        </div>
      )}
      {status === 'loading' && <div>skeleton</div>}
    </div>
  );
}

function Tournament({ tournament }: { tournament: TournamentListItem }) {
  const { slug } = useLeagueControlPanel();

  const getStatusColor = (status: TournamentListItem['status']) => {
    const colors = {
      draft: 'bg-gray-200',
      active: 'bg-green-200',
      completed: 'bg-blue-200',
      cancelled: 'bg-red-200',
    };
    return colors[status] || 'bg-gray-200';
  };

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM d, yyyy');
  };

  return (
    <StyledBox key={tournament.id} classes='rounded-lg border p-4'>
      <div className='flex items-start justify-between'>
        <Link
          href={`${ROUTES.CONTROL_PANEL}${ROUTES.LEAGUE}/${slug}${ROUTES.CONTROL_PANEL_SUBROUTES.TOURNAMENTS}/${tournament.id}`}
          className='group inline-flex items-center gap-2 transition-colors hover:text-secondary'
        >
          <h3 className='text-xl font-semibold'>{tournament.name}</h3>
          <HeroChevronRight height={18} width={18} strokeWidth={3} />
        </Link>
        <span
          className={cn(
            getStatusColor(tournament.status),
            'rounded-full px-3 py-1 text-sm capitalize'
          )}
        >
          {tournament.status}
        </span>
      </div>

      <div className='mt-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4'>
        <div>
          <span className='text-gray-500'>Format:</span>
          <p className='capitalize'>{tournament.format.replace(/_/g, ' ')}</p>
        </div>
        <div>
          <span className='text-gray-500'>Type:</span>
          <p className='capitalize'>{tournament.tournament_type}</p>
        </div>
        <div>
          <span className='text-gray-500'>Created:</span>
          <p>{formatDate(tournament.created_at)}</p>
        </div>
        <div>
          <span className='text-gray-500'>Updated:</span>
          <p>{formatDate(tournament.updated_at)}</p>
        </div>
      </div>
    </StyledBox>
  );
}
