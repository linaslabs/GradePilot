import React from 'react';
import type { AssignmentType, Module } from '@/types';
import { calculatePilotResponse } from '@/utils/calculations';
import { gradeFormatter } from '@/utils/formatting';
import PilotTip from './pilotTip';
import { Progress } from '@/components/ui/progress';
import { BowArrow } from 'lucide-react';

interface ModuleInfoProp {
  module: Module;
  assignments: AssignmentType[];
}

export default function ModuleInfo({ module, assignments }: ModuleInfoProp) {
  const assignmentCount = assignments.length;
  let assignmentsCompleted = 0;
  let totalAssignmentsWeight = 0;

  const incompleteAssignments: AssignmentType[] = [];

  assignments.forEach((assignment) => {
    if (
      assignment.markPercent !== null &&
      assignment.markPercent !== undefined
    ) {
      assignmentsCompleted++;
    } else {
      incompleteAssignments.push(assignment);
    }
    totalAssignmentsWeight += assignment.weightingPercent;
  });

  const isModuleComplete =
    assignmentCount > 0 && assignmentCount === assignmentsCompleted;

  const allAssignmentsComplete = () => {
    if (assignmentCount !== 0 && assignmentsCompleted / assignmentCount == 1) {
      return 'bg-green-600';
    } else {
      return 'bg-gray-600';
    }
  };

  const pilotResponseObject = calculatePilotResponse(
    assignments,
    module.targetMark,
    incompleteAssignments,
  );
  return (
    <>
      <div className="grid grid-cols-16 gap-2">
        <div className="col-span-2 flex flex-col items-center rounded-sm bg-gray-600 pt-2 pr-5 pb-2 pl-5 text-white">
          <span className="text-[12px]">Credits: </span>
          <span className="text-[15px]">{module.credits}</span>
        </div>
        <div
          className={`col-span-10 flex flex-col items-center rounded-sm ${allAssignmentsComplete()} pt-2 pr-5 pb-2 pl-5 text-white`}
        >
          <span className="text-[12px]">Assignments:</span>
          <span className="text-[15px]">
            {assignmentsCompleted}/{assignmentCount} Complete
          </span>
        </div>
        <div
          className={`col-span-4 mr-2 flex flex-col items-center rounded-sm ${pilotResponseObject.reqAvgMarkTarget === null ? 'bg-green-600' : 'bg-gray-600'} pt-2 pr-5 pb-2 pl-5 text-white`}
        >
          {/* <span className="text-[12px]">
            Year Weighting: {gradeFormatter((module.credits / 120) * 100)}%
          </span> */}
          <span className="flex items-center gap-1 text-[12px]">
            {' '}
            <BowArrow className="h-3 w-3" /> Target Mark:
          </span>
          <span className="text-[15px]">
            {module.targetMark != null ? <p>{module.targetMark}%</p> : 'None'}
          </span>
        </div>

        <div
          className={`col-span-12 flex gap-3 rounded-sm ${totalAssignmentsWeight === 100 && isModuleComplete ? 'bg-green-600' : 'bg-gray-600'} ${totalAssignmentsWeight !== 100 ? 'opacity-30' : 'opacity-100'} pt-2 pr-5 pb-2 pl-5 text-white transition-opacity duration-400`}
        >
          <img src="/pilot.png" alt="pilot" className="h-11 w-11" />
          <div className="flex-col items-start">
            <span className="text-[12px]">Pilot:</span>
            <div className="text-[17px]">
              {totalAssignmentsWeight !== 100 ? (
                <>
                  Add all the assignments (up to 100% weight) for this module
                  to enable pilot
                  <Progress
                    value={totalAssignmentsWeight}
                    className="h-1 flex-1 mt-1"
                  />
                </>
              ) : incompleteAssignments.length === 0 ? (
                <div>
                  <p>Module Complete!</p>
                  <p>
                    Your final grade is:{' '}
                    <span className="font-bold">
                      {pilotResponseObject.classificationAchieved}
                    </span>
                  </p>
                </div>
              ) : (
                <PilotTip
                  pilotResponseObject={pilotResponseObject}
                  moduleTargetMark={module.targetMark}
                />
              )}
            </div>
          </div>
        </div>
        <div
          // If requirement to reach target module mark is null, it is achieved, -1, it is achieved but it was never set, Infinity, it is not possible
          className={`col-span-4 mr-2 flex flex-col items-center justify-center rounded-sm ${pilotResponseObject.reqAvgMarkTarget === null ? 'bg-green-600' : pilotResponseObject.reqAvgMarkTarget === -1 ? 'bg-gray-600' : 'bg-red-600'} pt-2 pr-5 pb-2 pl-5 text-white`}
        >
          <span className="text-[14px]">
            {totalAssignmentsWeight === 100 && isModuleComplete
              ? 'Final Mark:'
              : 'Current Mark:'}
          </span>
          <span className="text-[22px]">
            {pilotResponseObject.moduleOverallMark != null ? (
              <p>{gradeFormatter(pilotResponseObject.moduleOverallMark)}%</p>
            ) : (
              'None'
            )}
          </span>
        </div>
      </div>
    </>
  );
}
