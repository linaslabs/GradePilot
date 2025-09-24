import { YearDetailsContext } from '@/contexts/YearDetailsContext';
import { useAuth } from '@/hooks/useAuth';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ModuleAccordion from '@/components/ui/module-accordion';
import DialogToolTip from '@/components/ui/dialogToolTip';
import ModuleEditingDialog from '@/components/ui/module-editing-dialog';
import ModuleAddingDialog from '@/components/ui/module-adding-dialog';
import AssignmentEditingDialog from '@/components/ui/assignment-editing-dialog';
import AssignmentAddingDialog from '@/components/ui/assignment-adding-dialog';
import AssignmentDeletingDialog from '@/components/ui/assignment-deleting-dialog';
import ModuleDeletingDialog from '@/components/ui/module-deleting-dialog';
import type { AcademicYearData, AssignmentType, Module } from '@/types';
import YearDetailsHeader from '@/components/ui/yearDetailsHeader';
import { SquareStack } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function YearDetails() {
  const { token } = useAuth();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [yearInfo, setYearInfo] = useState<AcademicYearData | null>(null);

  const [isModuleAddingModalOpen, setIsModuleAddingModalOpen] = useState(false);
  const [moduleToEdit, setModuleToEdit] = useState<Module | null>(null);
  const [moduleToDelete, setModuleToDelete] = useState<Module | null>(null);
  const [moduleToAddNewAssignmentTo, setModuleToAddNewAssignmentTo] =
    useState<Module | null>(null);
  const [assignmentToEdit, setAssignmentToEdit] =
    useState<AssignmentType | null>(null);
  const moduleOfAssignmentToEdit = assignmentToEdit
    ? yearInfo?.modules.find((module) =>
        module.assignments.some(
          (assignment) => assignment.id === assignmentToEdit.id,
        ),
      )
    : null;
  const [assignmentToDelete, setAssignmentToDelete] =
    useState<AssignmentType | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
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

  const addModule = (newModule: Module) => {
    setYearInfo((currentYearInfo) => {
      if (!currentYearInfo) return null;

      return {
        ...currentYearInfo,
        modules: [...currentYearInfo.modules, newModule],
      };
    });
  };

  const openAddModuleModal = () => {
    setIsModuleAddingModalOpen(true);
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

  if ((!yearInfo && !isLoading) || error) {
    return (
      <div className="ml-7 flex flex-col">
        Something went wrong when finding your data for year {id}...
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

  if (isLoading) {
    return (
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
    );
  }

  const context = {
    yearInfo,
    openAddModuleModal,
    addModule,
    openEditModuleModal: setModuleToEdit,
    updateModule,
    openDeleteModuleModal: setModuleToDelete,
    deleteModule,
    openAddAssignmentModal: setModuleToAddNewAssignmentTo,
    addAssignment,
    openEditAssignmentModal: setAssignmentToEdit,
    updateAssignment,
    openDeleteAssignmentModal: setAssignmentToDelete,
    deleteAssignment,
  };

  return (
    <YearDetailsContext.Provider value={context}>
      <div className="flex flex-col gap-3 pl-7">
        <section className="flex">
          <div>
            <YearDetailsHeader />
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
              <ModuleAccordion key={module.id} module={module} />
            ))
          ) : (
            <p className="mb-2">Looks like you have no modules! Create some!</p>
          )}

          <Button
            className="ml-1 flex flex-col items-center justify-center rounded-sm bg-gray-700 text-gray-300 transition-all duration-300 ease-in-out hover:bg-white hover:text-gray-600"
            onClick={() => openAddModuleModal()}
          >
            + Add new module
          </Button>

          <ModuleAddingDialog
            isOpen={isModuleAddingModalOpen}
            onClose={() => setIsModuleAddingModalOpen(false)}
            yearId={yearInfo?.id ?? null}
          />

          <ModuleEditingDialog
            isOpen={!!moduleToEdit}
            onClose={() => setModuleToEdit(null)}
            moduleData={moduleToEdit ?? null}
          />

          <ModuleDeletingDialog
            isOpen={!!moduleToDelete}
            onClose={() => {
              setModuleToDelete(null);
            }}
            moduleData={moduleToDelete ?? null}
          />

          <AssignmentAddingDialog
            isOpen={!!moduleToAddNewAssignmentTo}
            onClose={() => setModuleToAddNewAssignmentTo(null)}
            moduleData={moduleToAddNewAssignmentTo}
          />

          <AssignmentEditingDialog
            isOpen={!!assignmentToEdit}
            onClose={() => {
              setAssignmentToEdit(null);
              setModuleToEdit(null);
            }}
            assignmentData={assignmentToEdit ?? null}
            moduleData={moduleOfAssignmentToEdit ?? null}
          />

          <AssignmentDeletingDialog
            isOpen={!!assignmentToDelete}
            onClose={() => {
              setAssignmentToDelete(null);
            }}
            assignmentData={assignmentToDelete ?? null}
          />
        </main>
      </div>
    </YearDetailsContext.Provider>
  );
}
