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
      <TooltipTrigger>
        <CircleHelp className="bg-muted h-4 w-4 rounded-md text-white opacity-50" />
      </TooltipTrigger>
      <TooltipContent>
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}
