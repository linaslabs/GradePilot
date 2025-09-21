import { YearDetailsContext } from '@/contexts/YearDetailsContext';
import { useAuth } from '@/hooks/useAuth';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ModuleAccordion from '@/components/ui/module-accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DialogToolTip from '@/components/ui/dialogToolTip';
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
import ModuleEditingDialog from '@/components/ui/module-editing-dialog';
import AssignmentEditingDialog from '@/components/ui/assignment-editing-dialog';
import type { AcademicYearData, AssignmentType, Module } from '@/types';
import YearDetailsHeader from '@/components/ui/yearDetailsHeader';
import { SquareStack } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
interface formData {
  name: string;
  credits: number;
  moduleCode?: string;
  targetMark?: number;
  academicYearId: string;
}

export default function YearDetails() {
  const { token } = useAuth();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [yearInfo, setYearInfo] = useState<AcademicYearData | null>(null);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleCode, setModuleCode] = useState('');
  const [moduleCredits, setModuleCredits] = useState('');
  const [moduleTargetMark, setModuleTargetMark] = useState('');

  // MODULE
  const [isAddModuleModalOpen, setIsAddModuleModalOpen] = useState(false);
  const [isEditingModuleModalOpen, setIsEditingModuleModalOpen] =
    useState(false);
  const [moduleOfEditingAssignment, setModuleOfEditingAssignment] =
    useState<Module | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);

  // ASSIGNMENT
  const [isEditingAssignmentModalOpen, setIsEditingAssignmentModalOpen] =
    useState(false);
  const [editingAssignment, setEditingAssignment] =
    useState<AssignmentType | null>(null);
  const [assignmentToDelete, setAssignmentToDelete] =
    useState<AssignmentType | null>(null);
  const [assignmentDeleteError, setAssignmentDeleteError] = useState(''); // Needed? When to clear the error beneath the assignment?
  const [isDeleteAssignmentSubmitting, setIsDeleteAssignmentSubmitting] =
    useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const { id } = useParams();

  useEffect(() => {
    async function fetchYear() {
      try {
        setIsLoading(true);
        const response = await fetch(`${apiUrl}/year/${id}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.customMessage ||
              'An unexpected error occured... Try again later',
          );
        }

        setYearInfo(data.academicYear);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unexpected error occurred... Try again later');
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchYear();
  }, [token, id, apiUrl]);

  const submitNewModule = async (e: React.FormEvent<HTMLFormElement>) => {
    if (yearInfo) {
      // If statement to remove typescript error as yearInfo could be null
      e.preventDefault();

      setIsSubmitting(true);

      if (!moduleTitle || !moduleCredits) {
        // Could instead throw error and handle in error handler? need to check if modal is open and type "error"
        setFormError('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      const formData: formData = {
        name: moduleTitle,
        credits: Number(moduleCredits),
        academicYearId: yearInfo.id,
      };

      if (moduleCode) {
        formData.moduleCode = moduleCode;
      }

      if (moduleTargetMark) {
        formData.targetMark = Number(moduleTargetMark);
      }

      try {
        const response = await fetch(`${apiUrl}/module`, {
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

        setYearInfo((currentYearInfo) => {
          if (!currentYearInfo) return null;
          return {
            ...currentYearInfo,
            modules: [...currentYearInfo.modules, data.module],
          };
        });

        modalOpenChangeHandler(false); // Clears state
      } catch (error) {
        if (error instanceof Error) {
          setFormError(error.message); // Could this be setError instead?
        } else {
          setFormError('An unexpected error occurred... Try again later');
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const addAssignment = (moduleId: string, newAssignment: AssignmentType) => {
    setYearInfo((currentYearInfo) => {
      if (!currentYearInfo) return null;
      return {
        ...currentYearInfo,
        modules: currentYearInfo.modules.map((module) => {
          if (module.id == moduleId) {
            return {
              ...module,
              assignments: [...module.assignments, newAssignment],
            };
          }
          return module;
        }),
      };
    });
  };

  const deleteModule = (moduleId: string) => {
    setYearInfo((currentYearInfo) => {
      if (!currentYearInfo) return null;
      const updatedModules = currentYearInfo.modules.filter(
        (module) => module.id !== moduleId,
      );

      return {
        ...currentYearInfo,
        modules: updatedModules,
      };
    });
  };

  const updateModule = (updatedModule: Module) => {
    setYearInfo((currentYearInfo) => {
      if (!currentYearInfo) return null;
      const updatedModules = currentYearInfo.modules.map((module) => {
        if (module.id === updatedModule.id) {
          return updatedModule;
        }
        return module;
      });

      return {
        ...currentYearInfo,
        modules: updatedModules,
      };
    });

    setIsEditingModuleModalOpen(false);
  };

  const updateAssignment = (updatedAssignment: AssignmentType) => {
    setYearInfo((currentYearInfo) => {
      if (!currentYearInfo) return null;
      const updatedModules = currentYearInfo.modules.map((module) => {
        const updatedAssigments = module.assignments.map((assignment) => {
          if (assignment.id === updatedAssignment.id) {
            return updatedAssignment;
          }
          return assignment;
        });

        return {
          ...module,
          assignments: updatedAssigments,
        };
      });

      return {
        ...currentYearInfo,
        modules: updatedModules,
      };
    });

    setIsEditingAssignmentModalOpen(false);
  };

  const deleteAssignment = (assignmentId: string) => {
    setYearInfo((currentYearInfo) => {
      if (!currentYearInfo) return null;
      const updatedModules = currentYearInfo.modules.map((module) => {
        const updatedAssignments = module.assignments.filter(
          (assignment) => assignment.id !== assignmentId,
        );

        return {
          ...module,
          assignments: updatedAssignments,
        };
      });
      return {
        ...currentYearInfo,
        modules: updatedModules,
      };
    });
  };

  const handleDeleteAssignment = async () => {
    setIsDeleteAssignmentSubmitting(true);
    try {
      if (assignmentToDelete) {
        // Guaranteed to be true as long as dialogue only opens when this exists
        await fetch(`${apiUrl}/assignment/${assignmentToDelete.id}`, {
          method: 'DELETE',
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        deleteAssignment(assignmentToDelete.id);
      }
    } catch (error) {
      if (error instanceof Error) {
        setAssignmentDeleteError(error.message);
      } else {
        setAssignmentDeleteError(
          'This aasignment could not be deleted... Try again later',
        );
      }
    } finally {
      setIsDeleteAssignmentSubmitting(false);
    }
  };

  const modalOpenChangeHandler = (isOpen: boolean) => {
    setIsAddModuleModalOpen(isOpen);

    if (!isOpen) {
      setModuleTitle('');
      setModuleCode('');
      setModuleCredits('');
      setModuleTargetMark('');
      setFormError('');
    }
  };

  if (!yearInfo && !isLoading) {
    return (
      <div className="ml-7 flex flex-col">
        Could not find your data for year {id}
        <div className="flex gap-1">
          Details:
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            'Please try again later'
          )}
        </div>
      </div>
    );
  }

  return (
    <YearDetailsContext.Provider value={''}>
      {isLoading ? (
        <>
          <div className="mb-3 flex flex-col gap-2 pl-7">
            <Skeleton className="mb-1 h-13 w-35" />
            <Skeleton className="h-8 w-42" />
          </div>

          <div className="flex w-[70vw] flex-col gap-3 pl-7">
            <Skeleton className="h-17" />
            <Skeleton className="h-17" />
            <Skeleton className="h-17" />
            <Skeleton className="h-17" />
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-3 pl-7">
          <section className="flex">
            <div>
              <YearDetailsHeader yearInfo={yearInfo} />
              <h2 className="flex items-center">
                <SquareStack className="mr-2 h-8 w-8" />
                Modules{' '}
                <div className="ml-2">
                  <DialogToolTip content='Each module has a "current mark average" displayed on its right, this is the current module mark out of JUST its completed assignments' />
                </div>
              </h2>
            </div>
          </section>
          <main className="flex w-[70vw] flex-col items-start pr-7">
            {yearInfo && yearInfo.modules.length > 0 ? (
              yearInfo.modules.map((module) => (
                <ModuleAccordion
                  key={module.id}
                  module={module}
                  assignmentAddFunction={addAssignment}
                  moduleDeleteFunction={deleteModule}
                  editModuleFunction={() => {
                    setIsEditingModuleModalOpen(true);
                    setEditingModule(module);
                  }}
                  editAssignmentFunction={(
                    currentAssignment: AssignmentType,
                    currentModule: Module,
                  ) => {
                    setIsEditingAssignmentModalOpen(true);
                    setEditingAssignment(currentAssignment);
                    setModuleOfEditingAssignment(currentModule);
                  }}
                  deleteAssignmentFunction={(assignment: AssignmentType) =>
                    setAssignmentToDelete(assignment)
                  }
                />
              ))
            ) : (
              <p className="mb-2">
                Looks like you have no modules! Create some!
              </p>
            )}

            <Dialog
              open={isAddModuleModalOpen}
              onOpenChange={modalOpenChangeHandler}
            >
              <DialogTrigger asChild>
                <div>
                  <Button className="ml-1 flex flex-col items-center justify-center rounded-sm bg-gray-700 text-gray-300 transition-all duration-300 ease-in-out hover:bg-white hover:text-gray-600">
                    + Add new module
                  </Button>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Module</DialogTitle>
                  <DialogDescription>
                    Fill in the details for your new module below. <br /> Click
                    "Create" when you're done.
                  </DialogDescription>
                </DialogHeader>
                <form
                  className="mt-4 flex w-full flex-col gap-4"
                  onSubmit={submitNewModule}
                >
                  <div className="space-y-2">
                    <Label htmlFor="add-module-code" className="flex gap-1">
                      Code{' '}
                      <span className="text-muted-foreground text-xs">
                        (Optional)
                      </span>
                    </Label>
                    <Input
                      type="text"
                      id="add-module-code"
                      value={moduleCode}
                      placeholder="e.g. CS175"
                      onChange={(e) => setModuleCode(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-module-title">Title</Label>
                    <Input
                      type="text"
                      id="add-module-title"
                      value={moduleTitle}
                      placeholder="e.g. Programming For Computer Scientists"
                      onChange={(e) => setModuleTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="add-module-cats" className="flex gap-1">
                      Credits
                      <DialogToolTip content="CATS - A standard part of the UK credit system. Ratio of this number to the total year CATS is the weighting of the module on the year" />
                    </Label>
                    <Input
                      type="number"
                      id="add-module-cats"
                      value={moduleCredits}
                      min={1}
                      // Add max value?
                      onChange={(e) => setModuleCredits(e.target.value)}
                      onKeyDown={(evt) =>
                        ['e', 'E', '+', '-'].includes(evt.key) &&
                        evt.preventDefault()
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="add-module-targetMark"
                      className="flex gap-1"
                    >
                      Target Mark
                      <DialogToolTip content="This is the mark from 0-100% you hope to achieve for this module overall" />
                      <span className="text-muted-foreground text-xs">
                        (Optional)
                      </span>
                    </Label>
                    <Input
                      type="number"
                      value={moduleTargetMark}
                      min={0}
                      max={100}
                      id="add-module-targetMark"
                      onChange={(e) => setModuleTargetMark(e.target.value)}
                      onKeyDown={(evt) =>
                        ['e', 'E', '+', '-'].includes(evt.key) &&
                        evt.preventDefault()
                      }
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create'}
                  </Button>
                </form>
                {formError && (
                  <p className="text-center text-red-400">{formError}</p>
                )}
              </DialogContent>
            </Dialog>

            <ModuleEditingDialog
              isOpen={isEditingModuleModalOpen}
              onClose={() => setIsEditingModuleModalOpen(false)}
              onUpdate={updateModule}
              moduleData={editingModule}
            />

            <AssignmentEditingDialog
              isOpen={isEditingAssignmentModalOpen}
              onClose={() => setIsEditingAssignmentModalOpen(false)}
              onUpdate={updateAssignment}
              assignmentData={editingAssignment}
              moduleData={moduleOfEditingAssignment}
            />

            <AlertDialog
              open={!!assignmentToDelete}
              onOpenChange={() => setAssignmentToDelete(null)}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This assignment will be
                    permanently removed from the current module.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAssignment}
                    className="hover:bg-red-600"
                    disabled={isDeleteAssignmentSubmitting}
                  >
                    {isDeleteAssignmentSubmitting ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </main>
        </div>
      )}
    </YearDetailsContext.Provider>
  );
}
