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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import ModuleInfo from './module-info';
import { useAuth } from '@/hooks/useAuth';
interface ModuleProp {
  module: Module;
  assignmentAddFunction: (
    moduleId: string,
    newAssignment: AssignmentType,
  ) => void;
  moduleDeleteFunction: (moduleId: string) => void;
  editModuleFunction: () => void;
  editAssignmentFunction: (
    updatedAssignment: AssignmentType,
    currentModule: Module,
  ) => void;
  deleteAssignmentFunction: (assignment: AssignmentType) => void;
}
interface formData {
  title: string;
  weightingPercent: number;
  markPercent?: number;
  moduleId: string;
}

export default function ModuleAccordion({
  module,
  assignmentAddFunction,
  moduleDeleteFunction,
  editModuleFunction,
  editAssignmentFunction,
  deleteAssignmentFunction,
}: ModuleProp) {
  const { token } = useAuth();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentWeight, setAssignmentWeight] = useState('');
  const [assignmentMark, setAssignmentMark] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const [formError, setFormError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [invalidWeightError, setInvalidWeightError] = useState('');
  const [isAddAssigmentModalOpen, setIsAddAssigmentModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [openDropdownId, setOpenDropdownId] = useState('');

  const currentMarkRelative = calculateModuleMark(module.assignments);

  const totalCurrentModuleWeight = calculateModuleWeights(module.assignments);

  const isModuleComplete = determineModuleCompleteness(module.assignments);

  const submitNewAssignment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    if (!assignmentTitle || !assignmentWeight) {
      // Could instead throw error and handle in error handler? need to check if modal is open and type "error"
      setFormError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    if (totalCurrentModuleWeight + Number(assignmentWeight) > 100) {
      setInvalidWeightError(
        `Total weight of assignments cannot exceed 100%. Current total: ${totalCurrentModuleWeight}%`,
      );
      setIsSubmitting(false);
      return;
    }

    const formData: formData = {
      title: assignmentTitle,
      weightingPercent: Number(assignmentWeight),
      moduleId: module.id,
    };

    if (assignmentMark) {
      formData.markPercent = Number(assignmentMark);
    }

    try {
      const response = await fetch(`${apiUrl}/assignment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.customMessage ||
            'An unexpected error occured... Try again later',
        );
      }

      assignmentAddFunction(module.id, data.assignment);

      setIsAddAssigmentModalOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError('An unexpected error occurred... Try again later');
      }
    } finally {
      setIsSubmitting(false);
      AddAssigmentModalOpenChangeHandler(false);
    }
  };

  const deleteModule = async () => {
    setIsSubmitting(true);
    try {
      await fetch(`${apiUrl}/module/${module.id}`, {
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      moduleDeleteFunction(module.id);
    } catch (error) {
      if (error instanceof Error) {
        setDeleteError(error.message);
      } else {
        setDeleteError('This module could not be deleted... Try again later');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const AddAssigmentModalOpenChangeHandler = (isOpen: boolean) => {
    setIsAddAssigmentModalOpen(isOpen);

    if (!isOpen) {
      setAssignmentTitle('');
      setAssignmentWeight('');
      setAssignmentMark('');
      setIsComplete(false);
      setFormError('');
      setInvalidWeightError('');
    }
  };

  return (
    <section className="flex w-full gap-2">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={`item-${module.id}`}>
          <AccordionTrigger className="bg-sidebar-primary-foreground text-background mb-2 ml-1 flex items-center pr-5 pl-5 transition-all duration-200 ease-in-out hover:no-underline">
            <h3 className="flex-1 text-left">
              {module.moduleCode} {module.name}
            </h3>
            <div className="flex gap-2">
              <div
                className={`flex flex-col items-center rounded-xl ${isModuleComplete ? 'bg-green-600' : 'bg-gray-500'} p-2 text-white`}
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
                  editAssignmentFunction={() => {
                    setOpenDropdownId('');
                    editAssignmentFunction(assignment, module);
                  }}
                  isOpen={openDropdownId === assignment.id}
                  onOpenChange={(isOpen) => {
                    setOpenDropdownId(isOpen ? assignment.id : '');
                  }}
                  deleteAssignmentFunction={() => {
                    setOpenDropdownId('');
                    deleteAssignmentFunction(assignment);
                  }}
                />
              ))}
            </div>

            <Dialog
              open={isAddAssigmentModalOpen}
              onOpenChange={AddAssigmentModalOpenChangeHandler}
            >
              <DialogTrigger asChild>
                <Button className="mb-2 ml-1 flex flex-col items-center justify-center rounded-sm bg-gray-700 font-light text-gray-300 transition-all duration-300 ease-in-out hover:bg-white">
                  + Add new assignment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Assignment</DialogTitle>
                  <DialogDescription>
                    Fill in the details for your new assignment below. <br />{' '}
                    Click "Create" when you're done.
                  </DialogDescription>
                </DialogHeader>
                <form
                  className="mt-4 flex w-full flex-col gap-4"
                  onSubmit={submitNewAssignment}
                >
                  <div className="space-y-2">
                    <Label htmlFor="add-assignment-title">Title</Label>
                    <Input
                      type="text"
                      id="add-assignment-title"
                      value={assignmentTitle}
                      placeholder="e.g. Coursework"
                      onChange={(e) => setAssignmentTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-assignment-weight">Module Weight</Label>
                    <Input
                      type="number"
                      id="add-assignment-weight"
                      value={assignmentWeight}
                      min={0}
                      max={100}
                      onChange={(e) => setAssignmentWeight(e.target.value)}
                      onKeyDown={(evt) =>
                        ['e', 'E', '+', '-'].includes(evt.key) &&
                        evt.preventDefault()
                      }
                      className={
                        invalidWeightError ? 'border-red-400 ring-red-400' : ''
                      }
                    />
                    {invalidWeightError && (
                      <p className="text-center text-[13px] text-red-400">
                        {invalidWeightError}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <ToggleGroup
                      variant="outline"
                      type="single"
                      className="w-full"
                      onValueChange={(value) => {
                        if (value) {
                          if (value === 'Complete') {
                            setIsComplete(true);
                          } else {
                            setIsComplete(false);
                          }
                        }
                      }}
                    >
                      <ToggleGroupItem value="Incomplete">
                        Incomplete
                      </ToggleGroupItem>
                      <ToggleGroupItem value="Complete">
                        Complete
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                  {isComplete && (
                    <div className="space-y-2">
                      <Label htmlFor="add-assignment-mark">Mark</Label>
                      <Input
                        type="number"
                        id="add-assignment-mark"
                        value={assignmentMark}
                        min={0}
                        max={100}
                        onChange={(e) => setAssignmentMark(e.target.value)}
                        onKeyDown={(evt) =>
                          ['e', 'E', '+', '-'].includes(evt.key) &&
                          evt.preventDefault()
                        }
                      />
                    </div>
                  )}

                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create'}
                  </Button>
                </form>
                {formError && (
                  <p className="text-center text-red-400">{formError}</p>
                )}
              </DialogContent>
            </Dialog>
            <div className="flex gap-1">
              <Button
                className="mb-4 ml-1 flex flex-col items-center justify-center rounded-sm bg-gray-700 font-light text-gray-300 transition-all duration-300 ease-in-out hover:bg-white"
                onClick={editModuleFunction} // This function just opens the editing modal, and passes back up the module currently being worked on
              >
                <div className="flex items-center gap-2">
                  <Edit />
                  Edit Module
                </div>
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="mb-4 ml-1 flex flex-col items-center justify-center rounded-sm bg-gray-700 font-light text-gray-300 transition-all duration-300 ease-in-out hover:bg-red-600">
                    <div className="flex items-center gap-1.5">
                      <Trash />
                      Delete Module
                    </div>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This module will be
                      permanently removed from the current year.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={deleteModule}
                      className="hover:bg-red-600"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            {deleteError && <p className="ml-2 text-red-400">{deleteError}</p>}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
