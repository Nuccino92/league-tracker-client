import { z } from 'zod';
import { MemberRolesEnum } from '@/app/lib/enums';

export const permissionSchema = z.object({
  scope: z.array(z.number()),
});

export const memberRolesValues = Object.values(MemberRolesEnum);

export const roleSchema = z.object({
  role_name: z.enum(
    memberRolesValues as [MemberRolesEnum, ...MemberRolesEnum[]]
  ),
});

export type Role = z.infer<typeof roleSchema>;
