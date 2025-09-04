import React from 'react';

// Need to add more modularity like following:
export function gradeFormatter(grade: number) {
  return Number(grade.toFixed(1));
}
