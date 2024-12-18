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

const mockRegistrationFormList = [{}];

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
