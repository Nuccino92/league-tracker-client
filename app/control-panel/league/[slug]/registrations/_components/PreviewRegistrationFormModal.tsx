import Modal from '@/app/lib/components/Modal';
import RegistrationForm from '@/app/lib/components/RegistrationForm';
import { ModalType } from '@/app/types';

export default function PreviewRegistrationFormModal({
  isOpen,
  close,
  formId,
}: ModalType & { formId: number }) {
  async function handleSubmit() {
    console.log('submitted');
  }

  return (
    <Modal
      panelClasses='sm:w-[610px] w-full rounded-xl'
      isOpen={isOpen}
      close={close}
    >
      <RegistrationForm id={formId} onSubmit={handleSubmit} />
    </Modal>
  );
}
