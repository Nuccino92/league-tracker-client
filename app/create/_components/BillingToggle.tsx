import classNames from 'classnames';

interface BillingToggleProps {
  billingPeriod: 'monthly' | 'yearly';
  onChange: (period: 'monthly' | 'yearly') => void;
}

export default function BillingToggle({
  billingPeriod,
  onChange,
}: BillingToggleProps) {
  return (
    <div className='flex flex-col items-center gap-2'>
      <div className='flex items-center gap-3 rounded-full border p-1'>
        <button
          type='button'
          onClick={() => onChange('monthly')}
          className={classNames(
            'rounded-full px-4 py-2 text-sm font-medium transition-colors',
            billingPeriod === 'monthly'
              ? 'bg-primary text-white'
              : 'text-gray-500 hover:text-gray-700'
          )}
        >
          Monthly
        </button>
        <button
          type='button'
          onClick={() => onChange('yearly')}
          className={classNames(
            'rounded-full px-4 py-2 text-sm font-medium transition-colors',
            billingPeriod === 'yearly'
              ? 'bg-primary text-white'
              : 'text-gray-500 hover:text-gray-700'
          )}
        >
          Yearly
          <span className='ml-1 text-xs text-secondary'>Save 30%</span>
        </button>
      </div>
    </div>
  );
}
