import { SetStateAction } from 'react';

import {
  IconClose,
  IconEllipsisVertical,
  IconPlus,
  IconSearch,
  downChevronIcon,
} from '@/app/lib/SVGs';
import classNames from 'classnames';

type Props = {
  inputValue: string;
  setInputValue: (value: SetStateAction<string>) => void;
  containerClasses?: string;
  placeholder?: string;
  searchIconSize?: number;
  closeIconSize?: number;
};

export default function SearchBar({
  inputValue,
  setInputValue,
  containerClasses,
  placeholder,
  searchIconSize = 16,
  closeIconSize = 16,
}: Props) {
  return (
    <div className='relative flex w-max items-center'>
      <IconSearch
        height={searchIconSize}
        width={searchIconSize}
        // TODO: get the secondary-color from a variable
        color={inputValue ? '#03C988' : 'gray'}
        className='absolute left-1 z-10'
      />
      <input
        type='text'
        placeholder={placeholder ? placeholder : 'Search...'}
        className={classNames(
          containerClasses,
          'relative flex items-center justify-center space-x-2 rounded border bg-white p-2 px-8 text-sm focus:outline-none focus:ring-2 focus:ring-secondary'
        )}
        // className='focus:outline-none'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <div className='absolute right-0 flex w-10 items-center px-2'>
        {inputValue ? (
          <button
            type='button'
            className='px-2 transition-colors duration-100 hover:text-gray-500'
            onClick={() => setInputValue('')}
          >
            <IconClose height={closeIconSize} width={closeIconSize} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
