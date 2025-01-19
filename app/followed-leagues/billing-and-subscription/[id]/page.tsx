import AuthedContainer from '@/app/lib/components/_auth/AuthedContainer';
import StyledBox from '@/app/lib/components/StyledBox';
import SubscriptionPlans from '@/app/followed-leagues/billing-and-subscription/_components/SubscriptionPlans';
import BillingHistory from '@/app/followed-leagues/billing-and-subscription/_components/BillingHistory';

export default function BillingAndSubscriptionPage({
  params,
}: {
  params: { ['id']: string };
}) {
  return (
    <AuthedContainer>
      <StyledBox classes='p-6 space-y-6'>
        <SubscriptionPlans leagueID={params.id} />
        <BillingHistory leagueID={params.id} />
      </StyledBox>
    </AuthedContainer>
  );
}
