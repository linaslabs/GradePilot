import React, { createContext, useContext } from 'react';
import type { Module } from '@/types';

export const ModuleContext = createContext<Module | undefined>(undefined);

export function useModule() {
  const context = useContext(ModuleContext);

  if (!context) {
    throw new Error('useYearDetails must be used within a YearDetailsProvider');
  }
  return context;
}
