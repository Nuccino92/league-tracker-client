import ROUTES from '@/app/lib/globals/routes';
import { League } from '@/app/lib/types/Models/League';
import { LeagueInformationResource } from '@/app/lib/types/Resources/CreateLeagueResource';
import { SubscriptionInformationSchema } from '@/app/lib/types/Resources/SubscriptionResource';
import {
  SportsList,
  sportsListSchema,
} from '@/app/lib/types/Responses/create-league-types';

export async function createLeagueRequest({
  token,
  formData,
  subscription,
}: {
  token: string;
  formData: LeagueInformationResource;
  subscription?: SubscriptionInformationSchema;
}) {
  const formDataFormatted = {
    ...formData,
    primary_color: formData.primary_color,
    secondary_color: formData.secondary_color,
  };

  let subscriptionFormatted;
  if (subscription) {
    subscriptionFormatted = {
      ...subscription,
      payment_method_id: subscription.payment_method_id,
    };
  }

  const requestBody = {
    form_data: formDataFormatted,
    // Only include subscription if it's present
    ...(subscriptionFormatted && { subscription: subscriptionFormatted }),
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_KEEPR_API_URL}${ROUTES.LEAGUE}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) throw Error('failed to created league');

  const { league } = (await response.json()) as any;

  return league as League;
}

export async function updateLeagueInformation({
  token,
  slug,
  leagueData,
}: {
  token: string;
  slug: string;
  leagueData: LeagueInformationResource;
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_KEEPR_API_URL}${ROUTES.LEAGUE}/${slug}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leagueData),
    }
  );

  if (!response.ok) throw Error('Failed to update league');

  const { league } = (await response.json()) as any;

  return league as League;
}

export async function getCreateLeagueSports({ token }: { token: string }) {
  return new Promise<SportsList>((resolve) => {
    setTimeout(() => {
      const result = sportsListSchema.parse(mockSportsList);
      resolve(result);
    }, 730);
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_KEEPR_API_URL}${ROUTES.LEAGUE}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw Error('Failed to retrieve league');
}

const mockSportsList: SportsList = {
  basketball: {
    info: {
      name: 'Basketball',
      value: 'basketball',
    },
    stat_categories: null,
    stats: [
      // Core Stats
      {
        id: 1,
        name: 'Points',
        code: 'PTS',
        sport_type: 'basketball',
        is_locked: true,
        description: 'Total points scored',
      },
      {
        id: 2,
        name: 'Rebounds',
        code: 'REB',
        sport_type: 'basketball',
        is_locked: true,
        description: 'Total rebounds',
      },
      {
        id: 3,
        name: 'Assists',
        code: 'AST',
        sport_type: 'basketball',
        is_locked: true,
        description: 'Number of assists',
      },
      {
        id: 4,
        name: 'Steals',
        code: 'STL',
        sport_type: 'basketball',
        is_locked: false,
        description: 'Number of steals',
      },
      {
        id: 5,
        name: 'Blocks',
        code: 'BLK',
        sport_type: 'basketball',
        is_locked: false,
        description: 'Number of blocks',
      },
      // Shooting
      {
        id: 6,
        name: 'Field Goals Made',
        code: 'FGM',
        sport_type: 'basketball',
        is_locked: false,
        description: 'Field goals made',
        category: 'shooting',
      },
      {
        id: 7,
        name: 'Field Goals Attempted',
        code: 'FGA',
        sport_type: 'basketball',
        is_locked: false,
        description: 'Field goals attempted',
        category: 'shooting',
      },
      {
        id: 8,
        name: '3-Pointers Made',
        code: '3PM',
        sport_type: 'basketball',
        is_locked: false,
        description: 'Three pointers made',
        category: 'shooting',
      },
      {
        id: 9,
        name: '3-Pointers Attempted',
        code: '3PA',
        sport_type: 'basketball',
        is_locked: false,
        description: 'Three pointers attempted',
        category: 'shooting',
      },
      {
        id: 10,
        name: 'Free Throws Made',
        code: 'FTM',
        sport_type: 'basketball',
        is_locked: false,
        description: 'Free throws made',
        category: 'shooting',
      },
      {
        id: 11,
        name: 'Free Throws Attempted',
        code: 'FTA',
        sport_type: 'basketball',
        is_locked: false,
        description: 'Free throws attempted',
        category: 'shooting',
      },
      // Additional
      {
        id: 12,
        name: 'Turnovers',
        code: 'TO',
        sport_type: 'basketball',
        is_locked: false,
        description: 'Number of turnovers',
      },
      {
        id: 13,
        name: 'Minutes Played',
        code: 'MIN',
        sport_type: 'basketball',
        is_locked: false,
        description: 'Minutes played',
      },
      {
        id: 14,
        name: 'Personal Fouls',
        code: 'PF',
        sport_type: 'basketball',
        is_locked: false,
        description: 'Personal fouls committed',
      },
    ],
  },

  baseball: {
    info: {
      name: 'Baseball',
      value: 'baseball',
    },
    stat_categories: ['hitting', 'pitching'],
    stats: [
      // Hitting
      {
        id: 15,
        name: 'At Bats',
        code: 'AB',
        sport_type: 'baseball',
        is_locked: false,
        description: 'At bats',
        category: 'hitting',
      },
      {
        id: 16,
        name: 'Hits',
        code: 'H',
        sport_type: 'baseball',
        is_locked: true,
        description: 'Number of hits',
        category: 'hitting',
      },
      {
        id: 17,
        name: 'Runs',
        code: 'R',
        sport_type: 'baseball',
        is_locked: true,
        description: 'Runs scored',
        category: 'hitting',
      },
      {
        id: 18,
        name: 'Runs Batted In',
        code: 'RBI',
        sport_type: 'baseball',
        is_locked: true,
        description: 'Runs batted in',
        category: 'hitting',
      },
      {
        id: 19,
        name: 'Home Runs',
        code: 'HR',
        sport_type: 'baseball',
        is_locked: false,
        description: 'Home runs',
        category: 'hitting',
      },
      {
        id: 20,
        name: 'Doubles',
        code: '2B',
        sport_type: 'baseball',
        is_locked: false,
        description: 'Doubles hit',
        category: 'hitting',
      },
      {
        id: 21,
        name: 'Triples',
        code: '3B',
        sport_type: 'baseball',
        is_locked: false,
        description: 'Triples hit',
        category: 'hitting',
      },
      {
        id: 22,
        name: 'Walks',
        code: 'BB',
        sport_type: 'baseball',
        is_locked: false,
        description: 'Walks/Base on balls',
        category: 'hitting',
      },
      {
        id: 23,
        name: 'Strikeouts',
        code: 'K',
        sport_type: 'baseball',
        is_locked: false,
        description: 'Times struck out',
        category: 'hitting',
      },
      {
        id: 24,
        name: 'Stolen Bases',
        code: 'SB',
        sport_type: 'baseball',
        is_locked: false,
        description: 'Stolen bases',
        category: 'hitting',
      },
      // Pitching
      {
        id: 25,
        name: 'Innings Pitched',
        code: 'IP',
        sport_type: 'baseball',
        is_locked: true,
        description: 'Innings pitched',
        category: 'pitching',
      },
      {
        id: 26,
        name: 'Hits Allowed',
        code: 'H',
        sport_type: 'baseball',
        is_locked: false,
        description: 'Hits allowed',
        category: 'pitching',
      },
      {
        id: 27,
        name: 'Runs Allowed',
        code: 'R',
        sport_type: 'baseball',
        is_locked: true,
        description: 'Runs allowed',
        category: 'pitching',
      },
      {
        id: 28,
        name: 'Earned Runs',
        code: 'ER',
        sport_type: 'baseball',
        is_locked: false,
        description: 'Earned runs allowed',
        category: 'pitching',
      },
      {
        id: 29,
        name: 'Walks Given',
        code: 'BB',
        sport_type: 'baseball',
        is_locked: false,
        description: 'Walks allowed',
        category: 'pitching',
      },
      {
        id: 30,
        name: 'Strikeouts Thrown',
        code: 'K',
        sport_type: 'baseball',
        is_locked: true,
        description: 'Batters struck out',
        category: 'pitching',
      },
      {
        id: 31,
        name: 'Home Runs Allowed',
        code: 'HR',
        sport_type: 'baseball',
        is_locked: false,
        description: 'Home runs allowed',
        category: 'pitching',
      },
    ],
  },

  hockey: {
    info: {
      name: 'Hockey',
      value: 'hockey',
    },
    stat_categories: ['skater', 'goalie'],
    stats: [
      // Skater Stats
      {
        id: 32,
        name: 'Goals',
        code: 'G',
        sport_type: 'hockey',
        is_locked: true,
        description: 'Goals scored',
        category: 'skater',
      },
      {
        id: 33,
        name: 'Assists',
        code: 'A',
        sport_type: 'hockey',
        is_locked: true,
        description: 'Assists',
        category: 'skater',
      },
      {
        id: 34,
        name: 'Plus/Minus',
        code: '+/-',
        sport_type: 'hockey',
        is_locked: false,
        description: 'Plus/minus rating',
        category: 'skater',
      },
      {
        id: 35,
        name: 'Penalty Minutes',
        code: 'PIM',
        sport_type: 'hockey',
        is_locked: false,
        description: 'Penalty minutes',
        category: 'skater',
      },
      {
        id: 36,
        name: 'Shots on Goal',
        code: 'SOG',
        sport_type: 'hockey',
        is_locked: false,
        description: 'Shots on goal',
        category: 'skater',
      },
      {
        id: 37,
        name: 'Hits',
        code: 'HIT',
        sport_type: 'hockey',
        is_locked: false,
        description: 'Number of hits',
        category: 'skater',
      },
      {
        id: 38,
        name: 'Blocks',
        code: 'BLK',
        sport_type: 'hockey',
        is_locked: false,
        description: 'Shots blocked',
        category: 'skater',
      },
      // Goalie Stats
      {
        id: 39,
        name: 'Saves',
        code: 'SV',
        sport_type: 'hockey',
        is_locked: true,
        description: 'Number of saves',
        category: 'goalie',
      },
      {
        id: 40,
        name: 'Goals Against',
        code: 'GA',
        sport_type: 'hockey',
        is_locked: true,
        description: 'Goals allowed',
        category: 'goalie',
      },
      {
        id: 41,
        name: 'Shots Against',
        code: 'SA',
        sport_type: 'hockey',
        is_locked: false,
        description: 'Shots faced',
        category: 'goalie',
      },
      {
        id: 42,
        name: 'Minutes Played',
        code: 'MIN',
        sport_type: 'hockey',
        is_locked: false,
        description: 'Minutes played',
      },
    ],
  },

  soccer: {
    info: {
      name: 'Soccer',
      value: 'soccer',
    },
    stat_categories: ['field', 'goalkeeper'],
    stats: [
      // Field Player Stats
      {
        id: 43,
        name: 'Goals',
        code: 'G',
        sport_type: 'soccer',
        is_locked: true,
        description: 'Goals scored',
        category: 'field',
      },
      {
        id: 44,
        name: 'Assists',
        code: 'A',
        sport_type: 'soccer',
        is_locked: true,
        description: 'Assists',
        category: 'field',
      },
      {
        id: 45,
        name: 'Shots',
        code: 'SH',
        sport_type: 'soccer',
        is_locked: false,
        description: 'Shots taken',
        category: 'field',
      },
      {
        id: 46,
        name: 'Shots on Target',
        code: 'SOT',
        sport_type: 'soccer',
        is_locked: false,
        description: 'Shots on target',
        category: 'field',
      },
      {
        id: 47,
        name: 'Yellow Cards',
        code: 'YC',
        sport_type: 'soccer',
        is_locked: false,
        description: 'Yellow cards received',
        category: 'field',
      },
      {
        id: 48,
        name: 'Red Cards',
        code: 'RC',
        sport_type: 'soccer',
        is_locked: false,
        description: 'Red cards received',
        category: 'field',
      },
      {
        id: 49,
        name: 'Fouls Committed',
        code: 'FC',
        sport_type: 'soccer',
        is_locked: false,
        description: 'Fouls committed',
        category: 'field',
      },
      {
        id: 50,
        name: 'Minutes Played',
        code: 'MIN',
        sport_type: 'soccer',
        is_locked: false,
        description: 'Minutes played',
      },
      // Goalkeeper Stats
      {
        id: 51,
        name: 'Saves',
        code: 'SV',
        sport_type: 'soccer',
        is_locked: true,
        description: 'Saves made',
        category: 'goalkeeper',
      },
      {
        id: 52,
        name: 'Goals Conceded',
        code: 'GC',
        sport_type: 'soccer',
        is_locked: true,
        description: 'Goals conceded',
        category: 'goalkeeper',
      },
      {
        id: 53,
        name: 'Clean Sheets',
        code: 'CS',
        sport_type: 'soccer',
        is_locked: false,
        description: 'Clean sheets/Shutouts',
        category: 'goalkeeper',
      },
    ],
  },

  football: {
    info: {
      name: 'Football',
      value: 'football',
    },
    stat_categories: ['passing', 'rushing', 'receiving', 'defense', 'kicking'],
    stats: [
      // Passing
      {
        id: 54,
        name: 'Passes Completed',
        code: 'PC',
        sport_type: 'football',
        is_locked: false,
        description: 'Passes completed',
        category: 'passing',
      },
      {
        id: 55,
        name: 'Passes Attempted',
        code: 'PA',
        sport_type: 'football',
        is_locked: false,
        description: 'Passes attempted',
        category: 'passing',
      },
      {
        id: 56,
        name: 'Passing Yards',
        code: 'PYD',
        sport_type: 'football',
        is_locked: true,
        description: 'Passing yards',
        category: 'passing',
      },
      {
        id: 57,
        name: 'Passing Touchdowns',
        code: 'PTD',
        sport_type: 'football',
        is_locked: true,
        description: 'Passing touchdowns',
        category: 'passing',
      },
      {
        id: 58,
        name: 'Interceptions Thrown',
        code: 'INT',
        sport_type: 'football',
        is_locked: false,
        description: 'Interceptions thrown',
        category: 'passing',
      },
      // Rushing
      {
        id: 59,
        name: 'Rushing Attempts',
        code: 'RA',
        sport_type: 'football',
        is_locked: false,
        description: 'Rushing attempts',
        category: 'rushing',
      },
      {
        id: 60,
        name: 'Rushing Yards',
        code: 'RYD',
        sport_type: 'football',
        is_locked: true,
        description: 'Rushing yards',
        category: 'rushing',
      },
      {
        id: 61,
        name: 'Rushing Touchdowns',
        code: 'RTD',
        sport_type: 'football',
        is_locked: true,
        description: 'Rushing touchdowns',
        category: 'rushing',
      },
      // Receiving
      {
        id: 62,
        name: 'Receptions',
        code: 'REC',
        sport_type: 'football',
        is_locked: false,
        description: 'Passes caught',
        category: 'receiving',
      },
      {
        id: 63,
        name: 'Receiving Yards',
        code: 'RCYD',
        sport_type: 'football',
        is_locked: true,
        description: 'Receiving yards',
        category: 'receiving',
      },
      {
        id: 64,
        name: 'Receiving Touchdowns',
        code: 'RCTD',
        sport_type: 'football',
        is_locked: true,
        description: 'Receiving touchdowns',
        category: 'receiving',
      },
      // Defense
      {
        id: 65,
        name: 'Tackles',
        code: 'TKL',
        sport_type: 'football',
        is_locked: false,
        description: 'Tackles made',
        category: 'defense',
      },
      {
        id: 66,
        name: 'Sacks',
        code: 'SK',
        sport_type: 'football',
        is_locked: true,
        description: 'Quarterback sacks',
        category: 'defense',
      },
      {
        id: 67,
        name: 'Interceptions Made',
        code: 'INT',
        sport_type: 'football',
        is_locked: true,
        description: 'Passes intercepted',
        category: 'defense',
      },
      {
        id: 68,
        name: 'Fumbles Forced',
        code: 'FF',
        sport_type: 'football',
        is_locked: false,
        description: 'Fumbles forced',
        category: 'defense',
      },
      // Kicking
      {
        id: 69,
        name: 'Field Goals Made',
        code: 'FGM',
        sport_type: 'football',
        is_locked: false,
        description: 'Field goals made',
        category: 'kicking',
      },
      {
        id: 70,
        name: 'Field Goals Attempted',
        code: 'FGA',
        sport_type: 'football',
        is_locked: false,
        description: 'Field goals attempted',
        category: 'kicking',
      },
      {
        id: 71,
        name: 'Extra Points Made',
        code: 'XPM',
        sport_type: 'football',
        is_locked: false,
        description: 'Extra points made',
        category: 'kicking',
      },
    ],
  },
};

/**
 * stat_category 
 * 
 * 
 *   -- Baseball
  'hitting',
  'pitching',
  
  -- Hockey
  'skater',
  'goalie',
  
  -- Football
  'passing',
  'rushing',
  'receiving',
  'defense',
  'kicking',
  
  -- Soccer
  'field',
  'goalkeeper',
  
  -- Basketball
  'shooting',  // Optional since basketball typically doesn't need categories
  'general'   
 */
