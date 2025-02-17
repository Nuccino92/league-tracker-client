import Image from 'next/image';

import Modal from '@/app/lib/components/Modal';
import { useFreeAgents } from '@/app/lib/hooks/api/control-panel/players';
import { ModalType } from '@/app/types';
import { IconUserAdd, IconUserDelete, Spinner } from '@/app/lib/SVGs';
import { BasePlayer } from '@/app/lib/types/Models/Player';
import getInitials from '@/app/lib/utils/getInitials';
import { useEffect, useState } from 'react';
import { Button } from '@/app/lib/components/Button';
import SearchBar from '@/app/lib/components/SearchBar';

export default function FreeAgentsModal({
  isOpen,
  close,
  slug,
  seasonId,
  teamId,
}: ModalType & { slug: string; seasonId: string; teamId: string }) {
  const { data: freeAgents, status: freeAgentsStatus } = useFreeAgents({
    slug,
    seasonId: seasonId,
    teamId: teamId,
    paginate: false,
  });

  const [mutableFreeAgents, setMutableFreeAgents] = useState<BasePlayer[]>(
    freeAgents?.data ?? []
  );
  const [selectedFreeAgents, setSelectedFreeAgents] = useState<BasePlayer[]>(
    []
  );

  const [query, setQuery] = useState('');

  const filteredFreeAgents =
    query === ''
      ? mutableFreeAgents
      : mutableFreeAgents.filter((freeAgent) =>
          freeAgent.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        );

  useEffect(() => {
    freeAgents && setMutableFreeAgents(freeAgents.data);
  }, [freeAgents]);

  function handleAddFreeAgent(selectedFreeAgent: BasePlayer) {
    setMutableFreeAgents((prev) => {
      return prev.filter((freeAgent) => freeAgent.id !== selectedFreeAgent.id);
    });

    setSelectedFreeAgents((prev) => [...prev, selectedFreeAgent]);
  }

  function handleRemoveFreeAgent(selectedFreeAgent: BasePlayer) {
    setSelectedFreeAgents((prev) => {
      return prev.filter((freeAgent) => freeAgent.id !== selectedFreeAgent.id);
    });

    setMutableFreeAgents((prev) => [...prev, selectedFreeAgent]);
  }

  async function handleSaveSelectedFreeAgents() {
    const listOfPlayerIds = selectedFreeAgents.map((freeAgent) => freeAgent.id);

    console.log('saving listOfPlayerIds', listOfPlayerIds);

    //TODO: send player id's, create mutation. likely needs season, team and player id's to add
    //await

    //todo: invalidate free agents/useplayers

    close();
  }

  return (
    <Modal panelClasses='sm:w-[640px] w-full' isOpen={isOpen} close={close}>
      <div className='space-y-6'>
        <div className='text-lg font-bold'>Add Free Agents</div>

        <SearchBar
          inputValue={query}
          setInputValue={setQuery}
          placeholder='Search free agents...'
        />

        <div className='flex gap-2'>
          <div className='swatches-picker hg h-[400px] w-1/2 overflow-auto rounded bg-slate-100 p-2'>
            {selectedFreeAgents.length === 0 && (
              <div className='flex h-full w-full items-center justify-center font-medium'>
                Select free agents to add
              </div>
            )}

            <div className='space-y-2'>
              {selectedFreeAgents.length > 0 &&
                selectedFreeAgents.map((freeAgent) => (
                  <FreeAgent
                    key={freeAgent.id}
                    freeAgent={freeAgent}
                    onAddFreeAgentClick={handleAddFreeAgent}
                    onRemoveFreeAgentClick={handleRemoveFreeAgent}
                    selected={true}
                  />
                ))}{' '}
            </div>
          </div>

          <div className='swatches-picker h-[400px] w-1/2 overflow-auto'>
            {freeAgentsStatus === 'success' && filteredFreeAgents && (
              <>
                {filteredFreeAgents?.length > 0 && (
                  <div className='space-y-2'>
                    {filteredFreeAgents.map((freeAgent) => (
                      <FreeAgent
                        key={freeAgent.id}
                        freeAgent={freeAgent}
                        onAddFreeAgentClick={handleAddFreeAgent}
                        onRemoveFreeAgentClick={handleRemoveFreeAgent}
                        selected={false}
                      />
                    ))}
                  </div>
                )}
                {filteredFreeAgents?.length === 0 && (
                  <div className='flex h-full items-center justify-center py-10'>
                    No free agents
                  </div>
                )}
              </>
            )}

            {freeAgentsStatus === 'loading' && (
              <div className='flex h-full items-center justify-center py-10'>
                <Spinner width={30} height={30} />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='mt-4 flex w-full justify-end'>
        {selectedFreeAgents.length > 0 && (
          <Button
            className='animate-wiggle'
            variant={'secondary'}
            onClick={handleSaveSelectedFreeAgents}
          >
            Add players
          </Button>
        )}
      </div>
    </Modal>
  );
}

function FreeAgent({
  freeAgent,
  onAddFreeAgentClick,
  onRemoveFreeAgentClick,
  selected,
}: {
  freeAgent: BasePlayer;
  onAddFreeAgentClick: (freeAgent: BasePlayer) => void;
  onRemoveFreeAgentClick: (freeAgent: BasePlayer) => void;
  selected: boolean;
}) {
  return (
    <div
      onClick={() => {
        if (selected) return onRemoveFreeAgentClick(freeAgent);

        onAddFreeAgentClick(freeAgent);
      }}
      className='flex cursor-pointer items-center justify-between rounded border bg-white p-1 text-sm shadow'
    >
      <div className='flex items-center gap-2'>
        <div className='flex items-center gap-2'>
          {freeAgent.avatar ? (
            <Image
              src={freeAgent.avatar}
              alt='Player avatar'
              height={35}
              width={35}
              className='h-[35px] w-[35px] rounded-md border'
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className='flex h-[35px] w-[35px] items-center justify-center rounded-md border bg-primary font-medium text-white'>
              {getInitials(freeAgent.name)}
            </div>
          )}
        </div>
        <span>{freeAgent.name}</span>{' '}
      </div>

      <button className='mr-2 hover:opacity-55'>
        {selected ? (
          <IconUserDelete height={20} width={20} className='text-red-500' />
        ) : (
          <IconUserAdd height={20} width={20} className='text-secondary' />
        )}
      </button>
    </div>
  );
}
