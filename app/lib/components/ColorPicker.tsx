'use client';

import { useState } from 'react';
import { ChromePicker, SwatchesPicker } from 'react-color';
import { Popover } from '@headlessui/react';
import classNames from 'classnames';

type Props = {
  color: string;
  buttonClasses?: string;
  saveColor: (color: string) => void;
};

/**
 * @TODO move out from profile
 */

export default function ColorPicker({
  color,
  buttonClasses,
  saveColor,
}: Props) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  return (
    <div>
      {/* <SwatchesPicker onChange={() => null}></SwatchesPicker> */}

      <Popover className='relative shrink-0'>
        <Popover.Button
          type='button'
          className={classNames(
            buttonClasses,
            'flex h-10 items-center rounded border text-sm text-[#292D32] hover:brightness-75 '
          )}
          onClick={() => {
            setIsPickerOpen((prev) => !prev);
          }}
        >
          <span
            style={{ backgroundColor: color }}
            className='h-full w-full rounded'
          ></span>
        </Popover.Button>

        <Popover.Panel className='absolute bottom-14 left-0 z-10'>
          <SwatchesPicker
            //  styles={{default: }}
            color={color}
            onChange={(color) => saveColor(color.hex)}
          />
        </Popover.Panel>
      </Popover>
    </div>
  );
}
