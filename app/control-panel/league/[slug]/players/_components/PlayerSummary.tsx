import Image from 'next/image';

import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import Modal from '@/app/lib/components/Modal';
import { usePlayer } from '@/app/lib/hooks/api/control-panel/players';
import {
  IconEmailOutline,
  IconPersonCircle,
  IconPhoneOutline,
  Spinner,
} from '@/app/lib/SVGs';
import { ModalType } from '@/app/types';

export default function PlayerSummary({
  isOpen,
  close,
  playerId,
}: ModalType & { playerId?: number }) {
  const { leagueData, slug } = useLeagueControlPanel();
  const { player, status } = usePlayer({
    slug: slug,
    playerId: playerId,
  });

  return (
    <Modal panelClasses='sm:w-[640px] w-full' isOpen={isOpen} close={close}>
      <div>
        {status === 'success' && player && (
          <div className='space-y-6'>
            <div className='flex items-center gap-4 pb-4'>
              {player.avatar ? (
                <div className='relative h-[75px] w-[75px] rounded border'>
                  <Image
                    src={player.avatar}
                    alt={`${player.avatar} logo`}
                    fill
                    style={{ objectFit: 'contain', position: 'absolute' }}
                    sizes='(max-width: 50px) 100vw'
                  />
                </div>
              ) : (
                <div className='flex h-[75px] w-[75px] items-center justify-center rounded-md border bg-gray-500 font-medium text-white'>
                  <IconPersonCircle
                    height={45}
                    width={45}
                    color='rgb(209 213 219)'
                  />
                </div>
              )}

              <div className='text-xl font-medium'>{player.name}</div>
            </div>
            <div>
              <h3 className='mb-3 text-lg font-semibold'>
                Contact Information
              </h3>
              <div className='space-y-3'>
                {player.email && (
                  <div className='flex items-center gap-2 text-gray-600'>
                    <IconEmailOutline height={20} width={20} />
                    <span>{player.email}</span>
                  </div>
                )}
                {player.phoneNumber && (
                  <div className='flex items-center gap-2 text-gray-600'>
                    <IconPhoneOutline height={20} width={20} />
                    <span>{player.phoneNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {(player.emergencyContactName || player.emergencyContactPhone) && (
              <>
                <div>
                  <h3 className='mb-3 flex items-center gap-2 text-lg font-semibold'>
                    Emergency Contact
                  </h3>
                  <div className='space-y-3'>
                    {player.emergencyContactName && (
                      <div className='flex items-center gap-3 text-gray-600'>
                        <IconPersonCircle
                          height={20}
                          width={20}
                          color='rgb(209 213 219)'
                        />
                        <span>{player.emergencyContactName}</span>
                      </div>
                    )}
                    {player.emergencyContactPhone && (
                      <div className='flex items-center gap-3 text-gray-600'>
                        <IconPhoneOutline height={20} width={20} />
                        <span>{player.emergencyContactPhone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {status === 'success' && !player && (
          <div className='flex h-64 flex-col items-center justify-center text-gray-500'>
            <p>Player not found</p>
          </div>
        )}

        {status === 'loading' && (
          <div className='flex h-64 items-center justify-center'>
            <Spinner height={33} width={33} />
          </div>
        )}
      </div>
    </Modal>
  );
}
