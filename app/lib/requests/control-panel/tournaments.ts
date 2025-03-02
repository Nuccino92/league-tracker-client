import { z } from 'zod';

import {
  TournamentListResponse,
  tournamentListResponseSchema,
} from '@/app/lib/types/Responses/control-panel.types';
import { TournamentListItem } from '../../types/Models/Tournament';

export async function fetchTournaments({
  token,
  slug,
  params,
}: {
  token: string;
  slug: string;
  params?: string;
}) {
  return new Promise<TournamentListResponse>((resolve) => {
    setTimeout(() => {
      const result = tournamentListResponseSchema.parse(mockTournamentsList);
      resolve(mockTournamentsList);
    }, 400);
  });
}

const mockTournamentsList = {
  meta: {
    current_page: 1,
    last_page: 4,
    to: 0,
    from: 0,
    path: '',
    per_page: 0,
    total: 11,
    links: [],
  },
  data: [
    {
      id: 1,
      name: 'Spring Championship 2025',
      description: 'Annual spring tournament featuring top teams',
      format: 'single_elimination',
      tournament_type: 'standalone',
      season_id: null,
      status: 'active',
      created_at: '2025-01-15T08:00:00Z',
      updated_at: '2025-02-20T15:30:00Z',
    },
    {
      id: 2,
      name: 'Regional League Playoffs',
      description: 'End of season playoffs for regional division',
      format: 'double_elimination',
      tournament_type: 'playoff',
      season_id: 1,
      status: 'draft',
      created_at: '2025-02-01T10:00:00Z',
      updated_at: '2025-02-21T09:15:00Z',
    },
    {
      id: 3,
      name: 'Summer Cup 2025',
      description: 'Group stage followed by knockout rounds',
      format: 'group_knockout',
      tournament_type: 'standalone',
      season_id: null,
      status: 'draft',
      created_at: '2025-03-01T12:00:00Z',
      updated_at: '2025-03-01T12:00:00Z',
    },
    {
      id: 4,
      name: 'Winter Classic',
      description: 'Round robin tournament with top 8 teams',
      format: 'round_robin',
      tournament_type: 'standalone',
      season_id: null,
      status: 'completed',
      created_at: '2024-12-01T09:00:00Z',
      updated_at: '2025-01-15T18:45:00Z',
    },
    {
      id: 5,
      name: 'Qualification Series',
      description: 'Swiss format qualification tournament',
      format: 'swiss',
      tournament_type: 'playoff',
      season_id: 2,
      status: 'cancelled',
      created_at: '2025-01-20T14:00:00Z',
      updated_at: '2025-02-10T11:30:00Z',
    },
  ] as TournamentListItem[],
};
