'use client';

import { ReactNode } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/lib/components/Tooltip';

import { ToolTipIcon } from '@/app/lib/SVGs';

export default function ControlPanelTooltip({
  content,
  classes,
}: {
  content: ReactNode;
  classes?: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger
          onClick={(e) => e.preventDefault()}
          className='transition-all duration-75 hover:text-yellow-300'
        >
          <ToolTipIcon width={22} height={22} />
        </TooltipTrigger>
        <TooltipContent className={classes}>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
