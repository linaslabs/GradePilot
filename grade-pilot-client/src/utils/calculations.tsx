import React from 'react';
import type { AssignmentType, Module } from '@/types';
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

export function determineModuleCompleteness(
  assignments: AssignmentType[],
): boolean {
  if (assignments.length === 0) {
    return false;
  }

  let complete = true;

  assignments.forEach((assignment) => {
    if (!assignment.markPercent) {
      complete = false;
      return complete;
    }
  });

  return complete;
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

function calculateOverallModuleMark(assignments: AssignmentType[]) {
  let moduleOverallMark = 0;

  assignments.forEach((assignment) => {
    if (assignment.markPercent != null) {
      moduleOverallMark +=
        assignment.markPercent * (assignment.weightingPercent / 100);
    }
  });

  return moduleOverallMark;
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
      reqAvgMarkTarget:
        targetMark != null ? (targetMark === 0 ? null : targetMark) : 0, // Add the target if it exists, if its 0, then return null (automatically reached), otherwise 0
      reqAvgMarkPass: 40,
      reqAvgMarkTwoTwo: 50,
      reqAvgMarkTwoOne: 60,
      reqAvgMarkFirst: 70,
    };
  }

  let incompleteAssignmentsTotalWeightings = 0;
  incompleteAssignments.forEach((assignment) => {
    incompleteAssignmentsTotalWeightings += assignment.weightingPercent;
  });

  // Calculating currentModuleMark relative to 100%
  const moduleOverallMark = calculateOverallModuleMark(assignments);

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

export function yearPilotReached(modules?: Module[], totalCredits?: number) {
  if (totalCredits == null || !modules)
    return { isReached: false, totalModuleCredits: 0 };

  let totalModuleCredits = 0;
  modules.forEach((module) => {
    totalModuleCredits += module.credits;
  });

  if (totalCredits === totalModuleCredits) {
    return { isReached: true, totalModuleCredits: totalModuleCredits };
  }

  return { isReached: false, totalModuleCredits: totalModuleCredits };
}

export function calculateYearStats(modules: Module[], yearCredits?: number) {
  let lowestProjected = 0;
  let projected = 0;
  let highestProjected = 0;
  let moduleCompleteCount = 0;

  modules.forEach((module) => {
    let moduleIsComplete = true;
    let moduleOverallMark = 0;
    let assignmentsTotalWeight = 0;

    for (const assignment of module.assignments) {
      // Using for loop instead of foreach because I want to break if module is incomplete
      assignmentsTotalWeight += assignment.weightingPercent;
      if (assignment.markPercent == null) {
        moduleIsComplete = false;
        break;
      } else {
        moduleOverallMark +=
          assignment.markPercent * (assignment.weightingPercent / 100);
      }
    }

    // If assignments arent fully completed anyway, then the module is incomplete this way too
    if (assignmentsTotalWeight !== 100) {
      moduleIsComplete = false;
    }

    const moduleMarkWeighting = module.credits / (yearCredits ?? 1);

    if (moduleIsComplete) {
      moduleCompleteCount++;
      const securedMark = moduleOverallMark * moduleMarkWeighting;
      projected += securedMark;
      lowestProjected += securedMark;
      highestProjected += securedMark;
    } else {
      projected += (module.targetMark ?? 40) * moduleMarkWeighting; // If module target mark doesn't exist, assume pass
      highestProjected += 100 * moduleMarkWeighting;
      // Worst case is the rest of the modules score 0
    }
  });

  // If year is completed, return the object with isYearCompleted as true
  if (moduleCompleteCount === modules.length) {
    return {
      highestProjected: gradeFormatter(highestProjected),
      lowestProjected: gradeFormatter(lowestProjected),
      projected: gradeFormatter(projected),
      isYearCompleted: true,
    };
  }
  return {
    highestProjected: gradeFormatter(highestProjected),
    lowestProjected: gradeFormatter(lowestProjected),
    projected: gradeFormatter(projected),
    isYearCompleted: false,
  };
}
