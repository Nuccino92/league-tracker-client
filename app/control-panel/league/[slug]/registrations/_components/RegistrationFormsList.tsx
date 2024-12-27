import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import classNames from 'classnames';

import StyledBox from '@/app/lib/components/StyledBox';
import { EditIcon, IconEye } from '@/app/lib/SVGs';
import { RegistrationItem } from '@/app/lib/types/Responses/control-panel.types';
import PreviewRegistrationFormModal from '@/app/control-panel/league/[slug]/registrations/_components/PreviewRegistrationFormModal';
import CreateRegistrationFormModal from '@/app/control-panel/league/[slug]/registrations/_components/CreateRegistrationFormModal';

type Props = {
  slug: string;
  forms: RegistrationItem[];
};

export default function RegistrationFormsList({ slug, forms }: Props) {
  return (
    <StyledBox classes=''>
      {forms.length > 0 && (
        <div>
          <div className='grid grid-cols-5 gap-4 border-b p-4 text-sm font-medium'>
            <div>Season</div>
            <div>Price</div>
            <div>Open Date</div>
            <div>Close Date</div>
            <div></div>
          </div>
          <div className='divide-y'>
            {forms.map((form) => (
              <Form key={form.id} form={form} slug={slug} />
            ))}
          </div>
        </div>
      )}
    </StyledBox>
  );
}

function Form({ form, slug }: { form: RegistrationItem; slug: string }) {
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return format(parseISO(dateString), 'MMMM d, yyyy');
  };

  return (
    <>
      <div className='grid grid-cols-5 items-center gap-4 p-4 text-sm'>
        <div>{form.season.name}</div>
        <div>{form.price === 0 ? 'Free' : `$${form.price.toFixed(2)}`}</div>
        <div>{formatDate(form.openDate)}</div>
        <div
          className={classNames(
            !form.closeDate && 'font-medium italic text-zinc-500'
          )}
        >
          {formatDate(form.closeDate)}
        </div>
        <div className='flex justify-end gap-2'>
          {/* TODO: disable if the season isn't on a paid subscription */}
          <button
            className='flex h-8 w-8 items-center justify-center rounded border shadow hover:opacity-75'
            onClick={() => setShowPreviewModal(true)}
          >
            <IconEye height={20} width={20} />
          </button>
          <button
            className='flex h-8 w-8 items-center justify-center rounded border bg-primary shadow hover:opacity-75'
            onClick={() => setShowEditModal(true)}
          >
            <EditIcon height={18} width={18} color='white' />
          </button>
        </div>
      </div>

      {showPreviewModal && (
        <PreviewRegistrationFormModal
          isOpen={showPreviewModal}
          close={() => setShowPreviewModal(false)}
          formId={form.id}
        />
      )}

      {/* TODO: disable if the season isn't on a paid subscription */}
      {showEditModal && (
        <CreateRegistrationFormModal
          isOpen={showEditModal}
          close={() => setShowEditModal(false)}
          slug={slug}
          renderAsUpdate={{
            initialValues: {
              id: form.id,
              seasonId: form.season.id.toString(),
              price: form.price,
              description: form.description,
              openDate: new Date(form.openDate),
              closeDate: form.closeDate ? new Date(form.closeDate) : null,
            },
          }}
        />
      )}
    </>
  );
}
