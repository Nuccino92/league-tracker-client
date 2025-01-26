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
    <StyledBox>
      <div>
        <div className='flex items-center justify-between'>
          {/* Tabs */}
          <div className='space-x-4'>
            {tabs.map((tab) => {
              return (
                <Button
                  variant={selectedTab === tab.value ? 'default' : 'outline'}
                  key={tab.value}
                  type='button'
                  className={classNames(
                    selectedTab === tab.value ? 'border border-primary' : '',
                    ''
                  )}
                  onClick={() =>
                    setSelectedTab(tab.value as NotificationTabOptions)
                  }
                >
                  {tab.label}
                </Button>
              );
            })}
          </div>

          {/* Settings/Only show unreads */}
          <div className=' flex items-center gap-6 text-sm'>
            <NotificationSettings />

            <div className='flex items-center gap-2'>
              <span>Show only unread</span>
              <Switch
                onChange={(checked) => setShowOnlyUnreads((prev) => !prev)}
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
        <div className='flex items-center justify-end gap-6 p-4'>
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
        {/* Conditional Selected Notifications bar */}
        {selectedNotificationIds.length > 0 && (
          <div className='space-x-4 px-6 text-sm'>
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
              className='!p-0'
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
                markAsReadMutation.mutateAsync(selectedNotificationIds);
              }}
            >
              <span>Mark as read</span>
            </Button>
          </div>
        )}
        {/* Notifications */}
        {status === 'success' && response && (
          <div className='space-y-4'>
            {response.data.map((notification) => (
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
                onDelete={(id) => {
                  deleteSelectedNotificationsMutation.mutateAsync([id]);
                }}
                onMarkAsRead={(id) => {
                  markAsReadMutation.mutateAsync([id]);
                }}
              />
            ))}

            {response && (
              <Pagination
                currentPage={response.meta.current_page}
                totalPages={response.meta.last_page}
                onPageChange={(type, page) => {
                  setPage(page);
                }}
              />
            )}
          </div>
        )}{' '}
      </div>

      {status === 'loading' && (
        <div className='flex items-center justify-center py-12'>
          <Spinner height={29} width={29} />
        </div>
      )}
    </StyledBox>
  );
}
