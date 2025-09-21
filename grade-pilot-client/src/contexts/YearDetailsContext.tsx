import React, { useContext, createContext } from 'react';
import type { AcademicYearData, Module, AssignmentType } from '@/types';

interface YearDetailsContextType {
  yearInfo: AcademicYearData | null;
  isLoading: boolean;
  error: string | null;
  addModule: () => void;
  updateModule: (updatedModule: Module) => void;
  deleteModule: (moduleId: string) => void;
  addAssignment: (moduleId: string, newAssignment: AssignmentType) => void;
  updateAssignment: (updatedAssignment: AssignmentType) => void;
  deleteAssignment: (assignmentId: string) => void;
}

export const YearDetailsContext = createContext<
  YearDetailsContextType | undefined
>(undefined);

export function useYearDetails() {
  const context = useContext(YearDetailsContext);
  if (!context) {
    throw new Error('useYearDetails must be used within a YearDetailsProvider'); // Can only be undefined if someone tries accessing the context without being wrapped in a provider
  }
  return context;
}
