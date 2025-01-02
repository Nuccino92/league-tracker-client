import classNames from 'classnames';

import { Button } from '@/app/lib/components/Button';
import {
  IconReturnDownBackSharp,
  IconReturnDownForwardSharp,
} from '@/app/lib/SVGs';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (type: 'next' | 'prev' | 'number', page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const getPaginationRange = (currentPage: number, totalPages: number) => {
    const delta = 2;
    const range = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift('...');
    }
    if (currentPage + delta < totalPages - 1) {
      range.push('...');
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  return (
    <nav className='flex items-center justify-center gap-3'>
      {/* Previous */}
      <Button
        variant={'outline'}
        onClick={() => onPageChange('prev', currentPage)}
        disabled={currentPage === 1}
        className={classNames(
          'flex items-center justify-center gap-2 rounded-md transition-colors',
          currentPage === 1
            ? 'cursor-not-allowed text-gray-300'
            : 'text-gray-600 hover:bg-gray-100'
        )}
      >
        <IconReturnDownBackSharp /> <span>Previous</span>
      </Button>

      {/* Pages */}
      <div className='flex items-center gap-1'>
        {getPaginationRange(currentPage, totalPages).map((page, idx) => {
          if (page === '...') {
            return (
              <span
                key={`${page}-${idx}`}
                className='flex h-8 w-8 items-center justify-center text-sm text-gray-400'
              >
                ⋯
              </span>
            );
          }

          const isCurrentPage = currentPage === page;

          return (
            <button
              key={page}
              onClick={() => onPageChange('number', page as number)}
              className={classNames(
                'flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors',
                isCurrentPage
                  ? 'bg-primary font-medium text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next */}
      <Button
        variant={'outline'}
        onClick={() => onPageChange('next', currentPage)}
        disabled={currentPage === totalPages}
        className={classNames(
          'flex items-center justify-center gap-2 rounded-md transition-colors',
          currentPage === totalPages
            ? 'cursor-not-allowed text-gray-300'
            : 'text-gray-600 hover:bg-gray-100'
        )}
      >
        <span>Next</span> <IconReturnDownForwardSharp />
      </Button>
    </nav>
  );
}
