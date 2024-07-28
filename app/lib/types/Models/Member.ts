import { z } from 'zod';
import { MemberRolesEnum } from '../../enums';

export const memberRoleSchema = z.nativeEnum(MemberRolesEnum);

export type MemberRole = z.infer<typeof memberRoleSchema>;

export const memberSchema = z.object({
  id: z.number(),
  name: z.string(),
  role: memberRoleSchema,
});

export type Member = z.infer<typeof memberSchema>;
