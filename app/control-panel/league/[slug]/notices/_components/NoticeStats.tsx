'use client';

import StyledBox from '@/app/lib/components/StyledBox';
import { useNoticeStatistics } from '@/app/lib/hooks/api/control-panel/notices';

export default function NoticeStats() {
  const { data, status } = useNoticeStatistics();

  const { active_announcements, credits_remaining, messages_sent } = data
    ? data
    : {};

  return (
    <div className='grid grid-cols-4 gap-4'>
      <StyledBox classes='p-4'>
        <div className='text-sm text-gray-500'>Messages Sent (This Month)</div>
        {status === 'success' && messages_sent && (
          <div className='h-8 text-2xl font-bold'>{messages_sent.total}</div>
        )}
        {status === 'loading' && (
          <div className='mt-1 h-7 w-28 animate-pulse rounded-md bg-gray-200 text-2xl font-bold' />
        )}
      </StyledBox>
      <StyledBox classes='p-4'>
        <div className='text-sm text-gray-500'>SMS Credits Left</div>
        {status === 'success' && credits_remaining && (
          <div className='h-8 text-2xl font-bold'>
            {credits_remaining.sms.remaining}
          </div>
        )}
        {status === 'loading' && (
          <div className='mt-1 h-7 w-28 animate-pulse rounded-md bg-gray-200 text-2xl font-bold' />
        )}
      </StyledBox>
      <StyledBox classes='p-4'>
        <div className='text-sm text-gray-500'>Email Credits Left</div>
        {status === 'success' && credits_remaining && (
          <div className='h-8 text-2xl font-bold'>
            {credits_remaining.email.remaining}
          </div>
        )}
        {status === 'loading' && (
          <div className='mt-1 h-7 w-28 animate-pulse rounded-md bg-gray-200 text-2xl font-bold' />
        )}
      </StyledBox>
      <StyledBox classes='p-4'>
        <div className='text-sm text-gray-500'>Active Announcements</div>
        {status === 'success' && active_announcements && (
          <div className='h-8 text-2xl font-bold'>
            {active_announcements.total}
          </div>
        )}
        {status === 'loading' && (
          <div className='mt-1 h-7 w-28 animate-pulse rounded-md bg-gray-200 text-2xl font-bold' />
        )}
      </StyledBox>
    </div>
  );
}
