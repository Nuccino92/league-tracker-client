import {
  Registration,
  registrationSchema,
} from '@/app/lib/types/Responses/registration';

export async function findRegistrationForm({
  token,
  id,
}: {
  token: string;
  id: number;
}) {
  return new Promise<Registration>((resolve) => {
    setTimeout(() => {
      const result = registrationSchema.parse(mockRegistrationData);
      resolve(result);
    }, 430);
  });
}

const mockRegistrationData = {
  id: 324234,
  league: {
    id: 1,
    name: 'Downtown Recreational League',
  },
  season: {
    id: 123,
    name: 'Spring 2024',
  },
  price: 99.99,
  openDate: '2024-03-09 04:15:13',
  closeDate: '2024-04-09 04:15:13',
  description:
    'Spring 2024 Basketball League Registration. Join our recreational basketball league for players of all skill levels.',
};
