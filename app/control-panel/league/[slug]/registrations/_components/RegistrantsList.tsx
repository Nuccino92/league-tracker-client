'use client';

import StyledBox from '@/app/lib/components/StyledBox';
import { useRegistrantsList } from '@/app/lib/hooks/api/control-panel/registrations';

type Props = {
  slug: string;
};

export default function RegistrantsList({ slug }: Props) {
  const { data, status } = useRegistrantsList({
    slug,
    includeOnly: ['page', 'search', 'season'],
  });

  return <StyledBox>the list</StyledBox>;
}
