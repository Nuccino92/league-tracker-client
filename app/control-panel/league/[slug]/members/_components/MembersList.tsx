'use client';

import MissingList from '@/app/control-panel/_components/MissingList';
import { MemberRolesEnum } from '@/app/lib/enums';
import { useMembers } from '@/app/lib/hooks/api/control-panel/members';
import { EmptyListIcon, Spinner } from '@/app/lib/SVGs';
import getEnumKeyByEnumValue from '@/app/lib/utils/getEnumKeyByEnumValue';

type Props = {
  slug: string;
};

export default function MembersList({ slug }: Props) {
  const { data, status } = useMembers({
    slug,
    includeOnly: ['search', 'role'],
  });

  return (
    <div className=''>
      {data && status === 'success' ? (
        <>
          {data.length > 0 ? (
            data.map((member) => (
              <div key={member.id}>
                {member.name}{' '}
                {getEnumKeyByEnumValue(MemberRolesEnum, member.role)}
              </div>
            ))
          ) : (
            <MissingList
              text='No League Members'
              icon={<EmptyListIcon className='w-full' height={55} width={55} />}
            />
          )}
        </>
      ) : null}
      {status === 'loading' ? (
        <div className='flex h-full w-full items-center justify-center'>
          <Spinner width={50} height={50} />
        </div>
      ) : null}
    </div>
  );
}
