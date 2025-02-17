import {
  FollowedLeagueResponse,
  followedLeaguesResponseSchema,
  LeagueBillingHistoryItemResponse,
  leagueBillingHistoryItemResponseSchema,
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
      role: 'invitation',
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
    {
      id: 4,
      slug: 'oh-mah-gawd',
      name: 'Premier League II',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      logo: 'https://images.firstwefeast.com/complex/image/upload/c_limit,fl_progressive,q_80,w_1030/omox9xypgbi5mzqgo8rf.png',
      role: 'scorekeeper',
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
  leagueID: string | number;
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
    amount: 3213,
    currency: 'USD',
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

export async function getLeagueBillingHistory({
  token,
  params,
}: {
  token: string;
  params: string;
}) {
  return new Promise<LeagueBillingHistoryItemResponse>((resolve) => {
    setTimeout(() => {
      const result =
        leagueBillingHistoryItemResponseSchema.parse(mockBillingHis);
      resolve(result);
    }, 430);
  });
}

const mockBillingHis = {
  data: [
    {
      id: 1001,
      status: 'succeeded',
      amount: 3213,
      currency: 'USD',
      end_date: '2024-02-18T23:59:59Z',
      product_name: 'Professional',
      purchase_date: '2024-01-18T15:30:22Z',
    },
    {
      id: 982,
      status: 'processing',
      amount: 3521,
      currency: 'USD',
      end_date: '2024-01-18T23:59:59Z',
      product_name: 'Professional',
      purchase_date: '2023-12-18T14:22:45Z',
    },
    {
      id: 845,
      status: 'pending',
      amount: 71135,
      currency: 'USD',
      end_date: '2023-12-18T23:59:59Z',
      product_name: 'Starter',
      purchase_date: '2023-11-18T09:15:30Z',
    },
    {
      id: 723,
      status: 'failed',
      amount: 75413,
      currency: 'MXN',
      end_date: '2023-11-18T23:59:59Z',
      product_name: 'Starter',
      purchase_date: '2023-10-18T11:45:12Z',
    },
    {
      id: 654,
      status: 'refunded',
      amount: 1553,
      currency: 'EUR',
      end_date: '2023-10-18T23:59:59Z',
      product_name: 'Professional',
      purchase_date: '2023-09-18T16:20:00Z',
    },
    {
      id: 532,
      status: 'cancelled',
      amount: 5833,
      currency: 'CAD',
      end_date: '2023-09-18T23:59:59Z',
      product_name: 'Starter',
      purchase_date: '2023-08-18T10:05:33Z',
    },
  ],
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
};
