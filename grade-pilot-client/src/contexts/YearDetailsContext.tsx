import { useContext, createContext } from 'react';
import type {
  AcademicYearData,
  Module,
  AssignmentType,
  YearSettings,
} from '@/types';

interface YearDetailsContextType {
  yearInfo: AcademicYearData | null;
  openAddModuleModal: () => void;
  addModule: (newModule: Module) => void;
  openEditModuleModal: (module: Module) => void;
  updateModule: (updatedModule: Module) => void;
  openDeleteModuleModal: (module: Module) => void;
  deleteModule: (moduleId: string) => void;
  openAddAssignmentModal: (module: Module) => void;
  addAssignment: (moduleId: string, newAssignment: AssignmentType) => void;
  openEditAssignmentModal: (assignment: AssignmentType) => void;
  updateAssignment: (updatedAssignment: AssignmentType) => void;
  openDeleteAssignmentModal: (assignment: AssignmentType) => void;
  deleteAssignment: (assignmentId: string) => void;
  updateYear: (updatedYearSettings: YearSettings) => void;
  openYearSettingsModal: () => void;
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
