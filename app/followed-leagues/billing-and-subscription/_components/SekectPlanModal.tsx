'use client';

import classNames from 'classnames';

import Modal from '@/app/lib/components/Modal';
import { ModalType } from '@/app/types';

export default function SelectPlanModal({
  isOpen,
  close,
  panelClasses,
}: ModalType) {
  return (
    <Modal
      panelClasses={classNames(panelClasses, 'sm:w-[540px] w-full')}
      isOpen={isOpen}
      close={close}
    >
      <div className='space-y-6 px-6 text-center'>Selection plan process</div>
    </Modal>
  );
}

/**
 * Upgrades:

Immediate with Prorating (Most Common)


Cancel current subscription
Credit the unused portion
Start new subscription immediately
Charge only the difference

 Stripe handles this automatically

const subscription = await stripe.subscriptions.update(subscriptionId, {
  proration_behavior: 'always_invoice', // or 'create_prorations'
  items: [{
    id: subscriptionItemId,
    price: newPriceId,
  }],
});
Downgrades:

Schedule for End of Period (Most Common)


Keep current plan until billing period ends
Switch to lower plan at renewal

await stripe.subscriptions.update(subscriptionId, {
  proration_behavior: 'none',
  cancel_at_period_end: true,
  // Schedule the new subscription to start
  items: [{
    id: subscriptionItemId,
    price: newPriceId,
    // Will take effect at period end
  }],
});
 */
