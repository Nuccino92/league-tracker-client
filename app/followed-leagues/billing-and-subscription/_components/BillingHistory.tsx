'use client';

import { useState } from 'react';
import { format, parseISO } from 'date-fns';

import SearchBar from '@/app/lib/components/SearchBar';
import StyledBox from '@/app/lib/components/StyledBox';
import { useLeagueBillingHistory } from '@/app/lib/hooks/api/followed-leagues';
import { Button } from '@/app/lib/components/Button';
import { IconDownload, IconEye, Spinner } from '@/app/lib/SVGs';
import { BillingStatus } from '@/app/lib/types/followed-leagues.types';
import formatCurrency from '@/app/lib/utils/formatCurrency';
import Pagination from '@/app/lib/components/Pagination';
import useDebounce from '@/app/lib/hooks/useDebounce';

type Props = {
  leagueID: string;
};

export default function BillingHistory({ leagueID }: Props) {
  // const [showFiltersModal, setShowFiltersModal] = useState(false);

  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(query, 350);

  const { response, status } = useLeagueBillingHistory(leagueID, {
    query: debouncedSearch,
    page,
  });

  return (
    <StyledBox classes='p-6'>
      <div className='mb-6 flex items-center justify-between'>
        <div className='text-lg font-bold'>Billing History</div>

        <div className='flex items-center gap-2.5 text-sm'>
          <SearchBar
            inputValue={query}
            setInputValue={setQuery}
            placeholder='Search...'
          />

          {/* <Button
            variant={'outline'}
            onClick={() => setShowFiltersModal(true)}
            className='flex items-center justify-center gap-2'
          >
            <span>{filtersIcon}</span> <span>Filters</span>
          </Button> */}
          <Button
            variant={'outline'}
            onClick={() => {
              //export the LIIIIIST
            }}
            className='flex items-center justify-center gap-2'
          >
            <span>{exportIcon}</span> <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className='swatches-picker w-full overflow-x-auto'>
        <div className='min-w-[800px] rounded-lg border'>
          {/* Table Header */}
          <div className='grid grid-cols-6 gap-4 border-b bg-gray-50 p-4 text-sm text-gray-500'>
            <Button variant={'ghost'} className='h-max w-max !p-0'>
              Plan Name
            </Button>
            <Button variant={'ghost'} className='h-max w-max !p-0'>
              Amounts{' '}
            </Button>
            <Button variant={'ghost'} className='h-max w-max !p-0'>
              Purchase Date{' '}
            </Button>
            <Button variant={'ghost'} className='h-max w-max !p-0'>
              End Date{' '}
            </Button>
            <Button variant={'ghost'} className='h-max w-max !p-0'>
              Status{' '}
            </Button>
            <Button variant={'ghost'} className='h-max w-max !p-0'>
              Action{' '}
            </Button>
          </div>

          {/* Table Body */}
          {status === 'success' && response && (
            <div className='divide-y text-sm'>
              {response.data.map((item) => (
                <div
                  key={item.id}
                  className='grid grid-cols-6 items-center gap-4 p-4'
                >
                  <div className='font-medium'>{item.product_name}</div>
                  <div className='text-gray-900'>
                    {formatCurrency(item.amount, item.currency)}
                  </div>
                  <div>
                    {format(parseISO(item.purchase_date), 'yyyy-MM-dd')}
                  </div>
                  <div>{format(parseISO(item.end_date), 'yyyy-MM-dd')}</div>
                  <div>
                    <StatusBadge status={item.status} />
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button variant='outline' size='icon'>
                      <IconDownload height={19} width={19} />
                    </Button>
                    <Button variant='outline' size='icon'>
                      <IconEye height={19} width={19} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {status === 'loading' && (
            <div className='flex items-center justify-center py-[150px]'>
              <Spinner height={28} width={28} />
            </div>
          )}
        </div>
      </div>

      {status === 'success' && response && (
        <div className='mt-4 flex items-center justify-end'>
          <Pagination
            currentPage={response.meta.current_page}
            totalPages={response.meta.total}
            onPageChange={(type, page) => {
              setPage(page);
            }}
          />{' '}
        </div>
      )}
    </StyledBox>
  );
}

// function FiltersModal() {
//   return <div>modal</div>;
// }

// const filtersIcon = (
//   <svg
//     xmlns='http://www.w3.org/2000/svg'
//     fill='none'
//     viewBox='0 0 24 24'
//     strokeWidth={1.5}
//     stroke='currentColor'
//     className='size-4'
//   >
//     <path
//       strokeLinecap='round'
//       strokeLinejoin='round'
//       d='M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z'
//     />
//   </svg>
// );

const exportIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    className='size-4'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5'
    />
  </svg>
);

const StatusBadge = ({ status }: { status: BillingStatus }) => {
  const statusConfig: Record<BillingStatus, { color: string; label: string }> =
    {
      succeeded: { color: 'text-green-700 bg-green-50', label: 'Success' },
      pending: { color: 'text-blue-700 bg-blue-50', label: 'Pending' },
      processing: { color: 'text-amber-700 bg-amber-50', label: 'Processing' },
      failed: { color: 'text-red-700 bg-red-50', label: 'Failed' },
      refunded: { color: 'text-purple-700 bg-purple-50', label: 'Refunded' },
      cancelled: { color: 'text-gray-700 bg-gray-50', label: 'Cancelled' },
    };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm ${statusConfig[status].color}`}
    >
      <span className='h-1.5 w-1.5 rounded-full bg-current' />
      {statusConfig[status].label}
    </span>
  );
};
