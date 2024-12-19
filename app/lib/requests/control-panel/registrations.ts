import { z } from 'zod';
import {
  RegistrationItem,
  registrationItemSchema,
  RegistrantItem,
  registrantItemSchema,
  CreateRegistrationFormValues,
} from '@/app/lib/types/Responses/control-panel.types';

export async function fetchRegistrationForms({
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
  return new Promise<RegistrationItem[]>((resolve) => {
    setTimeout(() => {
      const result = z
        .array(registrationItemSchema)
        .parse(mockRegistrationFormList);
      resolve(result);
    }, 400);
  });
}

const mockRegistrationFormList = [
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
    price: 99.99,
    openDate: '2024-03-09 04:15:13',
    closeDate: '2024-04-09 04:15:13',
    description:
      'Spring 2024 Basketball League Registration. Join our recreational basketball league for players of all skill levels.',
  },
];

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
  return new Promise<RegistrantItem[]>((resolve) => {
    setTimeout(() => {
      const result = z.array(registrantItemSchema).parse(mockRegistrantsList);
      resolve(result);
    }, 400);
  });
}

const mockRegistrantsList = [{}];
