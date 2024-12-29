import classNames from 'classnames';

import StyledBox from '@/app/lib/components/StyledBox';
import { IconCheckmarkSharp } from '@/app/lib/SVGs';

interface SubscriptionCardProps {
  title: string;
  price: number;
  features: string[];
  highlight?: boolean;
}

export default function SubscriptionCard({
  title,
  price,
  features,
  highlight = false,
}: SubscriptionCardProps) {
  return (
    <StyledBox
      classes={classNames(
        'space-y-6 p-6 hover:bg-slate-50',
        highlight ? '!bg-primary text-white !border-primary' : 'bg-white'
      )}
    >
      {/* Title */}
      <div
        className={classNames(
          !highlight && 'text-gray-800',
          'text-2xl font-bold'
        )}
      >
        {title}
      </div>

      {/* Price */}
      <div className='space-y-1'>
        <div className='flex items-baseline'>
          <span className='text-4xl font-bold'>$</span>
          <span className='text-5xl font-bold'>{price}</span>
        </div>
        <div className={classNames(!highlight && 'text-gray-500')}>/ month</div>
      </div>

      {/* Features */}
      <div className='space-y-3 text-sm'>
        {features.map((feature, index) => (
          <div key={index} className='flex items-start gap-2'>
            <div className=''>
              {' '}
              <IconCheckmarkSharp height={17} width={17} color='#03C988' />
            </div>

            <span className={classNames(!highlight && 'text-gray-600')}>
              {feature}
            </span>
          </div>
        ))}
      </div>
    </StyledBox>
  );
}
