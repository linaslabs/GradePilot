import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CircleHelp } from 'lucide-react';

export default function DialogToolTip({ content }: { content: string }) {
  return (
    <Tooltip>
      <TooltipTrigger className='opacity-50'>
        <CircleHelp className='h-4 w-4 bg-gray-600 rounded-md'/>
      </TooltipTrigger>
      <TooltipContent>
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}
