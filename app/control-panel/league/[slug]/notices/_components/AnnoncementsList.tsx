'use client';

import { useEffect, useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import classNames from 'classnames';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import StyledBox from '@/app/lib/components/StyledBox';
import {
  useNoticeDetails,
  useNoticeList,
  useRetryNotices,
} from '@/app/lib/hooks/api/control-panel/notices';
import { Spinner } from '@/app/lib/SVGs';
import { NoticeItem } from '@/app/lib/types/Responses/control-panel.types';
import { Button } from '@/app/lib/components/Button';
import SearchBar from '@/app/lib/components/SearchBar';
import useDebounce from '@/app/lib/hooks/useDebounce';
import useQueryString from '@/app/lib/hooks/useQueryString';
import { useLeagueControlPanel } from '@/app/control-panel/_components/LeagueControlPanelProvider';
import ListBox from '@/app/lib/components/Listbox';
import transformIntoOptions from '@/app/lib/utils/transformIntoOptions';
import { ModalType } from '@/app/types';
import Modal from '@/app/lib/components/Modal';
import Pagination from '@/app/lib/components/Pagination';

export default function AnnouncementsList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { response, status } = useNoticeList({});

  const { leagueData } = useLeagueControlPanel();
  const { seasons } = leagueData;

  const selectedSeason = searchParams.get('season')
    ? seasons.all_seasons.find(
        (season) => season.id === parseInt(searchParams.get('season') as string)
      )?.id
    : null;

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const { createQueryString } = useQueryString();

  useEffect(() => {
    router.push(pathname + '?' + createQueryString('search', debouncedQuery));
  }, [createQueryString, debouncedQuery, pathname, router]);

  return (
    <StyledBox>
      {' '}
      <div className='flex items-center justify-between gap-4 p-6 pb-2'>
        <div className='text-lg font-bold'>Your Notices</div>
        <div className='flex items-center gap-4'>
          <SearchBar
            inputValue={query}
            setInputValue={setQuery}
            placeholder='Search for a notice...'
          />

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
                ?.name ?? 'All Seasons'
            }
            options={[
              { label: 'All Seasons', value: null },
              ...transformIntoOptions(seasons.all_seasons, {
                labelKey: 'name',
                valueKey: 'id',
              }),
            ]}
          />
        </div>
      </div>
      {status === 'success' && response && (
        <div className='space-y-2 p-4'>
          {response.data.length > 0 &&
            response.data.map((notice) => (
              <AnnouncementsListItem notice={notice} key={notice.id} />
            ))}

          {response.data.length === 0 && (
            <div className='py-12 text-center italic text-gray-500'>
              No notices found
            </div>
          )}

          <div className='!mt-4'>
            <Pagination
              currentPage={response.meta.current_page}
              totalPages={response.meta.last_page}
              onPageChange={(type, page) => {
                if (type === 'next') {
                  router.push(
                    pathname +
                      '?' +
                      createQueryString('page', (page + 1).toString())
                  );
                } else if (type === 'prev') {
                  router.push(
                    pathname +
                      '?' +
                      createQueryString('page', (page - 1).toString())
                  );
                } else if (page) {
                  router.push(
                    pathname + '?' + createQueryString('page', page.toString())
                  );
                }
              }}
            />
          </div>
        </div>
      )}
      {status === 'loading' && (
        <div className='flex items-center justify-center py-[150px]'>
          <Spinner height={22} width={22} />
        </div>
      )}
    </StyledBox>
  );
}

function AnnouncementsListItem({ notice }: { notice: NoticeItem }) {
  const [showDeliveryDetails, setShowDeliveryDetails] = useState(false);

  const isWebsite = notice.delivery_type.includes('website');
  const hasDirectMessage =
    notice.delivery_type.includes('email') ||
    notice.delivery_type.includes('sms');

  const retryNoticeMutation = useRetryNotices();

  return (
    <div className='space-y-4 rounded-lg border p-4 pb-0'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <div className='space-y-1'>
          <h3 className='font-medium'>{notice.title}</h3>
          <div className='text-sm text-gray-500'>
            {format(parseISO(notice.created_at), 'MMM d, yyyy')}
          </div>{' '}
          {notice.season && (
            <div className='text-sm font-medium text-gray-500'>
              {notice.season.name}
            </div>
          )}
        </div>

        {/* Delivery Type Badges */}
        <div className='flex gap-2'>
          {notice.delivery_type.map((type) => (
            <span
              key={type}
              className={classNames(
                'rounded-full px-2 py-1 text-xs font-medium',
                type === 'email' && 'bg-blue-100 text-blue-700',
                type === 'sms' && 'bg-green-100 text-green-700',
                type === 'website' && 'bg-purple-100 text-purple-700'
              )}
            >
              {type === 'email' && 'Email'}
              {type === 'sms' && 'SMS'}
              {type === 'website' && 'Website'}
            </span>
          ))}
        </div>
      </div>
      {/* Message Content */}
      <div className='text-gray-600'>{notice.message}</div>
      {/* Website Specific Info */}
      {isWebsite && notice.start_date && notice.end_date && (
        <div className='flex h-12 items-center gap-4 border-t text-sm text-gray-500'>
          <div>
            <span className='font-medium'>Starts:</span>{' '}
            {format(new Date(notice.start_date), 'MMM d, yyyy')}
          </div>
          <div>
            <span className='font-medium'>Ends:</span>{' '}
            {format(new Date(notice.end_date), 'MMM d, yyyy')}
          </div>
        </div>
      )}
      {/* Quick Stats for Direct Messages */}
      {hasDirectMessage && (
        <div className='flex h-12 items-center justify-between gap-4 border-t text-sm text-gray-500'>
          <div className='flex items-center gap-4'>
            <div>
              <span className='font-medium'>Recipients:</span>{' '}
              {notice.delivery_stats?.recipients}
            </div>
            <div>
              <span className='font-medium'>Delivered:</span>{' '}
              {notice.delivery_stats &&
                `${Math.round((notice.delivery_stats.delivered / notice.delivery_stats.recipients) * 100)}%`}
            </div>

            {/* Only show retry button if there are failed deliveries */}
            {notice.delivery_stats &&
              notice.delivery_stats.delivered <
                notice.delivery_stats.recipients && (
                <Button
                  disabled={retryNoticeMutation.isLoading}
                  variant='outline'
                  size='sm'
                  className='hover:border-primary hover:bg-primary hover:text-white'
                  onClick={async () => {
                    await retryNoticeMutation.mutateAsync(notice.id);
                  }}
                >
                  Retry Failed Messages
                  <span className='ml-1 text-xs'>
                    (
                    {notice.delivery_stats.recipients -
                      notice.delivery_stats.delivered}
                    )
                  </span>
                </Button>
              )}
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setShowDeliveryDetails(true)}
          >
            View Details
          </Button>
        </div>
      )}

      {showDeliveryDetails && (
        <DeliveryDetailsModal
          isOpen={showDeliveryDetails}
          close={() => {
            setShowDeliveryDetails(false);
          }}
          panelClasses='max-w-[1200px] whitespace-nowrap swatches-picker'
          notice={notice}
        />
      )}
    </div>
  );
}

type SortableField =
  | 'name'
  | 'email'
  | 'phone'
  | 'email_status'
  | 'email_delivered_at'
  | 'sms_status'
  | 'sms_delivered_at';

function DeliveryDetailsModal({
  isOpen,
  close,
  panelClasses,
  notice,
}: ModalType & { notice: NoticeItem }) {
  const { leagueData } = useLeagueControlPanel();
  const { seasons } = leagueData;

  const [sortField, setSortField] = useState<SortableField | undefined>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');

  const debouncedQuery = useDebounce(query, 300);

  const { response, status } = useNoticeDetails({
    noticeId: notice.id,
    page,
    query: debouncedQuery,
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  const sortedData = useMemo(() => {
    if (!response?.data.delivery_details || !sortField)
      return response?.data.delivery_details;

    return [...response?.data.delivery_details].sort((a, b) => {
      // Handle date fields
      if (sortField.endsWith('_delivered_at')) {
        const aDate = a[sortField]
          ? new Date(a[sortField] as string).getTime()
          : 0;
        const bDate = b[sortField]
          ? new Date(b[sortField] as string).getTime()
          : 0;
        return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
      }

      // Handle other fields
      const aValue = (a[sortField] ?? '') as string;
      const bValue = (b[sortField] ?? '') as string;

      const comparison = aValue.localeCompare(bValue);
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [response?.data.delivery_details, sortField, sortDirection]);

  const showEmailColumn = notice.delivery_type.includes('email');
  const showSMSColumn = notice.delivery_type.includes('sms');

  const handleSort = (field: SortableField) => {
    if (sortField === field && sortDirection === 'desc') {
      // If same field and already descending, remove sort
      setSortField(undefined);
      setSortDirection('asc'); // Reset to default
    } else if (sortField === field) {
      // If same field but ascending, switch to descending
      setSortDirection('desc');
    } else {
      // New field, set as default ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <Modal panelClasses={panelClasses} isOpen={isOpen} close={close}>
      <h2 className='text-lg font-medium'>Delivery Details</h2>

      <div className='mb-2 mt-4 flex items-center justify-start gap-4 border-b pb-4'>
        <SearchBar
          inputValue={query}
          setInputValue={setQuery}
          placeholder='Search for recipient'
        />
      </div>
      {status === 'success' && response && (
        <div className='space-y-4'>
          <div className='max-h-96 overflow-y-auto'>
            <table className='w-full'>
              <thead>
                <tr className='text-sm text-gray-500'>
                  <th className='p-2 text-left'>
                    <button
                      onClick={() => handleSort('name')}
                      className='flex items-center gap-1'
                    >
                      Recipient
                      {sortField === 'name' &&
                        (sortDirection === 'asc' ? '↑' : '↓')}
                    </button>
                  </th>
                  {showEmailColumn && (
                    <>
                      <th className='p-2 text-left'>
                        <button
                          onClick={() => handleSort('email')}
                          className='flex items-center gap-1'
                        >
                          Email
                          {sortField === 'email' &&
                            (sortDirection === 'asc' ? '↑' : '↓')}
                        </button>
                      </th>
                      <th className='p-2 text-left'>
                        <button
                          onClick={() => handleSort('email_status')}
                          className='flex items-center gap-1'
                        >
                          Email Status
                          {sortField === 'email_status' &&
                            (sortDirection === 'asc' ? '↑' : '↓')}
                        </button>
                      </th>
                      <th className='p-2 text-left'>
                        <button
                          onClick={() => handleSort('email_delivered_at')}
                          className='flex items-center gap-1'
                        >
                          Email Delivered At
                          {sortField === 'email_delivered_at' &&
                            (sortDirection === 'asc' ? '↑' : '↓')}
                        </button>
                      </th>
                    </>
                  )}
                  {showSMSColumn && (
                    <>
                      <th className='p-2 text-left'>
                        <button
                          onClick={() => handleSort('phone')}
                          className='flex items-center gap-1'
                        >
                          Phone
                          {sortField === 'phone' &&
                            (sortDirection === 'asc' ? '↑' : '↓')}
                        </button>
                      </th>
                      <th className='p-2 text-left'>
                        <button
                          onClick={() => handleSort('sms_status')}
                          className='flex items-center gap-1'
                        >
                          SMS Status
                          {sortField === 'sms_status' &&
                            (sortDirection === 'asc' ? '↑' : '↓')}
                        </button>
                      </th>
                      <th className='p-2 text-left'>
                        <button
                          onClick={() => handleSort('sms_delivered_at')}
                          className='flex items-center gap-1'
                        >
                          SMS Delivered At
                          {sortField === 'sms_delivered_at' &&
                            (sortDirection === 'asc' ? '↑' : '↓')}
                        </button>
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className='divide-y'>
                {sortedData?.map((detail) => (
                  <tr key={detail.recipient_id} className='h-12 text-sm'>
                    <td className='p-2'>{detail.name}</td>
                    {showEmailColumn && (
                      <>
                        <td className='p-2'>{detail.email || '-'}</td>
                        <td className='p-2'>
                          {detail.email_status === 'delivered' ? (
                            <span className='text-green-600'>Delivered</span>
                          ) : (
                            <span className='text-red-600'>Failed</span>
                          )}
                        </td>
                        <td className='p-2'>
                          {detail.email_delivered_at
                            ? format(
                                new Date(detail.email_delivered_at),
                                'MMM d, yyyy h:mm a'
                              )
                            : '-'}
                        </td>
                      </>
                    )}
                    {showSMSColumn && (
                      <>
                        <td className='p-2'>{detail.phone || '-'}</td>
                        <td className='p-2'>
                          {detail.sms_status === 'delivered' ? (
                            <span className='text-green-600'>Delivered</span>
                          ) : (
                            <span className='text-red-600'>Failed</span>
                          )}
                        </td>
                        <td className='p-2'>
                          {detail.sms_delivered_at
                            ? format(
                                new Date(detail.sms_delivered_at),
                                'MMM d, yyyy h:mm a'
                              )
                            : '-'}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='mt-6 flex w-full items-center justify-end'>
              <Pagination
                currentPage={page}
                totalPages={response.meta.last_page}
                onPageChange={(type, page) => {
                  if (type === 'next') {
                    setPage((prev) => prev + 1);
                  } else if (type === 'prev') {
                    setPage((prev) => prev - 1);
                  } else if (page) {
                    setPage(page);
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      {status === 'loading' && (
        <div className='flex items-center justify-center py-10'>
          <Spinner height={22} width={22} />
        </div>
      )}
    </Modal>
  );
}
