import StyledBox from '@/app/lib/components/StyledBox';
import { useRegistrantStats } from '@/app/lib/hooks/api/control-panel/registrations';

export default function RegistrantStats() {
  const { response, status } = useRegistrantStats();

  {
    /* todo: add currency select, possibly set in local storage */
  }

  return (
    <StyledBox
      classes='border-none p-4 mx-4 flex items-center justify-between gap-4'
      boxShadow
    >
      <StyledBox classes='border-none w-full p-4' boxShadow>
        {status === 'loading' && <StatSkeleton />}

        {status === 'success' && response && (
          <div className='space-y-1'>
            <div className='h-6 text-sm text-gray-500'>Total Registrants</div>
            <div className='h-6 text-lg font-medium'>
              {response.total_registrants}
            </div>
          </div>
        )}
      </StyledBox>
      <StyledBox classes='border-none w-full p-4' boxShadow>
        {status === 'loading' && <StatSkeleton />}

        {status === 'success' && response && (
          <div className='space-y-1'>
            <div className='h-6 text-sm text-gray-500'>Total Revenue</div>
            <div className='h-6 text-lg font-medium'>
              {response.total_revenue_formatted}
            </div>
          </div>
        )}
      </StyledBox>
      <StyledBox classes='border-none w-full p-4' boxShadow>
        {status === 'loading' && <StatSkeleton />}

        {status === 'success' && response && (
          <div className='space-y-1'>
            <div className='h-6 text-sm text-gray-500'>
              Registrants This Week
            </div>
            <div className='h-6 text-lg font-medium'>
              {response.total_weekly_registrants}
            </div>
          </div>
        )}
      </StyledBox>
      <StyledBox classes='border-none w-full p-4' boxShadow>
        {status === 'loading' && <StatSkeleton />}

        {status === 'success' && response && (
          <div className='space-y-1'>
            <div className='h-6 text-sm text-gray-500'>Revenue This Weeks</div>
            <div className='h-6 text-lg font-medium'>
              {response.total_weekly_revenue_formatted}
            </div>
          </div>
        )}
      </StyledBox>
    </StyledBox>
  );
}

function StatSkeleton() {
  return (
    <div className='space-y-1'>
      <div className='h-6 w-[150px] animate-pulse rounded bg-gray-100'></div>
      <div className='h-6 w-[250px] animate-pulse rounded bg-gray-100'></div>
    </div>
  );
}
