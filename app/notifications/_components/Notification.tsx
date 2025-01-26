import classNames from 'classnames';
import { format } from 'date-fns';
import Link from 'next/link';

import { Button } from '@/app/lib/components/Button';
import Checkbox from '@/app/lib/components/Checkbox';
import { DeleteIcon, IconLink45deg } from '@/app/lib/SVGs';
import {
  NotificationItem,
  notificationTypeLabels,
} from '@/app/lib/types/notification.types';

type Props = {
  notification: NotificationItem;
  selected: boolean;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  onMarkAsRead: (id: number) => void;
};

export default function Notification({
  notification,
  selected,
  onSelect,
  onDelete,
  onMarkAsRead,
}: Props) {
  const typeTagLabel = notificationTypeLabels[notification.type];
  const { tagColor, bgColor, borderColor } =
    NOTIFICATION_STYLES[notification.type];

  return (
    <div className='border-t pt-4'>
      <div className='grid grid-cols-[1fr_auto_auto] items-center rounded-xl px-4 py-2'>
        <div className='flex items-center gap-4'>
          <Checkbox
            isChecked={selected}
            onClick={() => onSelect(notification.id)}
          />

          <div className=''>
            <div className='flex items-center gap-2'>
              {/* Type tag */}
              <div
                className={classNames(
                  tagColor,
                  bgColor,
                  borderColor,
                  'w-max rounded-xl border px-2 py-1 text-xs'
                )}
              >
                {typeTagLabel}
              </div>{' '}
              <span className='text-xs text-gray-500'>
                - {format(new Date(notification.created_at), 'PPP p')}
              </span>
            </div>

            <div className='my-1 text-sm font-medium'>{notification.title}</div>
            <p className='text-sm text-gray-500'>{notification.message}</p>
          </div>
        </div>

        {/* Right side */}
        <div className='flex items-center'>
          <div className='flex w-[140px] items-center justify-center'>
            {!notification.is_read && (
              <Button
                onClick={async (e) => {
                  e.stopPropagation();
                  onMarkAsRead(notification.id);
                }}
                variant={'ghost'}
                className='!p-0 text-blue-600'
              >
                Mark as read
              </Button>
            )}
          </div>

          <div className='flex w-[45px] items-center'>
            {notification.url && (
              <Link
                href={notification.url}
                className='flex items-center gap-1 !p-0 text-gray-500 hover:text-gray-900'
              >
                <IconLink45deg height={22} width={22} />
              </Link>
            )}{' '}
          </div>

          <div className='flex w-[45px] items-center justify-center'>
            <Button
              variant={'ghost'}
              className='flex items-center gap-1 !p-0 text-gray-500 hover:text-gray-900'
              onClick={async (e) => {
                e.stopPropagation();
                onDelete(notification.id);
              }}
            >
              <DeleteIcon height={20} width={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Notification Type Icons and Colors
const NOTIFICATION_STYLES = {
  league_invite: {
    tagColor: 'text-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
  },
  admin_message: {
    tagColor: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
  },
  registration_capacity: {
    tagColor: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-500',
  },
  subscription_purchased: {
    tagColor: 'text-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
  },
  subscription_expiring_week: {
    tagColor: 'text-orange-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-500',
  },
  subscription_expiring_three_days: {
    tagColor: 'text-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
  },
  subscription_updated: {
    tagColor: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
  },
};
