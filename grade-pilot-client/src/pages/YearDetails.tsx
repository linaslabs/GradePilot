import { useAuth } from '@/hooks/useAuth';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ModuleAccordion from '@/components/ui/module-accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { AcademicYearData, AssignmentType } from '@/types';
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const { id } = useParams();

  useEffect(() => {
    async function fetchYear() {
      try {
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
          setFormError(error.message);
        } else {
          setFormError('An unexpected error occurred... Try again later');
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

      if (!moduleTitle || !moduleCredits) {
        // Could instead throw error and handle in error handler? need to check if modal is open and type "error"
        setFormError('Please fill in all required fields');
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

        setIsModalOpen(false);
        console.log(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unexpected error occurred... Try again later');
        }
      }
    }
  };

  const submitNewAssignment = (
    moduleId: string,
    newAssignment: AssignmentType,
  ) => {
    if (yearInfo) {
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
    }
  };

  const modalOpenChangeHandler = (isOpen: boolean) => {
    setIsModalOpen(isOpen);

    if (!isOpen) {
      setModuleTitle('');
      setModuleCode('');
      setModuleCredits('');
      setModuleTargetMark('');
      setFormError('');
    }
  };

  if (!yearInfo) {
    return <div>Could not find data for year {id}</div>;
  }

  return (
    <>
      <div className="flex flex-col gap-3 pl-7">
        <section className="flex flex-col gap-3">
          <h1>Year 1</h1>
          <h2>Modules</h2>
        </section>
        {error}
        <main className="flex w-[70vw] flex-col items-start pr-7">
          {yearInfo && yearInfo.modules.length > 0 ? (
            yearInfo.modules.map((module) => (
              <section className="flex gap-2">
                <ModuleAccordion
                  key={module.id}
                  module={module}
                  assignmentFunction={submitNewAssignment}
                />
              </section>
            ))
          ) : (
            <p className="mb-2">Looks like you have no modules! Create some!</p>
          )}

          <Dialog open={isModalOpen} onOpenChange={modalOpenChangeHandler}>
            <DialogTrigger asChild>
              <Button className="ml-1 flex flex-col items-center justify-center rounded-sm bg-gray-700 text-gray-300 transition-all duration-300 ease-in-out hover:bg-white">
                + Add new module
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Module</DialogTitle>
              </DialogHeader>
              <form
                className="mt-4 flex w-full flex-col gap-4"
                onSubmit={submitNewModule}
              >
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    type="text"
                    id="title"
                    value={moduleTitle}
                    placeholder="e.g. Programming For Computer Scientists"
                    onChange={(e) => setModuleTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Code (Optional)</Label>
                  <Input
                    type="text"
                    id="code"
                    value={moduleCode}
                    placeholder="e.g. CS175"
                    onChange={(e) => setModuleCode(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cats">Credits (CATS) (INFO ICON?)</Label>
                  <Input
                    type="number"
                    id="cats"
                    value={moduleCredits}
                    min={0}
                    // Add max value?
                    onChange={(e) => setModuleCredits(e.target.value)}
                    onKeyDown={(evt) =>
                      ['e', 'E', '+', '-'].includes(evt.key) &&
                      evt.preventDefault()
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetMark">
                    Target Module Mark % (Optional)
                  </Label>
                  <Input
                    type="number"
                    value={moduleTargetMark}
                    min={0}
                    max={100}
                    id="targetMark"
                    onChange={(e) => setModuleTargetMark(e.target.value)}
                    onKeyDown={(evt) =>
                      ['e', 'E', '+', '-'].includes(evt.key) &&
                      evt.preventDefault()
                    }
                  />
                </div>
                <Button type="submit">Create</Button>
              </form>
              {formError && (
                <p className="text-center text-red-400">{formError}</p>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </>
  );
}
