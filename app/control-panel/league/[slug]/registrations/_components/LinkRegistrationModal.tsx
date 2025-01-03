import { useEffect, useState } from 'react';
import classNames from 'classnames';
import Image from 'next/image';

import Modal from '@/app/lib/components/Modal';
import { ModalType } from '@/app/types';
import { RegistrantItem } from '@/app/lib/types/Responses/control-panel.types';
import {
  usePlayer,
  usePlayers,
} from '@/app/lib/hooks/api/control-panel/players';
import { Button } from '@/app/lib/components/Button';
import {
  IconCheckmarkCircleOutline,
  IconLink45deg,
  IconPersonCircle,
  Spinner,
} from '@/app/lib/SVGs';
import FormLabel from '@/app/control-panel/_components/FormLabel';
import { useLinkRegistrantToPlayer } from '@/app/lib/hooks/api/control-panel/registrations';
import SearchBar from '@/app/lib/components/SearchBar';
import useDebounce from '@/app/lib/hooks/useDebounce';
import ControlPanelTooltip from '@/app/control-panel/_components/ControlPanelTooltip';
import { useToast } from '@/app/lib/components/_toast/use-toast';
import ProgressBar from '@/app/lib/components/ProgressBar';

type Props = {
  registrant: RegistrantItem;
  slug: string;
};

export default function LinkRegistrationModal({
  isOpen,
  close,
  panelClasses,
  registrant,
  slug,
}: Props & ModalType) {
  const { toast } = useToast();
  const TOAST_DURATION = 2900;

  const { player, isInitialLoading: initialPlayerLoading } = usePlayer({
    slug,
    enabled: registrant.playerId ? true : false,
    playerId: registrant.playerId ?? undefined,
  });

  const linkMutation = useLinkRegistrantToPlayer({ slug });

  const [playerSearchInput, setPlayerSearchInput] = useState('');

  const debouncedSearch = useDebounce(playerSearchInput, 750);

  const {
    response,
    status: searchPlayersStatus,
    isInitialLoading,
  } = usePlayers({
    slug,
    paginate: false,
    enabled: debouncedSearch !== '' ? true : false,
    givenParams:
      debouncedSearch !== '' ? `search=${debouncedSearch}` : undefined,
  });

  return (
    <Modal
      panelClasses={classNames(
        panelClasses,
        'sm:w-[640px] w-full overflow-visible w-max relative rounded-xl'
      )}
      isOpen={isOpen}
      close={close}
    >
      <div className='flex items-center gap-2'>
        <h2 className='text-lg font-semibold'>Link Registration to Player</h2>

        <ControlPanelTooltip
          content={
            <div className='max-w-[250px]'>
              Linking is used to automatically sync a chosen players information
              with the registration form. Doing so will update the players
              information, as well as associate the email information for future
              automatic linking of repeat registrants.
            </div>
          }
          classes='text-white font-medium bg-primary !py-3 text-sm'
        />
      </div>

      <div className='mt-6 space-y-4'>
        <div
          className={classNames(
            isInitialLoading
              ? 'border-[rgb(229, 231, 235)] bg-gray-50'
              : player
                ? 'border-green-400 bg-green-400/10'
                : 'border-red-500 bg-red-500/20',
            'h-[100px] rounded-lg border  p-4'
          )}
        >
          {/* Current Link Status */}
          {!initialPlayerLoading && (
            <>
              {player ? (
                <div className='flex items-center justify-between'>
                  <div>
                    <div className='mb-1 flex items-center gap-2 text-sm text-gray-500'>
                      <span>Currently Linked To</span>{' '}
                      <span>
                        <IconLink45deg
                          color='rgb(74 222 128)'
                          height={18}
                          width={18}
                        />
                      </span>
                    </div>

                    <div className='flex items-center gap-2'>
                      {player.avatar ? (
                        <div className='relative h-10 w-10 rounded border'>
                          <Image
                            src={player.avatar}
                            alt={`${player.avatar} logo`}
                            fill
                            style={{
                              objectFit: 'contain',
                              position: 'absolute',
                            }}
                            sizes='(max-width: 50px) 100vw'
                          />
                        </div>
                      ) : (
                        <div className='flex h-10 w-10 items-center justify-center rounded-md border bg-gray-500 font-medium text-white'>
                          <IconPersonCircle
                            height={25}
                            width={25}
                            color='rgb(209 213 219)'
                          />
                        </div>
                      )}
                      <div>
                        <div className='font-medium'>{player.name}</div>
                        <div className='text-sm text-gray-500'>
                          {player.email}
                        </div>{' '}
                      </div>
                    </div>
                  </div>

                  <Button
                    className='bg-white'
                    variant={'outline'}
                    onClick={async () => {
                      await linkMutation.mutateAsync({ id: null });

                      toast({
                        duration: TOAST_DURATION + 130,
                        title: 'Unlink Successful',
                        className:
                          'data-[state=open]:animate-slide-in-right data-[state=closed]:animate-fade-out data-[swipe=end]:animate-none',
                        action: (
                          <>
                            <IconCheckmarkCircleOutline
                              height={32}
                              width={32}
                              color='rgb(74 222 128)'
                            />

                            <div className='absolute bottom-0 left-[-15px] h-1 w-full overflow-hidden bg-gray-200'>
                              <ProgressBar duration={TOAST_DURATION} />
                            </div>
                          </>
                        ),
                      });
                    }}
                  >
                    UnLink
                  </Button>
                </div>
              ) : (
                <div>
                  <div className='mb-1 flex items-center gap-2 text-sm text-gray-500'>
                    <span>Currently Linked To</span>{' '}
                    <span>
                      <IconLink45deg
                        color='rgb(239 68 68)'
                        height={18}
                        width={18}
                      />
                    </span>
                  </div>
                  <div className='font-medium'>Not Linked</div>
                </div>
              )}
            </>
          )}

          {initialPlayerLoading && (
            <div className='flex h-full w-full items-center justify-center'>
              <Spinner height={22} width={22} />
            </div>
          )}
        </div>

        {/* Search */}
        <div className='flex items-center justify-between space-y-2'>
          <FormLabel
            label='Find a player to link'
            htmlFor='playerSearchInput'
          />
          <SearchBar
            inputValue={playerSearchInput}
            setInputValue={setPlayerSearchInput}
            placeholder='Search for a player...'
          />
        </div>

        {/* Player List */}
        <div className='swatches-picker h-[330px] space-y-2 overflow-y-auto rounded-lg border bg-gray-50 p-4'>
          {response &&
            searchPlayersStatus === 'success' &&
            response.data.map((searchPlayer) => (
              <div
                key={searchPlayer.id}
                className='flex items-center justify-between rounded border bg-white p-3'
              >
                <div>
                  <div className='font-medium'>{searchPlayer.name}</div>
                  <div className='text-sm text-gray-500'>
                    {searchPlayer.email}
                  </div>
                </div>
                <Button
                  onClick={async () => {
                    await linkMutation.mutateAsync({ id: searchPlayer.id });

                    toast({
                      duration: TOAST_DURATION + 130,
                      title: 'Link Successful',
                      className:
                        'data-[state=open]:animate-slide-in-right data-[state=closed]:animate-fade-out data-[swipe=end]:animate-none',
                      action: (
                        <>
                          <IconCheckmarkCircleOutline
                            height={32}
                            width={32}
                            color='rgb(74 222 128)'
                          />

                          <div className='absolute bottom-0 left-[-15px] h-1 w-full overflow-hidden bg-gray-200'>
                            <ProgressBar duration={TOAST_DURATION} />
                          </div>
                        </>
                      ),
                    });
                  }}
                  variant={
                    searchPlayer.id === player?.id ? 'outline' : 'default'
                  }
                >
                  {searchPlayer.id === player?.id
                    ? 'Currently Linked'
                    : 'Link Player'}
                </Button>
              </div>
            ))}

          {debouncedSearch === '' && (
            <div className='flex h-full w-full items-center justify-center py-4 text-sm text-gray-500'>
              Search for a player to link to
            </div>
          )}

          {isInitialLoading && (
            <div className='flex h-full w-full items-center justify-center py-4'>
              <Spinner height={30} width={30} />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
