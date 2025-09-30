import React, { useState } from 'react';
import type { AssignmentType, Module } from '@/types';
import { Button } from './button';
import { Label } from './label';
import { Input } from './input';
import { Trash, Edit } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import DialogToolTip from './dialogToolTip';
import Assignment from './assignment';
import {
  calculateModuleMark,
  calculateModuleWeights,
  determineModuleCompleteness,
} from '@/utils/calculations';
import { gradeFormatter } from '@/utils/formatting';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import ModuleInfo from './module-info';
import { useAuth } from '@/hooks/useAuth';
import { useYearDetails } from '@/contexts/YearDetailsContext';
import { ModuleContext } from '@/contexts/ModuleContext';
interface ModuleProp {
  module: Module;
}

export default function ModuleAccordion({ module }: ModuleProp) {
  const { openAddAssignmentModal, openEditModuleModal, openDeleteModuleModal } =
    useYearDetails();

  const [openDropdownId, setOpenDropdownId] = useState('');
  const currentMarkRelative = calculateModuleMark(module.assignments);
  const isModuleComplete = determineModuleCompleteness(module.assignments);

  return (
    <ModuleContext.Provider value={module}>
      <section className="flex w-full gap-2">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value={`item-${module.id}`}>
            <AccordionTrigger className="bg-sidebar-primary-foreground text-background mb-2 ml-1 flex items-center pr-5 pl-5 transition-all duration-200 ease-in-out hover:no-underline">
              <h3 className="flex-1 text-left">
                {module.moduleCode} {module.name}
              </h3>
              <div className="flex gap-2">
                <div
                  className={`flex flex-col items-center rounded-xl ${isModuleComplete ? (gradeFormatter(currentMarkRelative) < 40 ? 'bg-red-600' : 'bg-green-400') : 'bg-gray-600'} p-2 text-white`}
                >
                  <p>{gradeFormatter(currentMarkRelative)}%</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-5">
              <div className="mb-2 flex flex-col gap-2">
                <ModuleInfo module={module} assignments={module.assignments} />
                {module.assignments.map((assignment) => (
                  <Assignment
                    key={assignment.id}
                    assignment={assignment}
                    isOpen={openDropdownId === assignment.id}
                    onOpenChange={(isOpen) => {
                      setOpenDropdownId(isOpen ? assignment.id : '');
                    }}
                  />
                ))}
              </div>

              <Button
                className="mb-2 ml-1 flex flex-col items-center justify-center rounded-sm bg-gray-700 font-light text-gray-300 transition-all duration-300 ease-in-out hover:bg-white hover:text-gray-600"
                onClick={() => openAddAssignmentModal(module)}
              >
                + Add new assignment
              </Button>
              <div className="flex gap-1">
                <Button
                  className="mb-4 ml-1 flex flex-col items-center justify-center rounded-sm bg-gray-700 font-light text-gray-300 transition-all duration-300 ease-in-out hover:bg-white hover:text-gray-600"
                  onClick={() => openEditModuleModal(module)} // This function just opens the editing modal, and passes back up the module currently being worked on
                >
                  <div className="flex items-center gap-2">
                    <Edit />
                    Edit Module
                  </div>
                </Button>

                <Button
                  className="mb-4 ml-1 flex flex-col items-center justify-center rounded-sm bg-gray-700 font-light text-gray-300 transition-all duration-300 ease-in-out hover:bg-red-600"
                  onClick={() => openDeleteModuleModal(module)}
                >
                  <div className="flex items-center gap-1.5">
                    <Trash />
                    Delete Module
                  </div>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </ModuleContext.Provider>
  );
}
