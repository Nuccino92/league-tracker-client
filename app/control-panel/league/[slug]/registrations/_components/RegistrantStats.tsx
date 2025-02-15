'use client';

import { Listbox } from '@headlessui/react';
import { SVGProps, useState } from 'react';

import StyledBox from '@/app/lib/components/StyledBox';
import { useRegistrantStats } from '@/app/lib/hooks/api/control-panel/registrations';
import { currencies, CurrencyCode } from '@/app/lib/collections/currencies';
import classNames from 'classnames';
import { IconClose } from '@/app/lib/SVGs';

export default function RegistrantStats({ seasonId }: { seasonId?: string }) {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>(
    (localStorage.getItem('currency') as CurrencyCode) ?? 'USD'
  );

  const { response, status } = useRegistrantStats({
    seasonId,
    currency: selectedCurrency,
  });

  const handleCurrencyChange = (currency: CurrencyCode) => {
    setSelectedCurrency(currency);
    localStorage.setItem('currency', currency);
  };

  const currencyData = currencies.find((cur) => cur.code === selectedCurrency);

  return (
    <StyledBox
      classes='border-none p-4 flex items-center justify-between gap-4 overflow-x-auto swatches-picker'
      boxShadow
    >
      <StyledBox classes='w-full min-h-[84px] relative min-w-[200px]' boxShadow>
        <CurrencySelector
          onCurrencyChange={handleCurrencyChange}
          selectedCurrency={selectedCurrency}
          className='flex h-full min-h-[84px] items-center justify-center'
        />
      </StyledBox>
      <StyledBox
        classes='border-none w-full p-4 min-h-[84px] min-w-[200px]'
        boxShadow
      >
        {status === 'loading' && <StatSkeleton />}

        {status === 'success' && response && (
          <div className='space-y-1'>
            <div className='h-6 text-sm text-gray-500'>Total Registrants</div>
            <div className='flex h-6 items-center gap-1 text-xl font-medium'>
              <span>
                <UsersGroupSolid height={23} width={23} />
              </span>{' '}
              {response.total_registrants}
            </div>
          </div>
        )}
      </StyledBox>
      <StyledBox
        classes='border-none w-full p-4 min-h-[84px] min-w-[200px]'
        boxShadow
      >
        {status === 'loading' && <StatSkeleton />}

        {status === 'success' && response && (
          <div className='space-y-1'>
            <div className='h-6 text-sm text-gray-500'>Total Revenue</div>
            <div className='h-6 text-xl font-medium'>
              {currencyData?.symbol}
              {response.total_revenue_formatted}
            </div>
          </div>
        )}
      </StyledBox>
      <StyledBox
        classes='border-none w-full p-4 min-h-[84px] min-w-[200px]'
        boxShadow
      >
        {status === 'loading' && <StatSkeleton />}

        {status === 'success' && response && (
          <div className='space-y-1'>
            <div className='h-6 text-sm text-gray-500'>
              Registrants This Week
            </div>
            <div className='flex h-6 items-center gap-1 text-xl font-medium'>
              <span>
                <UsersGroupSolid height={23} width={23} />
              </span>{' '}
              {response.total_weekly_registrants}
            </div>
          </div>
        )}
      </StyledBox>
      <StyledBox
        classes='border-none w-full p-4 min-h-[84px] min-w-[200px]'
        boxShadow
      >
        {status === 'loading' && <StatSkeleton />}

        {status === 'success' && response && (
          <div className='space-y-1'>
            <div className='h-6 text-sm text-gray-500'>Revenue This Weeks</div>
            <div className='h-6 text-xl font-medium'>
              {currencyData?.symbol}
              {response.total_weekly_revenue_formatted}
            </div>
          </div>
        )}
      </StyledBox>
    </StyledBox>
  );
}

interface CurrencySelectorProps {
  onCurrencyChange?: (currencyCode: CurrencyCode) => void;
  selectedCurrency?: CurrencyCode;
  className?: string;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  onCurrencyChange,
  selectedCurrency,
  className = '',
}) => {
  const currencyData = currencies.find((cur) => cur.code === selectedCurrency);

  return (
    <div className={classNames(className, 'relative h-full w-full')}>
      <Listbox value={selectedCurrency} onChange={onCurrencyChange}>
        {({ open }) => (
          <>
            <Listbox.Button className='relative !m-0 flex h-full min-h-[84px] w-full flex-col justify-between p-4 text-start'>
              <span className='h-6 w-[150px] text-sm text-gray-500'>
                Choose currency:
              </span>

              <span className='h-6 w-[250px] text-xl font-medium'>
                <span>{currencyData?.symbol}</span>
                <span>{currencyData?.code}</span>
              </span>
            </Listbox.Button>

            {open && (
              <div className='fixed inset-0 z-50 bg-white'>
                <div className='flex h-full flex-col'>
                  <div className='flex items-center justify-between border-b p-4'>
                    <h2 className='w-full whitespace-nowrap text-lg font-semibold'>
                      Select Currency
                    </h2>
                    <Listbox.Button className='rounded-full p-1 hover:bg-gray-100'>
                      <IconClose height={20} width={20} />
                    </Listbox.Button>
                  </div>

                  <div className='flex-1 items-center justify-center overflow-auto p-4 lg:flex'>
                    <Listbox.Options
                      static
                      className='grid max-w-[1000px] grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
                    >
                      {currencies.map((currency) => (
                        <Listbox.Option
                          key={currency.code}
                          value={currency.code}
                          className={({ active, selected }) => `
                            flex aspect-square cursor-pointer flex-col items-center justify-center 
                            rounded-lg border p-4 transition-colors
                            ${selected ? 'border-primary bg-primary text-white' : 'bg-white hover:bg-gray-50'}
                            ${active ? 'bg-gray-50' : ''}
                          `}
                        >
                          {({ selected }) => (
                            <>
                              <span className='mb-1 text-2xl'>
                                {currency.symbol}
                              </span>
                              <span
                                className={classNames(
                                  selected ? 'text-white/80' : 'text-gray-500',
                                  'text-sm font-medium '
                                )}
                              >
                                {currency.code}
                              </span>
                              <span
                                className={classNames(
                                  selected ? 'text-white/80' : 'text-gray-500',
                                  'mt-1 text-center text-xs'
                                )}
                              >
                                {currency.name}
                              </span>
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </Listbox>
    </div>
  );
};

function StatSkeleton() {
  return (
    <div className='space-y-1'>
      <div className='h-6 w-[150px] animate-pulse rounded bg-gray-100'></div>
      <div className='h-6 w-[240px] animate-pulse rounded bg-gray-100'></div>
    </div>
  );
}
function UsersGroupSolid(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      width='1em'
      height='1em'
      {...props}
    >
      <path
        fill='currentColor'
        fillRule='evenodd'
        d='M12 6a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7m-1.5 8a4 4 0 0 0-4 4a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2a4 4 0 0 0-4-4zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293a3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2a4 4 0 0 0-4-4h-1.1a5.5 5.5 0 0 1-.471.762A6 6 0 0 1 19.5 18M4 7.5a3.5 3.5 0 0 1 5.477-2.889a5.5 5.5 0 0 0-2.796 6.293A3.5 3.5 0 0 1 4 7.5M7.1 12H6a4 4 0 0 0-4 4a2 2 0 0 0 2 2h.5a6 6 0 0 1 3.071-5.238A5.5 5.5 0 0 1 7.1 12'
        clipRule='evenodd'
      ></path>
    </svg>
  );
}
