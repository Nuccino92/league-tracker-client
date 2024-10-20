'use client';

import {
  ErrorMessage,
  FastField,
  Field,
  Form,
  Formik,
  FormikProps,
} from 'formik';
import { toFormikValidate } from 'zod-formik-adapter';
import { Dialog } from '@headlessui/react';

import Modal from '@/app/lib/components/Modal';
import { ModalType } from '@/app/types';

type Props = {
  //TODO: create type :)
  onSubmit: (formValues: any) => void;
};

export default function ScheduleGenerationForm({
  isOpen,
  close,
  onSubmit,
}: Props & ModalType) {
  /**
   * Form Values
   * - start & end date
   * - teams
   * - days of week
   * - games per team
   *
   */
  return (
    <Modal
      panelClasses='sm:min-w-[640px] w-full overflow-visible w-max'
      isOpen={isOpen}
      close={close}
    >
      <Dialog.Title>Settings</Dialog.Title>
      <Formik
        initialValues={{}}
        onSubmit={(values) => {
          console.log(values);
        }}
        validate={async (values) => {}}
      >
        {(props) => <Form>classic</Form>}
      </Formik>
    </Modal>
  );
}
