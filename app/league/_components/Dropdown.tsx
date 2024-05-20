'use client';

import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import classNames from 'classnames';

type Option = {
  id: string;
  name: string;
};

type Props = {
  options: Option[];
  selectAllOption?: any;
  placeholder?: string;
  defaultOption?: Option;
  containerClasses?: string;
  optionClasses?: string;
};

export default function Dropdown({
  options,
  placeholder,
  defaultOption,
  selectAllOption,
  containerClasses,
  optionClasses,
}: Props) {
  const [selected, setSelected] = useState<Option | null>(
    defaultOption ?? null
  );

  // TODO: take in the action of setting the filter to the team {team: "342341"} // 342341 === id of team

  return (
    <Listbox
      value={selected}
      onChange={setSelected}
      as={'div'}
      className={'relative h-full rounded-lg border font-medium'}
    >
      <Listbox.Button
        className={
          'flex h-full w-[250px] items-center justify-between truncate px-4 text-start'
        }
      >
        <span className='w-[150px] truncate'>
          {selected ? selected.name : <>{placeholder}</>}
        </span>
        <span className='flex h-full items-center justify-center border-l pl-3'>
          <IconCaretDown height={24} width={24} />
        </span>
      </Listbox.Button>

      <Transition
        as={Fragment}
        leave='transition ease-in duration-100'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'
      >
        <Listbox.Options
          className={
            'absolute top-0 z-10 mt-[57px] w-full overflow-auto rounded bg-white font-medium shadow'
          }
        >
          {selectAllOption ? (
            <Listbox.Option
              value={null}
              className={classNames(
                !selected ? '!bg-primary text-white' : '',
                'cursor-pointer truncate px-4 py-3 transition-all duration-75 hover:bg-secondary hover:text-white'
              )}
            >
              {selectAllOption.name}
            </Listbox.Option>
          ) : null}

          {options.map((option) => (
            <Listbox.Option
              value={option}
              key={option.id}
              className={classNames(
                selected && selected.id === option.id
                  ? '!bg-primary text-white'
                  : '',
                'cursor-pointer truncate px-4 py-3 transition-all duration-75 hover:bg-secondary hover:text-white'
              )}
            >
              {' '}
              {option.name}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Transition>
    </Listbox>
  );
}

function IconCaretDown(
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) {
  return (
    <svg fill='none' viewBox='0 0 15 15' height='1em' width='1em' {...props}>
      <path
        fill='currentColor'
        fillRule='evenodd'
        d='M4.182 6.182a.45.45 0 01.636 0L7.5 8.864l2.682-2.682a.45.45 0 01.636.636l-3 3a.45.45 0 01-.636 0l-3-3a.45.45 0 010-.636z'
        clipRule='evenodd'
      />
    </svg>
  );
}
