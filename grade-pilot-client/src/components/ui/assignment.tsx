import React from 'react';
import type { AssignmentType } from '@/types';
import AssignmentDropdown from './assignment-dropdown';
import { gradeFormatter } from '@/utils/formatting';

interface AssignmentProp {
  assignment: AssignmentType;
  editAssignmentFunction: () => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  deleteAssignmentFunction: () => void;
}

export default function assignment({
  assignment,
  editAssignmentFunction,
  isOpen,
  onOpenChange,
  deleteAssignmentFunction,
}: AssignmentProp) {
  return (
    <div className="mt-2 mr-1 mb-2 flex items-center justify-between gap-2 rounded-sm pt-2 pr-5 pb-2 pl-5 text-white outline-4 outline-gray-600">
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center">
          <span className="text-[12px]">Weight</span>
          <span className="text-[20px]">{assignment.weightingPercent}%</span>
        </div>
        <h3 className="ml-2">{assignment.title}</h3>
        {assignment.markPercent !== null &&
        assignment.markPercent !== undefined ? (
          <div className="ml-2 rounded-sm p-1 text-green-400 outline-2 outline-green-500">
            <p>Complete</p>
          </div>
        ) : (
          <div className="ml-2 rounded-sm p-1 text-red-400 outline-2 outline-red-500">
            <p>Incomplete</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {assignment.markPercent !== null &&
        assignment.markPercent !== undefined ? (
          <div className="flex items-center gap-3 text-green-400">
            <div className="flex flex-col items-center">
              <span className="text-[12px]">Final Mark Contribution</span>
              <span className="text-[20px]">
                {gradeFormatter(
                  assignment.markPercent * (assignment.weightingPercent / 100),
                )}
                %
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[12px]">Mark</span>
              <span className="text-[20px]">{assignment.markPercent}%</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-red-400">
            <div className="flex flex-col items-center">
              <span className="text-[12px]">Final Mark Contribution</span>
              <span className="text-[20px]">N/A</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[12px]">Mark</span>
              <span className="text-[20px]">N/A</span>
            </div>
          </div>
        )}
        <AssignmentDropdown
          editAssignmentFunction={editAssignmentFunction}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          deleteAssignmentFunction={deleteAssignmentFunction}
        />
      </div>
    </div>
  );
}
