'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

import { useAuth } from '@/app/GlobalContext';
import { useProductWithPricesList, useSetupIntent } from '../hooks/api/billing';
import { Product } from '../types/Responses/billing.types';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

type Props = {
  submitRequest: (value: any) => void;
  isProcessingPayment: boolean;
};

// TODO: implement other payment methods

export default function CheckoutForm({
  submitRequest,
  isProcessingPayment,
}: Props) {
  const { status: authStatus, token } = useAuth();

  const { data: intent, status: intentStatus } = useSetupIntent();

  const shouldRenderForm = intentStatus === 'success' && intent;

  return (
    <div id='checkout'>
      {/* {status === 'authenticated' ? (
        <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      ) : null} */}

      {shouldRenderForm ? (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: intent.client_secret,
            appearance: {
              theme: 'stripe',
            },
          }}
        >
          <PaymentElements
            submitRequest={submitRequest}
            isProcessingPayment={isProcessingPayment}
          />
        </Elements>
      ) : null}

      {!shouldRenderForm ? (
        <div className='flex h-full w-full items-center justify-center py-10'>
          {loader}
        </div>
      ) : null}

      {authStatus === 'unauthenticated' ? (
        <div className='text-sm italic text-red-500'>Please Login</div>
      ) : null}
    </div>
  );
}

function PaymentElements({ submitRequest, isProcessingPayment }: Props) {
  const elements = useElements();
  const stripe = useStripe();

  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: any) {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet.
      return;
    }

    const { error, setupIntent } = await stripe.confirmSetup({
      elements: elements,
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(
        error.message ?? 'Something went wrong processing payment'
      );
    } else {
      const { payment_method } = setupIntent;
      // CREATE SUB ON BACKEND
      if (!payment_method) return;

      submitRequest(payment_method);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col'>
      <PaymentElement
        id='payment-element'
        options={{
          layout: {
            type: 'tabs',
            defaultCollapsed: false,
          },
        }}
      />{' '}
      <button
        disabled={isProcessingPayment}
        type='submit'
        className='mt-6 self-end rounded border bg-secondary px-4 py-2 font-medium text-white'
      >
        {isProcessingPayment ? (
          <span className='flex h-6 w-full items-center justify-center'>
            {spinner}
          </span>
        ) : (
          <span className='h-6'> Pay Now </span>
        )}
      </button>
    </form>
  );
}

const spinner = (
  <span role='status'>
    <svg
      aria-hidden='true'
      className='h-6 w-6 animate-spin fill-primary text-gray-200 dark:text-gray-600'
      viewBox='0 0 100 101'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
        fill='currentColor'
      />
      <path
        d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
        fill='currentFill'
      />
    </svg>
    <span className='sr-only'>Loading...</span>
  </span>
);

const loader = (
  <div role='status'>
    <svg
      aria-hidden='true'
      className='h-6 w-6 animate-spin fill-secondary text-white'
      viewBox='0 0 100 101'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
        fill='currentColor'
      />
      <path
        d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
        fill='currentFill'
      />
    </svg>
    <span className='sr-only'>Loading...</span>
  </div>
);
