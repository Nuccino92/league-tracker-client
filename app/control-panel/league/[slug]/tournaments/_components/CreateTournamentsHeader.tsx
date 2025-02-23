import { Button } from '@/app/lib/components/Button';
import StyledBox from '@/app/lib/components/StyledBox';
import { IconPlus } from '@/app/lib/SVGs';
import Link from 'next/link';

/**
 *
 * @returns
 * @TODO could make this into a tournament create software page, similarly to create league. Need to create a component that could take an existing tournament for editing or a new one
 */

export default function CreateTournaments() {
  return (
    <StyledBox classes='flex items-center justify-end p-4'>
      <Link href={'#'}>
        <Button className='flex !h-10 items-center gap-2'>
          <IconPlus /> Create Registration Form
        </Button>
      </Link>
    </StyledBox>
  );
}
