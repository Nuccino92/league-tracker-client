'use client';

import StyledBox from '@/app/lib/components/StyledBox';
import { useNoticeStatistics } from '@/app/lib/hooks/api/control-panel/notices';

export default function NoticeStats() {
  const { data, status } = useNoticeStatistics();

  const { active_announcements, credits_remaining, messages_sent } = data
    ? data
    : {};

  return (
    <StyledBox classes='p-4 grid grid-cols-4 gap-4 border-none' boxShadow>
      <StyledBox classes='p-4 bg-white' boxShadow>
        <div className='text-sm text-gray-500'>Messages Sent</div>
        {status === 'success' && messages_sent && (
          <div className='mt-2 flex h-8 items-center justify-start gap-2 text-2xl font-bold'>
            <span>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                width='1em'
                height='1em'
                className=' h-7 w-7'
              >
                <path
                  fill='none'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M8 9h8m-8 4h6m-1 5l-5 3v-3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v6m-5 9l5-5m0 4.5V17h-4.5'
                ></path>
              </svg>
            </span>
            {messages_sent.total}
          </div>
        )}
        {status === 'loading' && (
          <div className='mt-1 h-7 w-28 animate-pulse rounded-md bg-gray-200 text-2xl font-bold' />
        )}
      </StyledBox>
      <StyledBox classes='p-4 bg-white' boxShadow>
        <div className='text-sm text-gray-500'>SMS Credits Left</div>
        {status === 'success' && credits_remaining && (
          <div className='mt-2 flex h-8 items-center justify-start gap-2 text-2xl font-bold'>
            <span>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
                width='1em'
                height='1em'
                className=' h-7 w-7'
              >
                <g fill='currentColor'>
                  <path d='M8 16.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z'></path>
                  <path
                    fillRule='evenodd'
                    d='M4 4a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V4Zm4-1.5v.75c0 .414.336.75.75.75h2.5a.75.75 0 0 0 .75-.75V2.5h1A1.5 1.5 0 0 1 14.5 4v12a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 16V4A1.5 1.5 0 0 1 7 2.5h1Z'
                    clipRule='evenodd'
                  ></path>
                </g>
              </svg>
            </span>
            {credits_remaining.sms.remaining}
          </div>
        )}
        {status === 'loading' && (
          <div className='mt-1 h-7 w-28 animate-pulse rounded-md bg-gray-200 text-2xl font-bold' />
        )}
      </StyledBox>
      <StyledBox classes='p-4 bg-white' boxShadow>
        <div className='text-sm text-gray-500'>Email Credits Left</div>
        {status === 'success' && credits_remaining && (
          <div className='mt-2 flex h-8 items-center justify-start gap-2 text-2xl font-bold'>
            <span>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                width='1em'
                height='1em'
                className=' h-7 w-7'
              >
                <path
                  fill='currentColor'
                  d='M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2zm-2 0l-8 5l-8-5zm0 12H4V8l8 5l8-5z'
                ></path>
              </svg>
            </span>
            {credits_remaining.email.remaining}
          </div>
        )}
        {status === 'loading' && (
          <div className='mt-1 h-7 w-28 animate-pulse rounded-md bg-gray-200 text-2xl font-bold' />
        )}
      </StyledBox>
      <StyledBox classes='p-4 bg-white' boxShadow>
        <div className='text-sm text-gray-500'>Active Announcements</div>
        {status === 'success' && active_announcements && (
          <div className='mt-2 flex h-8 items-center justify-start gap-2 text-2xl font-bold'>
            <span>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                width='1em'
                height='1em'
                className=' h-7 w-7'
              >
                <path
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  d='M11 15c3 0 8 4 8 4V3s-5 4-8 4zm-6 0l3 8h4l-3-8m10-1a3 3 0 1 0 0-6m-8 11c1 0 3-1 3-3M2 11c0-3.111 1.791-4 4-4h5v8H6c-2.209 0-4-.889-4-4Z'
                ></path>
              </svg>
            </span>
            {active_announcements.total}
          </div>
        )}
        {status === 'loading' && (
          <div className='mt-1 h-7 w-28 animate-pulse rounded-md bg-gray-200 text-2xl font-bold' />
        )}
      </StyledBox>{' '}
    </StyledBox>
  );
}
