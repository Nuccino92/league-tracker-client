'use client';

import * as React from 'react';

import { DayPicker } from 'react-day-picker';

import cn from 'classnames';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        selected: 'bg-secondary hover:bg-secondary/75 text-white',
        today: 'bg-primary text-white hover:bg-primary',
        month: 'space-y-4',
        caption_label: 'text-zinc-600 font-medium pl-1 text-sm',
        nav: 'space-x-1 flex items-center absolute right-0 pr-3 scale-[0.9] opacity-[0.5]',
        weekday:
          'text-muted-foreground font-light text-[0.8rem] text-center h-10',
        row: 'flex w-full mt-2 ',
        cell: '!hidden',
        day_button: 'w-full h-full',
        day: 'text-center items-center justify-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 cursor-pointer',
        day_range_end: 'day-range-end',
        day_selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: 'bg-accent text-accent-foreground',
        day_outside:
          'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
