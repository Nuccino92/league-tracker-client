'use client';

import StyledBox from '@/app/lib/components/StyledBox';

type Props = {
  leagueID: string;
};

export default function BillingHistory({ leagueID }: Props) {
  return (
    <StyledBox classes='p-6'>
      <div className='text-lg font-bold'>Billing History</div>
    </StyledBox>
  );
}
