import React from 'react';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Button } from './button';
import type { AssignmentType } from '@/types';

interface AssignmentDropdownProps {
  editAssignmentFunction: () => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  deleteAssignmentFunction: () => void;
}

export default function AssignmentDropdown({
  editAssignmentFunction,
  isOpen,
  onOpenChange,
  deleteAssignmentFunction,
}: AssignmentDropdownProps) {
  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8">
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={editAssignmentFunction}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={deleteAssignmentFunction}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
