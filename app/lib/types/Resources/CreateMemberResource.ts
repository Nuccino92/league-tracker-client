import { z } from 'zod';
import { memberRoleSchema } from '@/app/lib/types/Models/Member';

export const AddMemberSaveValuesSchema = z.object({
  email: z.string().email(),
  role: memberRoleSchema,
});
export type AddMemberSaveValues = z.infer<typeof AddMemberSaveValuesSchema>;

export const modifyMemberSaveValuesSchema = z.object({
  member_id: z.number(),
  role: memberRoleSchema,
});
export type ModifyMemberSaveValues = z.infer<
  typeof modifyMemberSaveValuesSchema
>;
