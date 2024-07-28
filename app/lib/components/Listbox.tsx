'use client';

import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import classNames from 'classnames';

import { DownChevronIcon, Spinner } from '../SVGs';

type ListBoxValue = string | number | Array<string | number> | null;
type Option = { label: string; value: string | null };

type Props = {
  value: ListBoxValue;
  onChange: (value: ListBoxValue) => void;
  buttonText: string;
  options: Option[];
  buttonClasses?: string;
  optionContainerClasses?: string;
  optionClasees?: string;
  status?: 'success' | 'loading' | 'error';
};

export default function ListBox({
  value,
  onChange,
  buttonText,
  options,
  buttonClasses,
  optionContainerClasses,
  optionClasees,
  status = 'success',
}: Props) {
  return (
    <Listbox
      as={'div'}
      className={'relative w-full min-w-[200px]'}
      value={value}
      onChange={(val) => onChange(val)}
    >
      <Listbox.Button
        type='button'
        className={classNames(
          'flex w-full items-center justify-between space-x-2 whitespace-nowrap rounded bg-white p-2 text-sm font-medium shadow-sm',
          buttonClasses
        )}
      >
        <span>{buttonText}</span>
        {/* TODO: possibly pass in icon as optional prop and default to this */}
        <DownChevronIcon height={22} width={22} />
      </Listbox.Button>

      <Transition
        as={Fragment}
        leave='transition ease-in duration-100'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'
      >
        <Listbox.Options
          as='ul'
          className={classNames(
            'absolute z-10 mt-1 w-max min-w-full overflow-auto rounded-md border border-violet-100 bg-white text-sm font-medium shadow-sm',
            optionContainerClasses
          )}
        >
          {status === 'success' ? (
            <>
              {options.map((option) => {
                return (
                  <Listbox.Option
                    as='li'
                    key={option.value}
                    value={option.value}
                    className={classNames(
                      value === option.value ? 'bg-primary text-white' : '',
                      'flex cursor-pointer items-center space-x-2 px-2 py-2 hover:bg-secondary hover:text-white',
                      optionClasees
                    )}
                  >
                    {option.label}
                  </Listbox.Option>
                );
              })}
            </>
          ) : null}

          {status === 'loading' ? (
            <div className='flex items-center justify-center py-4'>
              <Spinner height={14} width={14} />
            </div>
          ) : null}
        </Listbox.Options>
      </Transition>
    </Listbox>
  );
}
