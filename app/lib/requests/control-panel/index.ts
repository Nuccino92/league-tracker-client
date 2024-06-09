import ROUTES from '@/app/lib/globals/routes';
import {
  ControlPanelInformation,
  ControlPanelListTeam,
  ErrorType,
} from '@/app/lib/types/Responses/control-panel.types';

export async function leagueControlPanelInformationRequest({
  token,
  slug,
}: {
  token: string;
  slug: string;
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_KEEPR_API_URL}${ROUTES.CONTROL_PANEL}${ROUTES.LEAGUE}/${slug}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok)
    throw {
      message: data.error as ErrorType,
      statusCode: response.status,
      owner_id: data.owner_id,
    } as NotOk & { owner_id: string | undefined };

  return data.data as ControlPanelInformation;
}
