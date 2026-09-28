import { describe, it, expect } from 'vitest';
import {
  calculateModuleMark,
  calculateModuleWeights,
  calculatePilotResponse,
  calculateYearStats,
  classifyMark,
  determineModuleCompleteness,
  yearPilotReached,
} from './calculations';
import type { AssignmentType, Module } from '@/types';

describe('calculateModuleMark', () => {
  it('all assignments have marks and are processed correctly', () => {
    const testAssignments = [
      {
        markPercent: 50,
        weightingPercent: 50,
      },
      {
        markPercent: 30,
        weightingPercent: 25,
      },
      {
        markPercent: 80,
        weightingPercent: 25,
      },
    ] as AssignmentType[];

    const result = calculateModuleMark(testAssignments);
    const expected = 52.5;
    expect(result).toBe(expected);
  });

  it('some assignments have marks, some dont', () => {
    const testAssignments = [
      {
        markPercent: 50,
        weightingPercent: 50,
      },
      {
        markPercent: undefined,
        weightingPercent: 25,
      },
      {
        markPercent: 50,
        weightingPercent: 30,
      },
    ] as AssignmentType[];

    const result = calculateModuleMark(testAssignments);
    const expected = 50;
    expect(result).toBe(expected);
  });

  it('all assignments dont have marks', () => {
    const testAssignments = [
      {
        markPercent: undefined,
        weightingPercent: 25,
      },
      {
        markPercent: undefined,
        weightingPercent: 50,
      },
      {
        markPercent: undefined,
        weightingPercent: 25,
      },
    ] as AssignmentType[];

    const result = calculateModuleMark(testAssignments);
    const expected = 0;
    expect(result).toBe(expected);
  });

  it('assignments have marks on 0 or 100 boundaries', () => {
    const testAssignments = [
      {
        markPercent: 0,
        weightingPercent: 30,
      },
      {
        markPercent: 100,
        weightingPercent: 30,
      },
    ] as AssignmentType[];

    const result = calculateModuleMark(testAssignments);
    const expected = 50;
    expect(result).toBe(expected);
  });

  it('no assignments', () => {
    const result = calculateModuleMark([]);
    const expected = 0;
    expect(result).toBe(expected);
  });
});

describe('determineModuleCompleteness', () => {
  it('returns false when assignments array is empty', () => {
    const result = determineModuleCompleteness([]);
    expect(result).toBe(false);
  });

  it('returns false when some assignments do not have marks', () => {
    const testAssignments = [
      {
        markPercent: 75,
        weightingPercent: 50,
      },
      {
        markPercent: undefined,
        weightingPercent: 50,
      },
    ] as AssignmentType[];

    const result = determineModuleCompleteness(testAssignments);
    expect(result).toBe(false);
  });

  it('returns true when all assignments have marks', () => {
    const testAssignments = [
      {
        markPercent: 65,
        weightingPercent: 40,
      },
      {
        markPercent: 82,
        weightingPercent: 60,
      },
    ] as AssignmentType[];

    const result = determineModuleCompleteness(testAssignments);
    expect(result).toBe(true);
  });

  it('returns true when an assignment has a mark of 0', () => {
    const testAssignments = [
      {
        markPercent: 0,
        weightingPercent: 50,
      },
      {
        markPercent: 70,
        weightingPercent: 50,
      },
    ] as AssignmentType[];

    const result = determineModuleCompleteness(testAssignments);
    expect(result).toBe(true);
  });
});

describe('calculateModuleWeights', () => {
  it('returns 0 when assignments array is empty', () => {
    const result = calculateModuleWeights([]);
    expect(result).toBe(0);
  });

  it('correctly sums the weighting percentages of multiple assignments', () => {
    const testAssignments = [
      { weightingPercent: 40 },
      { weightingPercent: 30 },
      { weightingPercent: 30 },
    ] as AssignmentType[];

    const result = calculateModuleWeights(testAssignments);
    expect(result).toBe(100);
  });
});

describe('classifyMark', () => {
  it.each([
    { mark: 0, expected: 'Fail' },
    { mark: 39.9, expected: 'Fail' },
    { mark: 40, expected: 'Third Class (Pass)' },
    { mark: 49.9, expected: 'Third Class (Pass)' },
    { mark: 50, expected: 'Lower Second Class (2:2)' },
    { mark: 59.9, expected: 'Lower Second Class (2:2)' },
    { mark: 60, expected: 'Upper Second Class (2:1)' },
    { mark: 69.9, expected: 'Upper Second Class (2:1)' },
    { mark: 70, expected: 'First Class!' },
    { mark: 100, expected: 'First Class!' },
  ])('classifies a mark of $mark as "$expected"', ({ mark, expected }) => {
    expect(classifyMark(mark)).toBe(expected);
  });
});

describe('calculatePilotResponse', () => {
  // Technically testing "calculateOverallModuleMark" through "calculatePilotResponse" because it is a helper function and can be directly measured
  it('correctly calculates the overall module mark contribution across completed assignments', () => {
    const assignments = [
      { markPercent: 80, weightingPercent: 50 },
      { markPercent: 60, weightingPercent: 25 },
      { markPercent: undefined, weightingPercent: 25 },
    ] as AssignmentType[];

    const result = calculatePilotResponse(assignments, null, []);

    expect(result.moduleOverallMark).toBe(55);
  });

  it('returns default metrics when no assignments exist', () => {
    const result = calculatePilotResponse([], 75, []);

    expect(result).toEqual({
      moduleOverallMark: 0,
      classificationAchieved: '',
      reqAvgMarkTarget: 75,
      reqAvgMarkPass: 40,
      reqAvgMarkTwoTwo: 50,
      reqAvgMarkTwoOne: 60,
      reqAvgMarkFirst: 70,
    });
  });

  it('calculates required averages accurately for an in-progress module', () => {
    const completedAssignment = {
      markPercent: 60,
      weightingPercent: 50,
    } as AssignmentType;

    const incompleteAssignment = {
      markPercent: undefined,
      weightingPercent: 50,
    } as AssignmentType;

    const assignments = [completedAssignment, incompleteAssignment];
    const incompleteAssignments = [incompleteAssignment];

    const result = calculatePilotResponse(
      assignments,
      70,
      incompleteAssignments,
    );

    expect(result.moduleOverallMark).toBe(30);
    expect(result.classificationAchieved).toBe('Fail');

    expect(result.reqAvgMarkTarget).toBe(80);
    expect(result.reqAvgMarkPass).toBe(20);
    expect(result.reqAvgMarkFirst).toBe(80);
  });

  it('returns null for requirements that have already been secured', () => {
    const completedAssignment = {
      markPercent: 90,
      weightingPercent: 50,
    } as AssignmentType;

    const incompleteAssignment = {
      markPercent: undefined,
      weightingPercent: 50,
    } as AssignmentType;

    const assignments = [completedAssignment, incompleteAssignment];
    const incompleteAssignments = [incompleteAssignment];

    const result = calculatePilotResponse(
      assignments,
      40,
      incompleteAssignments,
    );

    expect(result.moduleOverallMark).toBe(45);
    expect(result.classificationAchieved).toBe('Third Class (Pass)');

    expect(result.reqAvgMarkTarget).toBeNull();
    expect(result.reqAvgMarkPass).toBeNull();

    expect(result.reqAvgMarkTwoTwo).toBe(10);
    expect(result.reqAvgMarkTwoOne).toBe(30);
    expect(result.reqAvgMarkFirst).toBe(50);
  });

  it('returns Infinity for milestone targets when all assignments are completed', () => {
    const assignments = [
      { markPercent: 70, weightingPercent: 50 },
      { markPercent: 60, weightingPercent: 50 },
    ] as AssignmentType[];

    const incompleteAssignments: AssignmentType[] = [];

    const result = calculatePilotResponse(
      assignments,
      75,
      incompleteAssignments,
    );

    expect(result.moduleOverallMark).toBe(65);
    expect(result.classificationAchieved).toBe('Upper Second Class (2:1)');

    expect(result.reqAvgMarkTarget).toBe(Infinity);
    expect(result.reqAvgMarkPass).toBe(Infinity);
    expect(result.reqAvgMarkTwoTwo).toBe(Infinity);
    expect(result.reqAvgMarkTwoOne).toBe(Infinity);
    expect(result.reqAvgMarkFirst).toBe(Infinity);
  });

  it('returns -1 for reqAvgMarkTarget when no target mark is specified', () => {
    const completedAssignment = {
      markPercent: 70,
      weightingPercent: 50,
    } as AssignmentType;

    const incompleteAssignment = {
      markPercent: undefined,
      weightingPercent: 50,
    } as AssignmentType;

    const assignments = [completedAssignment, incompleteAssignment];
    const incompleteAssignments = [incompleteAssignment];

    const result = calculatePilotResponse(
      assignments,
      null,
      incompleteAssignments,
    );

    expect(result.reqAvgMarkPass).toBe(10);
    expect(result.reqAvgMarkTarget).toBe(-1);
  });

  it('returns null for reqAvgMarkTarget when no assignments exist and targetMark is 0', () => {
    const result = calculatePilotResponse([], 0, []);

    expect(result.reqAvgMarkTarget).toBeNull();
    expect(result.moduleOverallMark).toBe(0);
  });

  it('returns 0 for reqAvgMarkTarget when no assignments exist and targetMark is null', () => {
    const resultNull = calculatePilotResponse([], null, []);
    expect(resultNull.reqAvgMarkTarget).toBe(0);
  });
});

describe('yearPilotReached', () => {
  it('isReached is true when modules add up to assigned credits', () => {
    const modules = [{ credits: 60 }, { credits: 60 }] as Module[];

    const result = yearPilotReached(modules, 120);
    expect(result.isReached).toBe(true);
    expect(result.totalModuleCredits).toBe(120);
  });

  it('isReached is false when module credits do not match assigned credits', () => {
    const modules = [{ credits: 30 }, { credits: 40 }] as Module[];

    const result = yearPilotReached(modules, 120);
    expect(result.isReached).toBe(false);
    expect(result.totalModuleCredits).toBe(70);
  });

  it('handles an empty module array without crashing', () => {
    const result = yearPilotReached([], 120);
    expect(result.isReached).toBe(false);
    expect(result.totalModuleCredits).toBe(0);
  });

  it('returns default metrics when assignedCredits is missing', () => {
    const modules = [{ credits: 60 }] as Module[];

    const result = yearPilotReached(modules, undefined);
    expect(result).toEqual({ isReached: false, totalModuleCredits: 0 });
  });

  it('returns default metrics when modules argument is undefined', () => {
    const result = yearPilotReached(undefined, 120);
    expect(result).toEqual({ isReached: false, totalModuleCredits: 0 });
  });
});

describe('calculateYearStats', () => {
  it('correctly calculates year statistics when all modules are completed', () => {
    const modules = [
      {
        credits: 60,
        assignments: [{ markPercent: 70, weightingPercent: 100 }],
      },
      {
        credits: 60,
        assignments: [{ markPercent: 80, weightingPercent: 100 }],
      },
    ] as Module[];

    const result = calculateYearStats(modules, 120);

    expect(result.lowestProjected).toBe(75);
    expect(result.projected).toBe(75);
    expect(result.highestProjected).toBe(75);
    expect(result.isYearCompleted).toBe(true);
  });

  it('correctly calculates lowest, projected, and highest marks for an in-progress year', () => {
    const modules = [
      {
        credits: 60,
        assignments: [{ markPercent: 70, weightingPercent: 100 }],
      },
      {
        credits: 60,
        targetMark: 80,
        assignments: [{ markPercent: null, weightingPercent: 100 }],
      },
    ] as Module[];

    const result = calculateYearStats(modules, 120);

    expect(result.lowestProjected).toBe(35);
    expect(result.projected).toBe(75);
    expect(result.highestProjected).toBe(85);
    expect(result.isYearCompleted).toBe(false);
  });

  it('falls back to 40% pass mark when an incomplete module has no targetMark set', () => {
    const modules = [
      {
        credits: 120,
        targetMark: undefined,
        assignments: [{ markPercent: null, weightingPercent: 100 }],
      },
    ] as Module[];

    const result = calculateYearStats(modules, 120);

    expect(result.lowestProjected).toBe(0);
    expect(result.projected).toBe(40);
    expect(result.highestProjected).toBe(100);
    expect(result.isYearCompleted).toBe(false);
  });

  it('treats a module as incomplete if assignment weights do not sum to 100%', () => {
    const modules = [
      {
        credits: 120,
        targetMark: 70,
        assignments: [{ markPercent: 80, weightingPercent: 50 }],
      },
    ] as Module[];

    const result = calculateYearStats(modules, 120);

    expect(result.isYearCompleted).toBe(false);
    expect(result.lowestProjected).toBe(0);
    expect(result.projected).toBe(70);
  });

  it('falls back to dividing by 1 when yearCredits is omitted', () => {
    const modules = [
      {
        credits: 60,
        assignments: [{ markPercent: 70, weightingPercent: 100 }],
      },
    ] as Module[];

    const result = calculateYearStats(modules);

    expect(result.lowestProjected).toBe(0);
    expect(result.projected).toBe(0);
    expect(result.highestProjected).toBe(0);
    expect(result.isYearCompleted).toBe(false);
  });
});
