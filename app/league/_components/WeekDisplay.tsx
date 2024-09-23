'use client';

import React, { Dispatch, MutableRefObject, useEffect, useState } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { IconCaretLeft, IconCaretRight } from '@/app/lib/SVGs';

function WeekDisplay() {
  const [controlledDate, setControlledDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  // Function to toggle the calendar visibility
  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const getCurrentWeekRange = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    const endOfWeek = new Date(date);
    endOfWeek.setDate(date.getDate() + (6 - date.getDay()));
    return [startOfWeek, endOfWeek];
  };

  // TODO: send to the backend for db query (its start and end date of week)
  const [startOfWeek, endOfWeek] = getCurrentWeekRange(controlledDate);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const goToPreviousWeek = () => {
    const previousWeek = new Date(controlledDate);
    previousWeek.setDate(previousWeek.getDate() - 7);

    setControlledDate(previousWeek);
  };

  const goToNextWeek = () => {
    const nextWeek = new Date(controlledDate);
    nextWeek.setDate(nextWeek.getDate() + 7);

    setControlledDate(nextWeek);
  };

  useEffect(() => {
    // everytime there are updated, we need to fetch new data
    // need to check if both start and end are not the same day
    console.log(startOfWeek, endOfWeek);
  }, [startOfWeek, endOfWeek]);

  return (
    <Popover
      as='div'
      className='relative flex h-full items-center justify-center rounded-lg border'
    >
      <button
        onClick={goToPreviousWeek}
        className='h-full rounded-l border-r px-3 py-3 transition-all duration-75 hover:bg-primary hover:text-white'
      >
        <IconCaretLeft width={24} height={24} />
      </button>

      <Popover.Button
        onClick={toggleCalendar}
        className='flex !h-full w-[175px] items-center justify-center space-x-3 px-3 py-3 transition-all duration-75 hover:bg-primary hover:text-white'
      >
        <span className='whitespace-nowrap font-medium'>
          {formatDate(startOfWeek)}
        </span>
        <span>-</span>
        <span className='whitespace-nowrap font-medium'>
          {formatDate(endOfWeek)}
        </span>
      </Popover.Button>

      <button
        onClick={goToNextWeek}
        className='h-full rounded-r border-l px-3 py-3 transition-all  duration-75 hover:bg-primary hover:text-white'
      >
        <IconCaretRight width={24} height={24} />
      </button>

      <Popover.Panel>
        {({ close }) => (
          <Calendar
            close={close}
            date={controlledDate}
            setDate={setControlledDate}
            setShowCalendar={setShowCalendar}
          />
        )}
      </Popover.Panel>
    </Popover>
  );
}

export default WeekDisplay;

function Calendar({
  date,
  setDate,
  setShowCalendar,
  close,
}: {
  date: Date;
  setDate: Dispatch<React.SetStateAction<Date>>;
  setShowCalendar: Dispatch<React.SetStateAction<boolean>>;
  close?: (
    focusableElement?:
      | HTMLElement
      | MutableRefObject<HTMLElement | null>
      | undefined
  ) => void;
}) {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const [calendarDate, setCalendarDate] = useState(date);

  const getDaysOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1);
    const startingDay = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    // Fill the days before the start of the month with null
    for (let i = 0; i < startingDay; i++) {
      days.unshift(null);
    }
    return days;
  };

  const daysOfMonth = getDaysOfMonth(calendarDate);

  const selectDay = (day: Date) => {
    if (day) {
      setDate(day);
      setCalendarDate(day);
      setShowCalendar(false);
    }
    if (close) {
      close();
    }
  };

  const goToPreviousMonth = () => {
    const previousMonth = new Date(calendarDate);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    setCalendarDate(previousMonth);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(calendarDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCalendarDate(nextMonth);
  };

  return (
    <div className='absolute left-0 top-[3.2rem] z-10 mt-1 w-max rounded-lg border bg-white shadow'>
      <div className='mb-2 flex items-center justify-between border-b px-2 py-3'>
        <button onClick={goToPreviousMonth}>
          <IconCaretLeft height={24} width={24} />
        </button>
        <h2 className='text-lg font-semibold'>
          {calendarDate.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </h2>
        <button onClick={goToNextMonth}>
          <IconCaretRight height={24} width={24} />
        </button>
      </div>
      <div className='grid grid-cols-7 gap-1'>
        {daysOfWeek.map((day) => (
          <div key={day} className='p-2 text-center font-bold text-gray-700'>
            {day}
          </div>
        ))}
        {daysOfMonth.map((day, index) => (
          <div
            key={index}
            className={`${isSameDay(day as Date) ? '!bg-primary !text-white' : ''} p-2 text-center ${day ? 'cursor-pointer hover:bg-gray-200' : 'text-gray-300'}`}
            onClick={() => day && selectDay(day)}
          >
            {day && day.getDate()}
          </div>
        ))}
      </div>
      <div className='my-2 flex w-full items-center justify-center px-2'>
        <button
          onClick={() => selectDay(new Date())}
          className='w-full rounded-lg bg-primary py-2 font-medium text-white transition-all duration-150 hover:text-secondary'
        >
          TODAY
        </button>
      </div>
    </div>
  );
}

const isSameDay = (date: Date, optionalDate?: Date) => {
  if (!date) return false;

  const date2 = optionalDate ?? new Date();

  return (
    date.getFullYear() === date2.getFullYear() &&
    date.getMonth() === date2.getMonth() &&
    date.getDate() === date2.getDate()
  );
};
