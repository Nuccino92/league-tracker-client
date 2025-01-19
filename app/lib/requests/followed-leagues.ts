import {
  FollowedLeagueResponse,
  followedLeaguesResponseSchema,
  LeaguesForBookmarkResponse,
  leaguesForBookmarkResponseSchema,
  LeagueSubscriptionInformation,
  leagueSubscriptionInformationSchema,
} from '@/app/lib/types/followed-leagues.types';

export async function getFollowedLeagues({ token }: { token: string }) {
  return new Promise<FollowedLeagueResponse>((resolve) => {
    setTimeout(() => {
      const result = followedLeaguesResponseSchema.parse(mockJoinedRes);
      resolve(result);
    }, 430);
  });
}

const mockJoinedRes: FollowedLeagueResponse = {
  joined_leagues: [
    {
      id: 1,
      slug: 'oh-mah-gawd',
      name: 'Premier League',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      logo: 'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
      role: 'member',
    },
    {
      id: 2,
      slug: 'oh-mah-gawd',
      name: 'NBA Summer League',
      description:
        'Off-season basketball competition for rookies and young players',
      logo: 'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
      role: 'admin',
    },
    {
      id: 3,
      slug: 'oh-mah-gawd',
      name: 'Local Rugby League',
      description: null,
      logo: null,
      role: 'owner',
    },
  ],
  bookmarked_leagues: [
    {
      id: 4,
      slug: 'oh-mah-gawd',
      name: 'La Liga',
      description: "Spain's primary football competition",
      logo: 'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
    },
    {
      id: 5,
      slug: 'oh-mah-gawd',
      name: 'MLB Minor League',
      description: "Professional baseball's developmental league system",
      logo: null,
    },
    {
      id: 6,
      slug: 'oh-mah-gawd',
      name: 'Amateur Boxing League',
      description: null,
      logo: null,
    },
  ],
};

export async function removeJoinedLeague({
  id,
  token,
}: {
  id: number;
  token: string;
}) {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 430);
  });
}

export async function removeBookmarkedLeague({
  id,
  token,
}: {
  id: number;
  token: string;
}) {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 430);
  });
}

export async function getLeaguesForBookmark({
  query,
  token,
}: {
  query: string;
  token: string;
}) {
  // cap this at 5 total

  return new Promise<LeaguesForBookmarkResponse>((resolve) => {
    setTimeout(() => {
      const result = leaguesForBookmarkResponseSchema.parse(mockLeaguesRes);
      resolve(result);
    }, 810);
  });
}

const mockLeaguesRes: LeaguesForBookmarkResponse = [
  {
    id: 4,
    slug: 'oh-mah-gawd',
    name: 'La Liga',
    description: "Spain's primary football competition",
    logo: 'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
  },
  {
    id: 5,
    slug: 'oh-mah-gawd',
    name: 'MLB Minor League',
    description: "Professional baseball's developmental league system",
    logo: null,
  },
  {
    id: 6,
    slug: 'oh-mah-gawd',
    name: 'Amateur Boxing League',
    description: null,
    logo: null,
  },
  {
    id: 7,
    slug: 'oh-mah-gawd',
    name: 'Pokemon league',
    description: null,
    logo: 'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
  },
  {
    id: 9,
    slug: 'oh-mah-gawd',
    name: 'Jimmies bball league',
    description: null,
    logo: null,
  },
];

export async function addBookmarkedLeague({
  id,
  token,
}: {
  id: number;
  token: string;
}) {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 430);
  });
}

export async function getLeagueSubscriptionInformation({
  token,
  leagueID,
}: {
  token: string;
  leagueID: string;
}) {
  return new Promise<LeagueSubscriptionInformation>((resolve) => {
    setTimeout(() => {
      const result = leagueSubscriptionInformationSchema.parse(mockSubInfoData);
      resolve(result);
    }, 430);
  });
}

const mockSubInfoData = {
  subscription: {
    id: 'pro',
    name: 'Starter',
    start_date: '2025-03-09 04:15:13',
    end_date: '2025-01-19 04:15:13',
    billing_frequency: 'monthly',
  },

  has_subscription_autorenewal: true,
};

export async function toggleLeagueSubscriptionAutoRenewal({
  leagueID,
  token,
  isRenewed,
}: {
  leagueID: string;
  token: string;
  isRenewed: boolean;
}) {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 330);
  });
}
