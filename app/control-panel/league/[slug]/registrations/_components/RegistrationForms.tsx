'use client';

import { useState } from 'react';

import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import { Button } from '@/app/lib/components/Button';
import StyledBox from '@/app/lib/components/StyledBox';
import { useRegistrationForms } from '@/app/lib/hooks/api/control-panel/registrations';
import { IconPlus, Spinner } from '@/app/lib/SVGs';
import CreateRegistrationFormModal from '@/app/control-panel/league/[slug]/registrations/_components/CreateRegistrationFormModal';
import RegistrationFormsList from '@/app/control-panel/league/[slug]/registrations/_components/RegistrationFormsList';

type Props = {
  slug: string;
};

export default function RegistrationForms({ slug }: Props) {
  const { leagueData } = useLeagueControlPanel();

  const { response, status } = useRegistrationForms({
    slug,
  });

  const [showRegistrationFormModal, setShowRegistrationFormModal] =
    useState(false);

  //TODO: exclude the seasons where they already have a registration form
  return (
    <div className='space-y-6'>
      <StyledBox classes='flex items-center justify-end p-4'>
        {/* TODO: disable if the season isn't on a paid subscription */}
        <Button
          className='flex !h-10 items-center gap-2'
          disabled={leagueData.seasons.all_seasons.length === 0 || !response}
          onClick={() => setShowRegistrationFormModal(true)}
        >
          <IconPlus /> Create Registration Form
        </Button>
      </StyledBox>

      {response && status === 'success' && (
        <RegistrationFormsList slug={slug} forms={response.data} />
      )}

      {status === 'loading' && (
        <StyledBox classes='flex items-center justify-center py-10'>
          <Spinner height={32} width={32} />
        </StyledBox>
      )}

      {/* TODO: disable if the season isn't on a paid subscription */}
      {showRegistrationFormModal && (
        <CreateRegistrationFormModal
          isOpen={showRegistrationFormModal}
          close={() => setShowRegistrationFormModal(false)}
          slug={slug}
        />
      )}
    </div>
  );
}
