import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CircleHelp } from 'lucide-react';

interface toolTipProps {
  content: string;
  content2?: string;
  content3?: string;
  content4?: string;
}

export default function DialogToolTip({
  content,
  content2,
  content3,
  content4,
}: toolTipProps) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <CircleHelp className="bg-muted h-4 w-4 rounded-md text-white opacity-50 hover:opacity-100" />
      </TooltipTrigger>
      <TooltipContent>
        <p>{content}</p>
        <p>{content2}</p>
        <p>{content3}</p>
        <p>{content4}</p>
      </TooltipContent>
    </Tooltip>
  );
}
