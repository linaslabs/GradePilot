import React from 'react';
import type { AssignmentType } from '@/types';

interface AssignmentProp {
  assignment: AssignmentType;
}

export default function assignment({ assignment }: AssignmentProp) {
  return (
    <div className="mt-2 mr-1 flex items-center justify-between gap-2 rounded-sm pt-2 pr-5 pb-2 pl-5 text-white outline-4 outline-gray-600">
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center">
          <span className="text-[12px]">Weight</span>
          <span className="text-[20px]">{assignment.weightingPercent}%</span>
        </div>
        <h3 className="ml-2">{assignment.title}</h3>
        <div className="ml-2 rounded-sm p-1 text-red-400 outline-2 outline-red-500">
          {assignment.markPercent ? <p>Complete</p> : <p>Incomplete</p>}
        </div>
      </div>

      <div>
        {assignment.markPercent ? (
          <div className="flex items-center gap-3 text-green-400">
            <div className="flex flex-col items-center">
              <span className="text-[12px]">Mark</span>
              <span className="text-[20px]">{assignment.markPercent}%</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[12px]">Module Mark Contribution</span>
              <span className="text-[20px]">TO CALCULATE</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-red-400">
            <div className="flex flex-col items-center">
              <span className="text-[12px]">Mark</span>
              <span className="text-[20px]">N/A</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[12px]">Module Mark Contribution</span>
              <span className="text-[20px]">N/A</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
