'use client';

import { useState } from 'react';
import classNames from 'classnames';
import { Switch } from '@headlessui/react';

import StyledBox from '@/app/lib/components/StyledBox';
import {
  useDeleteAllNotifications,
  useDeleteSelectedNotifications,
  useMarkAllNotificationsAsRead,
  useMarkNotificationsAsRead,
  useNotifications,
} from '@/app/lib/hooks/api/notifications';
import { DeleteIcon, Spinner } from '@/app/lib/SVGs';
import { NotificationTabOptions } from '@/app/notifications/types';
import { Button } from '@/app/lib/components/Button';
import Pagination from '@/app/lib/components/Pagination';
import Notification from '@/app/notifications/_components/Notification';
import NotificationSettings from '@/app/notifications/_components/NotificationSettings';
import PageHeader from '@/app/control-panel/_components/PageHeader';

/**
 *
 * @todos
 *
 * 1. figure out backend tables
 * 2. figure out api response for useNotifications (types)
 * 3. cleanup current ui
 * 4. implement notification item ui
 */

export default function Notifications() {
  const [selectedTab, setSelectedTab] = useState<NotificationTabOptions>('all');
  const [showOnlyUnreads, setShowOnlyUnreads] = useState(false);
  const [page, setPage] = useState(1);

  const { response, status } = useNotifications({
    page,
    selectedTab,
    showOnlyUnreads,
  });

  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const deleteAllNotificationsMutation = useDeleteAllNotifications();

  const markAsReadMutation = useMarkNotificationsAsRead();
  const deleteSelectedNotificationsMutation = useDeleteSelectedNotifications();

  const [selectedNotificationIds, setSelectedNotificationIds] = useState<
    number[]
  >([]);

  const tabs = [
    {
      label: 'All',
      value: 'all',
    },
    {
      label: 'Unread',
      value: 'unread',
    },
    {
      label: 'Keepr',
      value: 'keepr',
    },
    {
      label: 'league',
      value: 'League',
    },
  ];

  return (
    <StyledBox classes='py-6'>
      <div>
        <div className='flex items-center justify-between pb-6 pl-6 pr-4'>
          <PageHeader text='Notifications' />
          {/* Settings/Only show unreads */}
          <div className=' flex items-center gap-6 text-sm'>
            <NotificationSettings />

            <div className='flex items-center gap-2'>
              <span>Show only unread</span>
              <Switch
                onChange={() => {
                  setShowOnlyUnreads((prev) => !prev);
                  setPage(1);
                }}
                checked={showOnlyUnreads}
                className={classNames(
                  showOnlyUnreads ? 'bg-primary' : 'bg-gray-200',
                  'relative inline-flex h-6 w-11 items-center rounded-full'
                )}
              >
                <span className='sr-only'>Enable Registration</span>
                <span
                  className={classNames(
                    showOnlyUnreads ? 'translate-x-6' : 'translate-x-1',
                    'inline-block h-4 w-4 transform rounded-full bg-white transition'
                  )}
                />
              </Switch>{' '}
            </div>
          </div>
        </div>
        {/*Mark all as read/delete all */}
        <div className='flex items-center justify-between gap-6 px-4 pt-4'>
          {/* Tabs */}
          <div className='space-x-4'>
            {tabs.map((tab) => {
              return (
                <Button
                  variant={'ghost'}
                  key={tab.value}
                  type='button'
                  className={classNames(
                    selectedTab === tab.value
                      ? 'border-primary text-primary'
                      : 'border-transparent',
                    'rounded-none border-b-2'
                  )}
                  onClick={() => {
                    setSelectedTab(tab.value as NotificationTabOptions);
                    setSelectedNotificationIds([]);
                    setPage(1);
                  }}
                >
                  {tab.label}
                </Button>
              );
            })}
          </div>

          <div className='flex items-center'>
            <div className='flex w-[140px] items-center justify-center'>
              <Button
                disabled={
                  markAllAsReadMutation.isLoading ||
                  !response ||
                  response.data.length === 0
                }
                onClick={async () => {
                  await markAllAsReadMutation.mutateAsync();
                }}
                variant={'ghost'}
                className='!p-0 text-blue-600'
              >
                Mark all as read
              </Button>{' '}
            </div>

            <div
              aria-hidden
              className='flex w-[45px] items-center justify-center'
            />

            <div className='mr-2 flex w-[45px] items-center justify-center'>
              <Button
                disabled={
                  deleteAllNotificationsMutation.isLoading ||
                  !response ||
                  response.data.length === 0
                }
                variant={'ghost'}
                className='flex items-center gap-1 !p-0 text-gray-500 hover:text-gray-900'
                onClick={async () => {
                  await deleteAllNotificationsMutation.mutateAsync();
                }}
              >
                <span>All</span>
                <span>
                  <DeleteIcon height={20} width={20} />
                </span>
              </Button>
            </div>
          </div>
        </div>
        {/* Notifications */}
        {status === 'success' && response && (
          <div className='space-y-4'>
            {response.data.length > 0 &&
              response.data.map((notification, index) => (
                <div key={notification.id} className='border-t pt-4'>
                  {/* Conditional Selected Notifications bar */}
                  {selectedNotificationIds.length > 0 && index === 0 && (
                    <div className='mb-4 flex items-center space-x-4 border-b px-4 pb-2 text-sm text-gray-500'>
                      <span className='-mt-[4px]'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 24 24'
                          width={27}
                          height={27}
                        >
                          <g fill='currentColor'>
                            <path d='M17 20v-5h2v6.988H3V15h1.98v5z'></path>
                            <path d='m6.84 14.522l8.73 1.825l.369-1.755l-8.73-1.825zm1.155-4.323l8.083 3.764l.739-1.617l-8.083-3.787zm3.372-5.481L10.235 6.08l6.859 5.704l1.132-1.362zM15.57 17H6.655v2h8.915zM12.861 3.111l6.193 6.415l1.414-1.415l-6.43-6.177z'></path>
                          </g>
                        </svg>
                      </span>

                      <span>
                        {selectedNotificationIds.length}{' '}
                        {selectedNotificationIds.length === 1
                          ? 'Notification'
                          : 'Notifications'}{' '}
                        Selected
                      </span>

                      <Button
                        disabled={deleteSelectedNotificationsMutation.isLoading}
                        variant={'ghost'}
                        className='!p-0 text-red-500'
                        onClick={() => {
                          deleteSelectedNotificationsMutation.mutateAsync(
                            selectedNotificationIds
                          );
                        }}
                      >
                        <span>Delete</span>
                      </Button>

                      <Button
                        disabled={markAsReadMutation.isLoading}
                        variant={'ghost'}
                        className='!p-0 text-blue-600'
                        onClick={() => {
                          markAsReadMutation.mutateAsync(
                            selectedNotificationIds
                          );
                        }}
                      >
                        <span>Mark as read</span>
                      </Button>
                    </div>
                  )}
                  <Notification
                    key={notification.id}
                    notification={notification}
                    selected={selectedNotificationIds.includes(notification.id)}
                    onSelect={(id) => {
                      const selected = selectedNotificationIds.includes(
                        notification.id
                      );

                      if (selected) {
                        setSelectedNotificationIds((prev) =>
                          prev.filter((notificationId) => notificationId !== id)
                        );
                      } else {
                        setSelectedNotificationIds((prev) => [...prev, id]);
                      }
                    }}
                  />{' '}
                </div>
              ))}

            {response.data.length > 0 && response && (
              <Pagination
                currentPage={response.meta.current_page}
                totalPages={response.meta.last_page}
                onPageChange={(type, page) => {
                  setPage(page);
                }}
              />
            )}

            {response.data.length === 0 && (
              <div className='flex h-[50vh] items-center justify-center py-12 text-xl text-gray-500'>
                You have no notifications
              </div>
            )}
          </div>
        )}{' '}
      </div>

      {status === 'loading' && (
        <div className='flex h-[50vh] items-center justify-center py-12'>
          <Spinner height={29} width={29} />
        </div>
      )}
    </StyledBox>
  );
}
