import { z } from 'zod';

export const PaginationLinkSchema = z.object({
  active: z.boolean(),
  label: z.string(),
  url: z.string().nullable(),
});

export const PaginationMetaSchema = z.object({
  current_page: z.number().int().min(0),
  last_page: z.number().int().min(0),
  to: z.number().int().nullable(),
  from: z.number().int().nullable(),
  path: z.string(),
  per_page: z.number().int().min(0),
  total: z.number().int().min(0),
  links: z.array(PaginationLinkSchema),
});

export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;
