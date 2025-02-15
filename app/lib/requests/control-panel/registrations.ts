import { z } from 'zod';
import {
  RegistrationItem,
  registrationItemSchema,
  RegistrantItem,
  registrantItemSchema,
  CreateRegistrationFormValues,
  registrationStatsResponseSchema,
  ReigstrationStatsResponse,
} from '@/app/lib/types/Responses/control-panel.types';
import { PaginationMetaSchema } from '@/app/lib/types/pagination.types';
import { CurrencyCode } from '@/app/lib/collections/currencies';

export async function fetchRegistrationForms({
  token,
  slug,
  paginate = true,
}: {
  token: string;
  slug: string;
  paginate: boolean;
}) {
  const registrationFormsReponseSchema = z.object({
    data: z.array(registrationItemSchema),
    meta: PaginationMetaSchema.nullable(),
  });

  type RegistrationFormsResponse = z.infer<
    typeof registrationFormsReponseSchema
  >;

  return new Promise<RegistrationFormsResponse>((resolve) => {
    setTimeout(() => {
      const result = registrationFormsReponseSchema.parse(
        mockRegistrationFormList
      );
      resolve(result);
    }, 400);
  });
}

const mockRegistrationFormList = {
  meta: null,
  data: [
    {
      id: 1,
      league: {
        id: 1,
        name: 'Downtown Recreational League',
      },
      season: {
        id: 1,
        name: 'Spring 2024',
      },
      price: 99.99,
      max_registrants: 102,
      openDate: '2024-03-09 04:15:13',
      closeDate: null,
      description:
        'Spring 2024 Basketball League Registration. Join our recreational basketball league for players of all skill levels.',
    },
    {
      id: 2,
      league: {
        id: 1,
        name: 'Downtown Recreational League',
      },
      season: {
        id: 2,
        name: 'Spring 2023',
      },
      price: 99.99,
      max_registrants: 206,
      openDate: '2024-03-09 04:15:13',
      closeDate: null,
      description:
        'Spring 2024 Basketball League Registration. Join our recreational basketball league for players of all skill levels.',
    },
    {
      id: 3,
      league: {
        id: 1,
        name: 'Downtown Recreational League',
      },
      season: {
        id: 3,
        name: 'Spring 2022',
      },
      price: null,
      max_registrants: null,
      openDate: '2024-03-09 04:15:13',
      closeDate: '2024-04-09 04:15:13',
      description:
        'Spring 2024 Basketball League Registration. Join our recreational basketball league for players of all skill levels.',
    },
  ],
};

export async function createRegistrationForm({
  formValues,
  slug,
  token,
}: {
  formValues: CreateRegistrationFormValues;
  slug: string;
  token: string;
}) {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      console.log('form vals', formValues);
      const result = true; //TODO: Figure out what to return
      resolve(result);
    }, 700);
  });
}

export async function updateRegistrationForm({
  formValues,
  slug,
  token,
}: {
  formValues: CreateRegistrationFormValues & { id: number };
  slug: string;
  token: string;
}) {
  console.log('updating');
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      console.log('form vals', formValues);
      const result = true; //TODO: Figure out what to return
      resolve(result);
    }, 700);
  });
}

export async function fetchRegistrantsList({
  token,
  slug,
  params,
  paginate = true,
}: {
  token: string;
  slug: string;
  params: string;
  paginate: boolean;
}) {
  const registrantsListResponseSchema = z.object({
    data: z.array(registrantItemSchema),
    meta: PaginationMetaSchema.nullable(),
  });

  type RegistrantsListResponse = z.infer<typeof registrantsListResponseSchema>;

  return new Promise<RegistrantsListResponse>((resolve) => {
    setTimeout(() => {
      const result = registrantsListResponseSchema.parse(mockRegistrantsList);
      resolve(result);
    }, 400);
  });
}

const mockRegistrantsList = {
  meta: null,
  data: [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@email.com',
      phone: '1234567890',
      photo:
        'https://as1.ftcdn.net/v2/jpg/02/99/04/20/1000_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg',
      emergencyContactName: 'Jane Smith',
      emergencyContactPhone: '9876543210',
      playerId: 1,
      payment: {
        amount: 9999, // $99.99
        tax: 800, // $8.00
        total: 10799, // $107.99
        currency: 'usd',
        status: 'succeeded' as const,
        created: '2024-03-09 04:15:13',
        receipt_url: 'https://checkout.stripe.com/c/pay/cs_test_123456789',
      },
      created_at: '2024-03-09 04:15:13',
      season: {
        id: 1,
        name: 'Spring 2024',
      },
    },
    {
      id: 2,
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.j@email.com',
      phone: '5556667777',
      photo: '',
      emergencyContactName: '',
      emergencyContactPhone: null,
      playerId: 2,
      created_at: '2024-03-10 15:30:22',
      season: {
        id: 1,
        name: 'Spring 2024',
      },
    },
    {
      id: 3,
      firstName: 'Michael',
      lastName: 'Williams',
      email: 'm.williams@email.com',
      phone: '3334445555',
      photo:
        'https://as1.ftcdn.net/v2/jpg/03/02/88/46/1000_F_302884605_actpipOdPOQHDTnFtp4zg4RtlWzhOASp.jpg',
      emergencyContactName: 'Lisa Williams',
      emergencyContactPhone: '1112223333',
      playerId: null,
      payment: {
        amount: 4999,
        tax: 400,
        total: 5399,
        currency: 'usd',
        status: 'succeeded' as const,
        created: '2024-03-10 15:30:22',
        receipt_url: 'https://checkout.stripe.com/c/pay/cs_test_987654321',
      },
      created_at: '2024-03-11 09:45:17',
      season: {
        id: 1,
        name: 'Spring 2024',
      },
    },
  ],
};

export async function linkRegistrationToPlayer({
  id,
  slug,
  token,
}: {
  id: number | null;
  slug: string;
  token: string;
}) {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      console.log('player id', id);
      const result = true; //TODO: Figure out what to return
      resolve(result);
    }, 700);
  });
}

export async function fetchRegistrationStats({
  token,
  slug,
  seasonId,
  currency,
}: {
  token: string;
  slug: string;
  seasonId: string;
  currency: CurrencyCode;
}) {
  return new Promise<ReigstrationStatsResponse>((resolve) => {
    setTimeout(() => {
      const result = registrationStatsResponseSchema.parse(
        mockRegistrationStats
      );
      resolve(result);
    }, 400);
  });
}

const mockRegistrationStats = {
  total_registrants: 58,
  total_revenue_formatted: '6,732',
  total_weekly_registrants: 12,
  total_weekly_revenue_formatted: '1,743',
};
