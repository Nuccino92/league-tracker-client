import Image from 'next/image';
import classNames from 'classnames';
import { format, parseISO } from 'date-fns';

import Modal from '@/app/lib/components/Modal';
import { RegistrantItem } from '@/app/lib/types/Responses/control-panel.types';
import { ModalType } from '@/app/types';
import { Button } from '@/app/lib/components/Button';

type Props = {
  registrant: RegistrantItem;
};

export default function RegistrationSummaryModal({
  isOpen,
  close,
  panelClasses,
  registrant,
}: Props & ModalType) {
  console.log('registrant', registrant);

  return (
    <Modal
      panelClasses={classNames(
        panelClasses,
        'sm:w-[640px] w-full overflow-visible w-max relative rounded-xl'
      )}
      isOpen={isOpen}
      close={close}
    >
      {' '}
      <h2 className='mb-6 pr-8 text-xl font-semibold'>Registration Summary</h2>
      <div className='rounded-xl bg-slate-50 p-6'>
        {/* Personal Information */}
        <div className='space-y-6 divide-y'>
          <div>
            <h3 className='mb-4 text-sm font-medium text-gray-500'>
              Personal Information
            </h3>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div>
                <div className='text-sm text-gray-500'>Full Name</div>
                <div className='font-medium'>
                  {registrant.firstName} {registrant.lastName}
                </div>
              </div>
              <div>
                <div className='text-sm text-gray-500'>Email</div>
                <div className='font-medium'>{registrant.email}</div>
              </div>
              <div>
                <div className='text-sm text-gray-500'>Phone</div>
                <div className='font-medium'>{registrant.phone}</div>
              </div>
              <div>
                <div className='text-sm text-gray-500'>Registration Date</div>
                <div className='font-medium'>
                  {format(parseISO(registrant.created_at), 'MMMM d, yyyy')}
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          {(registrant.emergencyContactName ||
            registrant.emergencyContactPhone) && (
            <div className='pt-6'>
              <h3 className='mb-4 text-sm font-medium text-gray-500'>
                Emergency Contact
              </h3>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                {registrant.emergencyContactName && (
                  <div>
                    <div className='text-sm text-gray-500'>Name</div>
                    <div className='font-medium'>
                      {registrant.emergencyContactName}
                    </div>
                  </div>
                )}
                {registrant.emergencyContactPhone && (
                  <div>
                    <div className='text-sm text-gray-500'>Phone</div>
                    <div className='font-medium'>
                      {registrant.emergencyContactPhone}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payment Information */}
          <div className='pt-6'>
            <h3 className='mb-4 text-sm font-medium text-gray-500'>
              Payment Details
            </h3>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <div className='text-sm text-gray-500'>Amount Paid</div>
                <div className='font-medium'>
                  {registrant.payment ? (
                    <> ${((registrant.payment?.total ?? 0) / 100).toFixed(2)}</>
                  ) : (
                    'FREE'
                  )}
                </div>
              </div>
              {registrant.payment?.receipt_url && (
                <div>
                  <a
                    href={registrant.payment.receipt_url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-sm text-blue-500 hover:text-blue-600'
                  >
                    View Receipt
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Photo */}
          {registrant.photo && registrant.photo !== '' && (
            <div className='py-6'>
              <h3 className='mb-4 text-sm font-medium text-gray-500'>
                Player Photo
              </h3>
              <div className='relative h-[200px] w-[200px] rounded-md border bg-white'>
                <Image
                  src={registrant.photo}
                  alt='Player photo'
                  fill
                  style={{ objectFit: 'contain' }}
                  className='rounded-md'
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='mt-8 flex justify-end'>
          <Button onClick={close} className='bg-white' variant={'outline'}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
