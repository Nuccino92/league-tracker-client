'use client';

import { Fragment, useState } from 'react';
import classNames from 'classnames';
import { Menu, Switch, Transition } from '@headlessui/react';

import StyledBox from '@/app/lib/components/StyledBox';
import {
  useDeleteAllNotifications,
  useDeleteSelectedNotifications,
  useMarkAllNotificationsAsRead,
  useMarkNotificationsAsRead,
  useNotifications,
} from '@/app/lib/hooks/api/notifications';
import { DeleteIcon, IconSettingsOutline, Spinner } from '@/app/lib/SVGs';
import { NotificationTabOptions } from '@/app/notifications/types';
import { Button } from '@/app/lib/components/Button';
import Pagination from '@/app/lib/components/Pagination';
import { NotificationItem } from '@/app/lib/types/notification.types';
import Checkbox from '@/app/lib/components/Checkbox';

export default function Notifications() {
  const [selectedTab, setSelectedTab] = useState<NotificationTabOptions>('all');
  const [showOnlyUnreads, setShowOnlyUnreads] = useState(false);
  const [page, setPage] = useState(1);

  //todo: pass the tab, onlyshow & page into hook
  const { response, status } = useNotifications();

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
          <div className='flex items-center gap-6 text-sm'>
            <Menu as='div' className='relative'>
              {({ open }) => (
                <>
                  <Menu.Button className='flex items-center gap-2'>
                    <span>
                      <IconSettingsOutline height={20} width={20} />
                    </span>
                    <span>Settings</span>
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter='transition ease-out duration-100'
                    enterFrom='transform opacity-0 scale-95'
                    enterTo='transform opacity-100 scale-100'
                    leave='transition ease-in duration-75'
                    leaveFrom='transform opacity-100 scale-100'
                    leaveTo='transform opacity-0 scale-95'
                  >
                    <Menu.Items className='absolute'>
                      <Menu.Item as='div'> dsadsaadss</Menu.Item>
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>

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
        <div className='flex items-center justify-end gap-6'>
          <Button
            disabled={deleteAllNotificationsMutation.isLoading}
            variant={'ghost'}
            className='flex items-center gap-1 !p-0 text-gray-500 hover:text-gray-900'
            onClick={async () => {
              await deleteAllNotificationsMutation.mutateAsync();
            }}
          >
            <span>All</span>
            <span>
              <DeleteIcon height={16} width={16} />
            </span>
          </Button>
          <Button
            disabled={markAllAsReadMutation.isLoading}
            onClick={async () => {
              await markAllAsReadMutation.mutateAsync();
            }}
            variant={'ghost'}
            className='!p-0 text-blue-600'
          >
            Mark all as read
          </Button>
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
          <div className='space-y-2'>
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
                totalPages={response.meta.total}
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

function Notification({
  notification,
  selected,
  onSelect,
  onDelete,
  onMarkAsRead,
}: {
  notification: NotificationItem;
  selected: boolean;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  onMarkAsRead: (id: number) => void;
}) {
  return (
    <div className='p-4'>
      <Checkbox
        isChecked={selected}
        onClick={() => onSelect(notification.id)}
      />

      <div>
        <Button
          variant={'ghost'}
          className='flex items-center gap-1 !p-0 text-gray-500 hover:text-gray-900'
          onClick={async () => {
            onDelete(notification.id);
          }}
        >
          <DeleteIcon height={16} width={16} />
        </Button>
        <Button
          onClick={async () => {
            onMarkAsRead(notification.id);
          }}
          variant={'ghost'}
          className='!p-0 text-blue-600'
        >
          Mark as read
        </Button>
      </div>
    </div>
  );
}
