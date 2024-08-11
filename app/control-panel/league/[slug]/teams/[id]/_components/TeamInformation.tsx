'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import TeamForm from '@/app/control-panel/league/[slug]/teams/_components/TeamForm';
import PageHeader from '@/app/control-panel/_components/PageHeader';
import { Button } from '@/app/lib/components/Button';
import NotFound from '@/app/lib/components/NotFound';
import { useTeam } from '@/app/lib/hooks/api/control-panel/teams';
import { EditIcon, Spinner } from '@/app/lib/SVGs';
import StyledBox from '@/app/lib/components/StyledBox';

export default function TeamInformation({
  slug,
  id,
}: {
  slug: string;
  id: string;
}) {
  const router = useRouter();
  const { team, status } = useTeam({
    slug: slug,
    teamId: parseInt(id),
  });

  const [showTeamEditModal, setShowTeamEditModal] = useState(false);

  return (
    <StyledBox classes='p-8'>
      {status === 'success' && team ? (
        <>
          <div className='space-y-6'>
            <div className='flex items-center justify-between space-x-6'>
              <h2 className='text-2xl font-bold'>{team.name}</h2>

              <Button
                className='space-x-2'
                onClick={() => setShowTeamEditModal(true)}
              >
                <EditIcon height={17} width={17} /> <span>Edit</span>
              </Button>
            </div>

            <div className='flex space-x-4'>
              <div className='relative h-[200px] min-w-[200px]'>
                {team.logo ? (
                  <Image
                    src={team.logo}
                    alt={team.name + ' Logo'}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className='h-full w-full'>wow</div>
                )}
              </div>

              <p className='my-2 font-medium text-zinc-900'>
                {team.description ?? 'No description provided'}
              </p>
            </div>
          </div>

          {showTeamEditModal ? (
            <TeamForm
              isOpen={showTeamEditModal}
              close={() => setShowTeamEditModal(false)}
              teamId={team.id as number}
            />
          ) : null}
        </>
      ) : null}

      {status === 'loading' ? <Spinner /> : null}

      {status === 'error' ? (
        <NotFound>
          {' '}
          <div className='text-2xl font-bold'>
            We cannot find what you are looking for
          </div>
          <div className='mt-6 flex items-center justify-center space-x-5 font-medium text-white'>
            <Link
              className='flex h-10 items-center justify-center rounded bg-secondary px-4'
              href={'/'}
            >
              Home
            </Link>
            <button
              className='h-10 rounded bg-primary px-4'
              onClick={() => router.back()}
              type='button'
            >
              Back
            </button>
          </div>
        </NotFound>
      ) : null}
    </StyledBox>
  );
}
