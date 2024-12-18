'use client';

import { useState } from 'react';

import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import { Button } from '@/app/lib/components/Button';
import StyledBox from '@/app/lib/components/StyledBox';
import { useRegistrationForms } from '@/app/lib/hooks/api/control-panel/registrations';
import { IconPlus } from '@/app/lib/SVGs';
import CreateRegistrationFormModal from './CreateRegistrationFormModal';
import RegistrationForm from '@/app/lib/components/RegistrationForm';

type Props = {
  slug: string;
};

export default function RegistrationForms({ slug }: Props) {
  const { leagueData } = useLeagueControlPanel();

  const { data, status } = useRegistrationForms({
    slug,
    includeOnly: ['page', 'search', 'season'],
  });

  const [showRegistrationFormModal, setShowRegistrationFormModal] =
    useState(false);

  //TODO: exclude the seasons where they already have a registration form
  return (
    <div className='space-y-6'>
      <RegistrationForm onSubmit={async () => {}} />

      <StyledBox classes='flex items-center justify-end p-4'>
        <Button
          className='flex !h-10 items-center gap-2'
          disabled={leagueData.seasons.all_seasons.length === 0 || !data}
          onClick={() => setShowRegistrationFormModal(true)}
        >
          <IconPlus /> Create Registration Form
        </Button>
      </StyledBox>

      <StyledBox>get forms boi</StyledBox>

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
