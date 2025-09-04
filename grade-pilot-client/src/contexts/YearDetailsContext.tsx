import React, { useContext, createContext } from 'react';
import type { AcademicYearData, Module, AssignmentType } from '@/types';

interface YearDetailsContextType {
  // yearInfo: AcademicYearData | null;
  editAssignmentFunction: (updatedAssignment: AssignmentType) => void;
}

const YearDetailsContext = createContext<YearDetailsContextType | undefined>(undefined);

export function useYearDetails() {
  const context = useContext(YearDetailsContext);
  if (!context) {
    throw new Error('useYearDetails must be used within a YearDetailsProvider');
  }
  return context;
}
