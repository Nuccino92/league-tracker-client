import AuthedContainer from '@/app/lib/components/_auth/AuthedContainer';
import StyledBox from '@/app/lib/components/StyledBox';
import SubscriptionPlans from '@/app/followed-leagues/billing-and-subscription/_components/SubscriptionPlans';
import BillingHistory from '@/app/followed-leagues/billing-and-subscription/_components/BillingHistory';

//https://dribbble.com/shots/24946404-Billing-Subscription-page-CRM-Dashboard
export default function BillingAndSubscriptionPage() {
  return (
    <AuthedContainer>
      <StyledBox classes='p-6 space-y-6'>
        <SubscriptionPlans />
        <BillingHistory />
      </StyledBox>
    </AuthedContainer>
  );
}
