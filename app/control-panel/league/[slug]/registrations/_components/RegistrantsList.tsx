'use client';

import { useState } from 'react';
import { format } from 'date-fns';

import StyledBox from '@/app/lib/components/StyledBox';
import { useRegistrantsList } from '@/app/lib/hooks/api/control-panel/registrations';
import { IconEye, IconLink45deg, Spinner } from '@/app/lib/SVGs';
import { RegistrantItem } from '@/app/lib/types/Responses/control-panel.types';
import RegistrationSummaryModal from '@/app/control-panel/league/[slug]/registrations/_components/RegistrationSummaryModal';
import LinkRegistrationModal from '@/app/control-panel/league/[slug]/registrations/_components/LinkRegistrationModal';

type Props = {
  slug: string;
};

export default function RegistrantsList({ slug }: Props) {
  const { data, status } = useRegistrantsList({
    slug,
    includeOnly: ['page', 'search', 'season'],
  });

  return (
    //TODO: figure out what to put here, what buttons etc. make grid like above, Add link to player option
    <StyledBox classes=''>
      {data && status === 'success' && (
        <div>
          <div className='grid grid-cols-5 gap-4 border-b p-4 text-sm font-medium'>
            <div>Name</div>
            <div>Email</div>
            <div>Season</div>
            <div>Registraion Date</div>
            <div></div>
          </div>
          {data.map((registrant) => (
            <Registrant key={registrant.id} registrant={registrant} />
          ))}
        </div>
      )}

      {status === 'loading' && (
        <div className='flex items-center justify-center py-10'>
          {' '}
          <Spinner height={32} width={32} />
        </div>
      )}
    </StyledBox>
  );
}

function Registrant({ registrant }: { registrant: RegistrantItem }) {
  //ADD SUMMARY MODAL + LINK TO PROFILE FUNCTIONALITY

  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showLink, setShowLink] = useState(false);

  return (
    <>
      <div className='grid grid-cols-5 items-center gap-4 p-4 text-sm'>
        <div>
          {registrant.firstName} {registrant.lastName}
        </div>
        <div>{registrant.email}</div>
        <div>{'registrant.season'}</div>
        <div>{format(registrant.created_at, 'PPP')}</div>

        <div className='flex justify-end gap-2'>
          <button
            className='flex h-8 w-8 items-center justify-center rounded border shadow hover:opacity-75'
            onClick={() => setShowSummaryModal(true)}
          >
            <IconEye height={20} width={20} />
          </button>
          <button
            className='flex h-8 w-8 items-center justify-center rounded border bg-primary shadow hover:opacity-75'
            onClick={() => setShowLink(true)}
          >
            <IconLink45deg height={20} width={20} color='white' />
          </button>
          <button></button>
        </div>
      </div>{' '}
      {showSummaryModal && (
        <RegistrationSummaryModal
          isOpen={showSummaryModal}
          close={() => setShowSummaryModal(false)}
          registrant={registrant}
        />
      )}
      {showLink && (
        <LinkRegistrationModal
          isOpen={showLink}
          close={() => setShowLink(false)}
        />
      )}
    </>
  );
}
