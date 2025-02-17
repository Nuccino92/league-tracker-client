import { z } from 'zod';
import { MemberRolesEnum } from '@/app/lib/enums/index';

export const memberStatusSchema = z.enum([
  'accepted',
  'declined',
  'pending',
  'suspended',
]);
export type MemberStatus = z.infer<typeof memberStatusSchema>;

export const memberRoleSchema = z.nativeEnum(MemberRolesEnum);

export type MemberRole = z.infer<typeof memberRoleSchema>;

export const memberSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  name: z.string(),
  avatar: z.string().nullable(),
  email: z.string(),
  role: memberRoleSchema,
  status: memberStatusSchema,
});

export type Member = z.infer<typeof memberSchema>;
