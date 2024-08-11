'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import PageHeader from '@/app/control-panel/_components/PageHeader';
import { IconOptionsOutline, IconUsergroupAdd } from '@/app/lib/SVGs';
import DropdownMenu from '@/app/lib/components/DropdownMenu';
import SearchBar from '@/app/lib/components/SearchBar';
import useDebounce from '@/app/lib/hooks/useDebounce';
import useQueryString from '@/app/lib/hooks/useQueryString';
import { MemberRolesEnum } from '@/app/lib/enums';
import getEnumKeyByEnumValue from '@/app/lib/utils/getEnumKeyByEnumValue';
import ListBox from '@/app/lib/components/Listbox';
import transformIntoOptions from '@/app/lib/utils/transformIntoOptions';
import MemberForm from './MemberForm';

export default function MembersHeader() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedRole = searchParams.get('role')
    ? searchParams.get('role')
    : null;

  const [searchInputValue, setSearchInputValue] = useState(
    searchParams.get('search') ?? ''
  );

  const debouncedSearch = useDebounce(searchInputValue, 750);

  const { createQueryString } = useQueryString();

  useEffect(() => {
    router.push(pathname + '?' + createQueryString('search', debouncedSearch));
  }, [createQueryString, debouncedSearch, pathname, router]);

  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const pageOptions = [
    {
      label: 'Add Member',
      action: () => setShowAddMemberModal(true),
      icon: <IconUsergroupAdd height={20} width={20} />,
    },
  ];

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <PageHeader text='Members' />

          <DropdownMenu
            items={pageOptions}
            itemClasses='p-2'
            buttonIcon={(open) => (
              <IconOptionsOutline
                height={24}
                width={24}
                color={open ? 'white' : 'currentColor'}
              />
            )}
          />
        </div>

        <div className='flex items-center space-x-6'>
          <span className='-mr-2 text-sm font-medium italic'>Filters:</span>

          <ListBox
            value={selectedRole}
            onChange={(value) =>
              router.push(
                pathname + '?' + createQueryString('role', value?.toString())
              )
            }
            buttonText={
              selectedRole
                ? (getEnumKeyByEnumValue(
                    MemberRolesEnum,
                    selectedRole
                  ) as string)
                : 'All Roles'
            }
            options={[
              { label: 'All Roles', value: null },
              ...transformIntoOptions(
                Object.entries(MemberRolesEnum).map(([key, value]) => ({
                  label: key,
                  value: value,
                })),
                {
                  labelKey: 'label',
                  valueKey: 'value',
                }
              ),
            ]}
          />

          <SearchBar
            inputValue={searchInputValue}
            setInputValue={setSearchInputValue}
            placeholder='Search for a member...'
            searchIconSize={22}
            closeIconSize={20}
          />
        </div>
      </div>
      {showAddMemberModal ? (
        <MemberForm
          isOpen={showAddMemberModal}
          close={() => setShowAddMemberModal(false)}
        />
      ) : null}
    </>
  );
}
