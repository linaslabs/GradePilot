export interface Module {
  id: string;
  name: string;
  moduleCode?: string;
  targetMark?: number;
  credits: number;
  assignments: {
    id: string;
    title: string;
    markPercent?: number;
    weightingPercent: number;
  }[];
}

export interface AssignmentType {
  id: string;
  title: string;
  markPercent?: number;
  weightingPercent: number;
}

export interface Degree {
  id: string;
  title: string;
  studyLevel: string;
  degreeType: string;
  totalLengthYears: number;
  currentYear: number;
  targetDegreeClassification?: string;
  academicYears: AcademicYearData[];
}

export interface AcademicYearData {
  id: string;
  yearNumber: number;
  weightingPercent: number;
  targetClassification?: string;
  modules: Module[];
}
