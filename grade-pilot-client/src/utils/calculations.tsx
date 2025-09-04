import React from 'react';
import type { AssignmentType } from '@/types';
import { gradeFormatter } from './formatting';

interface FinalResponse {
  moduleOverallMark: number;
  classificationAchieved: string;
  reqAvgMarkTarget: number | null;
  reqAvgMarkPass: number | null;
  reqAvgMarkTwoTwo: number | null;
  reqAvgMarkTwoOne: number | null;
  reqAvgMarkFirst: number | null;
}

export function calculateModuleMark(assignments: AssignmentType[]): number {
  let totalModuleMark = 0;
  let totalCompletedAssignmentsWeight = 0;
  assignments.forEach((assignment) => {
    if (assignment.markPercent != null) {
      // This loose "!=" checks also for undefined
      totalCompletedAssignmentsWeight += assignment.weightingPercent;
      totalModuleMark +=
        assignment.markPercent * (assignment.weightingPercent / 100);
    }
  });

  if (totalCompletedAssignmentsWeight === 0) {
    return 0;
  }
  const currentMark = (totalModuleMark / totalCompletedAssignmentsWeight) * 100; // Only judging the score based on the weight of what assignments are complete

  return currentMark;
}

export function calculateModuleWeights(assignments: AssignmentType[]): number {
  let totalAssignmentsWeight = 0;
  assignments.forEach((assignment) => {
    totalAssignmentsWeight += assignment.weightingPercent;
  });

  return totalAssignmentsWeight;
}

function classifyMark(mark: number): string {
  if (mark < 40) {
    return 'Fail';
  } else if (mark < 50) {
    return 'Third Class (Pass)';
  } else if (mark < 60) {
    return 'Lower Second Class (2:2)';
  } else if (mark < 70) {
    return 'Upper Second Class (2:1)';
  } else {
    return 'First Class!';
  }
}

export function calculatePilotResponse(
  assignments: AssignmentType[],
  targetMark: number | null | undefined,
  incompleteAssignments: AssignmentType[],
): FinalResponse {
  // IF NO ASSIGNMENTS ADDED YET
  if (assignments.length === 0) {
    return {
      moduleOverallMark: 0,
      classificationAchieved: '',
      reqAvgMarkTarget: targetMark || 0, // Add the target if it exists, otherwise 0
      reqAvgMarkPass: 40,
      reqAvgMarkTwoTwo: 50,
      reqAvgMarkTwoOne: 60,
      reqAvgMarkFirst: 70,
    };
  }

  let moduleOverallMark = 0;

  let incompleteAssignmentsTotalWeightings = 0;
  incompleteAssignments.forEach((assignment) => {
    incompleteAssignmentsTotalWeightings += assignment.weightingPercent;
  });

  // Calculating currentModuleMark relative to 100%
  assignments.forEach((assignment) => {
    if (assignment.markPercent != null) {
      moduleOverallMark +=
        assignment.markPercent * (assignment.weightingPercent / 100);
    }
  });

  // CALCULATION LOGIC:
  // -------------------------------------

  // IF ALL ASSIGNMENTS COMPLETED
  if (incompleteAssignmentsTotalWeightings === 0) {
    return {
      // Infinity is "impossible to determine/the field is invalid"
      moduleOverallMark,
      classificationAchieved: classifyMark(moduleOverallMark),
      reqAvgMarkTarget:
        moduleOverallMark >= (targetMark || 0) ? null : Infinity, // If complete and target mark is "none" then return null, otherwise Infinity if not reached
      reqAvgMarkPass: Infinity,
      reqAvgMarkTwoTwo: Infinity,
      reqAvgMarkTwoOne: Infinity,
      reqAvgMarkFirst: Infinity,
    };
  }

  const calculateRequiredMarkForTarget = (
    currentMark: number,
    requiredTarget: number,
  ): number | null => {
    if (currentMark >= requiredTarget) {
      return null; // The target is already achieved
    }
    return gradeFormatter(
      ((requiredTarget - currentMark) / incompleteAssignmentsTotalWeightings) *
        100,
    );
  };

  const finalResponse: FinalResponse = {
    moduleOverallMark,
    classificationAchieved: classifyMark(moduleOverallMark),
    reqAvgMarkTarget:
      targetMark != null
        ? calculateRequiredMarkForTarget(moduleOverallMark, targetMark)
        : -1, // If target mark is "none" then the return value for this attribute will be -1 (null is achieved, Infinity is unreachable or failed to reach)
    reqAvgMarkPass: calculateRequiredMarkForTarget(moduleOverallMark, 40),
    reqAvgMarkTwoTwo: calculateRequiredMarkForTarget(moduleOverallMark, 50),
    reqAvgMarkTwoOne: calculateRequiredMarkForTarget(moduleOverallMark, 60),
    reqAvgMarkFirst: calculateRequiredMarkForTarget(moduleOverallMark, 70),
  };

  return finalResponse;
}
