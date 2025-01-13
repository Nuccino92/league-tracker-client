import { z } from 'zod';

const leagueSchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  logo: z.string().nullable(),
});

export type FollowedLeague = z.infer<typeof leagueSchema>;

export const followedLeaguesResponseSchema = z.object({
  joined_leagues: z.array(
    leagueSchema.extend({
      role: z.enum(['owner', 'super-admin', 'admin', 'member', 'player']), // todo: make/get enum
    })
  ),
  bookmarked_leagues: z.array(leagueSchema),
});

export type FollowedLeagueResponse = z.infer<
  typeof followedLeaguesResponseSchema
>;

export const leaguesForBookmarkResponseSchema = z.array(leagueSchema);

export type LeaguesForBookmarkResponse = z.infer<
  typeof leaguesForBookmarkResponseSchema
>;
