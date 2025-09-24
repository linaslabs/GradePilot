import React from 'react';
import { useYearDetails } from '@/contexts/YearDetailsContext';
import { useModule } from '@/contexts/ModuleContext';
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
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  assignmentData: AssignmentType;
}

export default function AssignmentDropdown({
  isOpen,
  onOpenChange,
  assignmentData,
}: AssignmentDropdownProps) {
  const { openEditAssignmentModal, openDeleteAssignmentModal } =
    useYearDetails();
  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8">
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => openEditAssignmentModal(assignmentData)}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => openDeleteAssignmentModal(assignmentData)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
