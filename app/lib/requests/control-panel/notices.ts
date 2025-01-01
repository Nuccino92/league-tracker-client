import { z } from 'zod';
import {
  DeliveryDetailsResponse,
  deliveryDetailsResponseSchema,
  NoticeItem,
  noticeItemSchema,
  NoticeStatistics,
  noticeStatisticsSchema,
} from '@/app/lib/types/Responses/control-panel.types';

export async function fetchNoticeStatistics({
  token,
  slug,
}: {
  token: string;
  slug: string;
}) {
  console.log('fetching notice statistics');

  return new Promise<NoticeStatistics>((resolve) => {
    setTimeout(() => {
      const result = noticeStatisticsSchema.parse(mockStatistics);
      resolve(result);
    }, 400);
  });
}

// this data comes from checking the announcement_deliveries  table

// To check limits

// SELECT
//   COUNT(*) as email_count
// FROM announcement_deliveries
// WHERE
//   league_id = ? AND
//   email_delivered = true AND
//   EXTRACT(MONTH FROM created_at) = CURRENT_MONTH;

// To check active announcements

// SELECT
//   COUNT(*) as total,
//   SUM(CASE WHEN display_location = 'league_website' THEN 1 ELSE 0 END) as league_count,
//   SUM(CASE WHEN display_location = 'team_website' THEN 1 ELSE 0 END) as team_count
// FROM announcements
// WHERE
//   league_id = ? AND
//   display_location IS NOT NULL AND
//   (start_date IS NULL OR start_date <= CURRENT_TIMESTAMP) AND
//   (end_date IS NULL OR end_date >= CURRENT_TIMESTAMP);

const mockStatistics = {
  messages_sent: {
    total: 245,
    breakdown: {
      email: 150,
      sms: 95,
    },
  },
  credits_remaining: {
    email: {
      used: 150,
      total: 1500,
      remaining: 1350,
    },
    sms: {
      used: 95,
      total: 1000,
      remaining: 905,
    },
  },
  active_announcements: {
    total: 3,
    breakdown: {
      league: 1,
      team: 2,
    },
  },
};

export async function fetchNoticeList({
  token,
  slug,
}: {
  token: string;
  slug: string;
}) {
  return new Promise<NoticeItem[]>((resolve) => {
    setTimeout(() => {
      const result = z.array(noticeItemSchema).parse(mockList);
      resolve(result);
    }, 400);
  });
}

const mockList: NoticeItem[] = [
  {
    id: 1,
    title: 'Game Cancellation Notice',
    message: 'The game has been cancelled',
    delivery_type: ['email', 'sms'],
    recipient_type: 'player',
    recipient_scope: 'all',
    start_date: null,
    end_date: null,
    delivery_stats: {
      recipients: 150,
      delivered: 150,
    },
    season: { id: 1, name: '2021' },
    created_at: '2021-09-01T00:00:00.000Z',
  },
  {
    id: 2,
    title: 'A new announcement',
    message: 'This is a new announcement',
    recipient_type: 'team',
    recipient_scope: 'specific',
    delivery_type: ['email'],
    start_date: null,
    end_date: null,
    delivery_stats: {
      recipients: 67,
      delivered: 63,
    },
    season: null,
    created_at: '2022-07-21T00:00:00.000Z',
  },

  {
    id: 3,
    title: 'Registrations are open',
    message: 'Registrations are open for the new season',
    delivery_type: ['website'],
    recipient_type: null,
    recipient_scope: null,
    start_date: '2024-11-01T00:00:00.000Z',
    end_date: '2024-11-15T00:00:00.000Z',
    delivery_stats: null,
    season: { id: 441, name: '2023 basketblla szn' },
    created_at: '2024-11-15T00:00:00.000Z',
  },
];

export async function fetchNoticeDetails({
  token,
  slug,
  noticeId,
  params,
}: {
  token: string;
  slug: string;
  noticeId: number;
  params: string;
}) {
  return new Promise<DeliveryDetailsResponse>((resolve) => {
    setTimeout(() => {
      const result = deliveryDetailsResponseSchema.parse(mockDeliveryDetails);
      resolve(result);
    }, 700);
  });
}

const mockDeliveryDetails: DeliveryDetailsResponse = {
  announcement_id: 1,
  delivery_details: [
    {
      recipient_id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      phone: '1234567890',
      email_status: 'delivered',
      email_delivered_at: '2024-12-31T16:30:00Z',
      sms_status: 'delivered',
      sms_delivered_at: '2024-12-31T16:30:01Z',
    },
    {
      recipient_id: 2,
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: null,
      email_status: 'failed',
      email_delivered_at: null,
      sms_status: null,
      sms_delivered_at: null,
    },
    {
      recipient_id: 3,
      name: 'Bob Wilson',
      email: null,
      phone: '9876543210',
      email_status: null,
      email_delivered_at: null,
      sms_status: 'failed',
      sms_delivered_at: null,
    },
  ],
};

export async function createNotice({
  token,
  slug,
  noticeData,
}: {
  token: string;
  slug: string;
  noticeData: any; //TODO: define noticeData type
}) {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 400);
  });
}

export async function retryNotice({
  token,
  slug,
  noticeId,
}: {
  token: string;
  slug: string;
  noticeId: number;
}) {
  const retryReplySchema = z.object({});

  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 400);
  });
}
