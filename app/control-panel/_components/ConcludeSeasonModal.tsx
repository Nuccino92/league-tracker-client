import { FormikProps } from 'formik';

import Modal from '@/app/lib/components/Modal';
import { ModalType } from '@/app/types';

type Props = {
  formikProps: FormikProps<{
    all_seasons: {
      id: string;
      name: string;
    }[];
    active_season: string;
  }>;
};

export default function ConcludeSeasonModal({
  panelClasses,
  isOpen,
  close,
  formikProps,
}: ModalType & Props) {
  return (
    <Modal panelClasses='sm:w-[450px] w-full' isOpen={isOpen} close={close}>
      <div className='items-center justify-center space-y-6 text-center'>
        <span className='flex items-center justify-center text-yellow-500'>
          {modalAlertIcon}
        </span>
        <h4 className='flex flex-col text-center text-lg '>
          <span>Are you sure you would like to conclude</span>{' '}
          <span className='und font-bold'>
            {
              formikProps.values.all_seasons.find(
                (season) => season.id === formikProps.values.active_season
              )?.name
            }
          </span>
        </h4>

        <p className='text-sm'>
          Concludling a season prevents games from being submitted & numerous
          other actions until another season is activated.
        </p>

        <div className='space-x-2 font-medium text-white'>
          <button
            onClick={() => {
              try {
                //TODO: send request to conclude the season
                formikProps.setFieldValue('active_season', null);

                close();
              } catch (error) {
                console.log(error);
              }
            }}
            type='button'
            className='rounded-md border border-yellow-500 bg-yellow-500 p-2 focus:outline-secondary'
          >
            Yes, conclude season
          </button>
          <button
            onClick={close}
            type='button'
            className='rounded-md border border-primary bg-primary p-2 focus:outline-secondary'
          >
            No, return
          </button>
        </div>
      </div>
    </Modal>
  );
}

const modalAlertIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth={1.5}
    stroke='currentColor'
    className='h-10 w-10'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z'
    />
  </svg>
);
