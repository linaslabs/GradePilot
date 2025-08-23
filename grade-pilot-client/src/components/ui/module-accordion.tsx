import React, { useState } from 'react';
import type { AssignmentType, Module } from '@/types';
import { Button } from './button';
import { Label } from './label';
import { Input } from './input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import Assignment from './assignment';
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
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
interface ModuleProp {
  module: Module;
  assignmentFunction: (moduleId: string, newAssignment: AssignmentType) => void;
}
interface formData {
  title: string;
  weightingPercent: number;
  markPercent?: number;
  moduleId: string;
}

export default function ModuleAccordion({
  module,
  assignmentFunction,
}: ModuleProp) {
  const { token } = useAuth();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentWeight, setAssignmentWeight] = useState('');
  const [assignmentMark, setAssignmentMark] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const [formError, setFormError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const submitNewAssignment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!assignmentTitle || !assignmentWeight) {
      // Could instead throw error and handle in error handler? need to check if modal is open and type "error"
      setFormError('Please fill in all required fields');
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

      assignmentFunction(module.id, data.assignment);

      setIsModalOpen(false);
      console.log(data);
    } catch (error) {
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError('An unexpected error occurred... Try again later');
      }
    }
  };

  const modalOpenChangeHandler = (isOpen: boolean) => {
    setIsModalOpen(isOpen);

    if (!isOpen) {
      setAssignmentTitle('');
      setAssignmentWeight('');
      setAssignmentMark('');
      setFormError('');
    }
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={`item-${module.id}`}>
        <AccordionTrigger className="bg-sidebar-primary-foreground text-background mb-2 ml-1 pr-5 pl-5 transition-all duration-200 ease-in-out hover:no-underline hover:shadow-xl hover:shadow-gray-600">
          <h3>
            {module.moduleCode} {module.name} [ADD CURRENT MODULE MARK HERE
            INSTEAD]
          </h3>
        </AccordionTrigger>
        <AccordionContent className="pl-5">
          <div className="flex flex-col gap-2">
            <div className="mt-2 mr-1 flex flex-col items-start gap-2 rounded-sm pt-2 pr-5 pb-2 pl-5 text-white bg-gray-600">
              <span className='text-[12px]'>Module Stats:</span>
              <h3> CATS: </h3>
            </div>
            {module.assignments.map((assignment) => (
              <Assignment key={assignment.id} assignment={assignment} />
            ))}
          </div>

          <Dialog open={isModalOpen} onOpenChange={modalOpenChangeHandler}>
            <DialogTrigger asChild>
              <Button className="mt-4 mb-4 ml-1 flex flex-col items-center justify-center rounded-sm bg-gray-700 font-light text-gray-300 transition-all duration-300 ease-in-out hover:bg-white">
                + Add new assignment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Assignment</DialogTitle>
              </DialogHeader>
              <form
                className="mt-4 flex w-full flex-col gap-4"
                onSubmit={submitNewAssignment}
              >
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    type="text"
                    id="title"
                    value={assignmentTitle}
                    placeholder="e.g. Coursework"
                    onChange={(e) => setAssignmentTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Module Weight</Label>
                  <Input
                    type="number"
                    id="cats"
                    value={assignmentWeight}
                    min={0}
                    max={100}
                    onChange={(e) => setAssignmentWeight(e.target.value)}
                    onKeyDown={(evt) =>
                      ['e', 'E', '+', '-'].includes(evt.key) &&
                      evt.preventDefault()
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Status</Label>
                  <ToggleGroup
                    variant="outline"
                    type="single"
                    className="w-full"
                    id="currentYear"
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
                    <ToggleGroupItem value="Complete">Complete</ToggleGroupItem>
                  </ToggleGroup>
                </div>
                {isComplete && (
                  <div className="space-y-2">
                    <Label htmlFor="mark">Mark</Label>
                    <Input
                      type="number"
                      id="mark"
                      value={assignmentWeight}
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

                <Button type="submit">Create</Button>
              </form>
              {formError && (
                <p className="text-center text-red-400">{formError}</p>
              )}
            </DialogContent>
          </Dialog>

          <Button className="mt-4 mb-4 ml-1 flex flex-col items-center justify-center rounded-sm bg-gray-700 font-light text-gray-300 transition-all duration-300 ease-in-out hover:bg-red-600">
            Delete Module
          </Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
