import { z } from 'zod';
import { MemberRolesEnum, RolePermissions } from '../../enums';

const rolePermissionsValues = Object.values(RolePermissions);

export const permissionSchema = z.object({
  scope: z.array(z.number()),
});

export const memberRolesValues = Object.values(MemberRolesEnum);

export const roleSchema = z.object({
  role_name: z.enum(
    memberRolesValues as [MemberRolesEnum, ...MemberRolesEnum[]]
  ),
  permissions: z.record(
    z.enum(rolePermissionsValues as [RolePermissions, ...RolePermissions[]]),
    permissionSchema
  ),
});

export type Role = z.infer<typeof roleSchema>;
