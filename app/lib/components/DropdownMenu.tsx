'use client';

import { Fragment, ReactNode } from 'react';
import { Menu, Transition } from '@headlessui/react';
import classNames from 'classnames';

import { IconEllipsisV, IconOptionsOutline } from '@/app/lib/SVGs';

type Props = {
  items: {
    icon?: ReactNode;
    label: string;
    action: () => void;
    disabled?: boolean;
  }[];
  buttonClasses?: string;
  itemContainerClasses?: string;
  itemClasses?: string;
  buttonIcon?: (open: boolean) => ReactNode;
};

export default function DropdownMenu({
  items,
  buttonClasses,
  itemContainerClasses,
  itemClasses,
  buttonIcon,
}: Props) {
  return (
    <Menu as={'div'} className={'relative'}>
      {({ open }) => (
        <>
          <Menu.Button
            type='button'
            className={classNames(
              open ? 'bg-primary' : 'bg-white',
              'rounded border fill-red-500 p-2 transition-colors duration-100 ease-out hover:border-primary hover:bg-primary hover:text-white',
              buttonClasses
            )}
          >
            {buttonIcon ? (
              buttonIcon(open)
            ) : (
              <IconEllipsisV
                height={24}
                width={24}
                color={open ? 'white' : 'currentColor'}
              />
            )}
          </Menu.Button>
          <Transition
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-100'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-100'
          >
            <Menu.Items
              className={classNames(
                'absolute left-0 z-10 mt-2 w-[225px] divide-y divide-gray-100 overflow-hidden rounded bg-white p-0 text-start text-sm font-medium shadow-lg',
                itemContainerClasses
              )}
            >
              {items.map((item) => {
                return (
                  <Menu.Item
                    disabled={item.disabled}
                    key={item.label}
                    as={'button'}
                    type='button'
                    onClick={item.action}
                    className={classNames(
                      'flex w-full items-center space-x-2 hover:bg-gray-50',
                      itemClasses
                    )}
                  >
                    {item.icon ? <span>{item.icon}</span> : null}

                    <span>{item.label}</span>
                  </Menu.Item>
                );
              })}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}
