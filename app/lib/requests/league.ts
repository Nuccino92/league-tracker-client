import ROUTES from '../globals/routes';
import { League } from '../types/Models/League';
import { LeagueInformationResource } from '../types/Resources/CreateLeagueResource';
import { SubscriptionInformationSchema } from '../types/Resources/SubscriptionResource';

export async function findLeagueRequest({
  token,
  slug,
}: {
  token: string;
  slug: string;
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_KEEPR_API_URL}${ROUTES.LEAGUE}/${slug}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw Error('Failed to retrieve league');
}

export async function createLeagueRequest({
  token,
  formData,
  subscription,
}: {
  token: string;
  formData: LeagueInformationResource;
  subscription?: SubscriptionInformationSchema;
}) {
  const formDataFormatted = {
    ...formData,
    primary_color: formData.primary_color,
    secondary_color: formData.secondary_color,
  };

  let subscriptionFormatted;
  if (subscription) {
    subscriptionFormatted = {
      ...subscription,
      payment_method_id: subscription.payment_method_id,
    };
  }

  const requestBody = {
    form_data: formDataFormatted,
    // Only include subscription if it's present
    ...(subscriptionFormatted && { subscription: subscriptionFormatted }),
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_KEEPR_API_URL}${ROUTES.LEAGUE}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) throw Error('failed to created league');

  const { league } = (await response.json()) as any;

  return league as League;
}

export async function updateLeagueInformation({
  token,
  slug,
  leagueData,
}: {
  token: string;
  slug: string;
  leagueData: LeagueInformationResource;
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_KEEPR_API_URL}${ROUTES.LEAGUE}/${slug}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leagueData),
    }
  );

  if (!response.ok) throw Error('Failed to update league');

  const { league } = (await response.json()) as any;

  return league as League;
}
// endregion
