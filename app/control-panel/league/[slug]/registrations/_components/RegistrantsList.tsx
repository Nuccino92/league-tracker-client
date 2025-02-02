'use client';

import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

import StyledBox from '@/app/lib/components/StyledBox';
import { useRegistrantsList } from '@/app/lib/hooks/api/control-panel/registrations';
import { IconEye, IconLink45deg, Spinner } from '@/app/lib/SVGs';
import { RegistrantItem } from '@/app/lib/types/Responses/control-panel.types';
import RegistrationSummaryModal from '@/app/control-panel/league/[slug]/registrations/_components/RegistrationSummaryModal';
import LinkRegistrationModal from '@/app/control-panel/league/[slug]/registrations/_components/LinkRegistrationModal';
import useDebounce from '@/app/lib/hooks/useDebounce';
import useQueryString from '@/app/lib/hooks/useQueryString';
import SearchBar from '@/app/lib/components/SearchBar';
import ListBox from '@/app/lib/components/Listbox';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import transformIntoOptions from '@/app/lib/utils/transformIntoOptions';
import RegistrantStats from '@/app/control-panel/league/[slug]/registrations/_components/RegistrantStats';

type Props = {
  slug: string;
};

export default function RegistrantsList({ slug }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { response, status } = useRegistrantsList({
    includeOnly: ['page', 'search', 'season'],
  });

  const { leagueData } = useLeagueControlPanel();
  const { seasons } = leagueData;

  const selectedSeason = searchParams.get('season')
    ? seasons.all_seasons.find(
        (season) => season.id === parseInt(searchParams.get('season') as string)
      )?.id
    : null;

  const [searchInputValue, setSearchInputValue] = useState(
    searchParams.get('search') ?? ''
  );
  const debouncedSearch = useDebounce(searchInputValue, 750);

  const { createQueryString } = useQueryString();

  useEffect(() => {
    router.push(pathname + '?' + createQueryString('search', debouncedSearch));
  }, [createQueryString, debouncedSearch, pathname, router]);

  /**
   * @todo add header to select season + search for a player
   */

  return (
    <StyledBox classes=''>
      <div className='flex items-center justify-between p-4'>
        <div className='font-bold'>Registrants</div>

        <div className='flex items-center gap-4'>
          <div className='flex items-center space-x-6'>
            <SearchBar
              inputValue={searchInputValue}
              setInputValue={setSearchInputValue}
              placeholder='Search for registrants...'
              searchIconSize={22}
              closeIconSize={20}
            />
          </div>

          <ListBox
            buttonClasses='border'
            rootClasses='w-max !text-xs'
            value={selectedSeason ? selectedSeason.toString() : null}
            onChange={(value) =>
              router.push(
                pathname + '?' + createQueryString('season', value?.toString())
              )
            }
            buttonText={
              seasons.all_seasons.find((season) => season.id === selectedSeason)
                ?.name ?? 'All seasons'
            }
            options={[
              { label: 'All seasons', value: null },
              ...transformIntoOptions(seasons.all_seasons, {
                labelKey: 'name',
                valueKey: 'id',
              }),
            ]}
          />
        </div>
      </div>

      {searchParams.get('season') && (
        <div className='mb-4 overflow-hidden'>
          <RegistrantStats />
        </div>
      )}

      {response && status === 'success' && (
        <div>
          <div className='grid grid-cols-5 gap-4 border-b p-4 text-sm font-medium'>
            <div>Name</div>
            <div>Email</div>
            <div>Season</div>
            <div>Registraion Date</div>
            <div></div>
          </div>
          <div className='divide-y'>
            {response.data.map((registrant) => (
              <Registrant
                key={registrant.id}
                registrant={registrant}
                slug={slug}
              />
            ))}
          </div>
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

function Registrant({
  registrant,
  slug,
}: { registrant: RegistrantItem } & Props) {
  //ADD SUMMARY MODAL + LINK TO PROFILE FUNCTIONALITY

  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showLink, setShowLink] = useState(false);

  return (
    <>
      <div className='grid grid-cols-5 items-center gap-4 px-4 py-2 text-sm'>
        <div>
          {registrant.firstName} {registrant.lastName}
        </div>
        <div>{registrant.email}</div>
        <div>{registrant.season.name}</div>
        <div>{format(parseISO(registrant.created_at), 'PPP')}</div>

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
          registrant={registrant}
          slug={slug}
        />
      )}
    </>
  );
}
