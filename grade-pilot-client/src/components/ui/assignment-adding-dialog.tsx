import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useYearDetails } from '@/contexts/YearDetailsContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from './button';
import { Label } from './label';
import { Input } from './input';
import type { AssignmentType, Module } from '@/types';
import { calculateModuleWeights } from '@/utils/calculations';

interface AssignmentAddingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  moduleData: Module | null;
}

interface formData {
  title: string;
  weightingPercent: number;
  markPercent: number | null;
  moduleId: string | null;
}

export default function AssignmentAddingDialog({
  isOpen,
  onClose,
  moduleData,
}: AssignmentAddingDialogProps) {
  const { addAssignment } = useYearDetails();
  const { token } = useAuth();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentWeight, setAssignmentWeight] = useState('');
  const [assignmentMark, setAssignmentMark] = useState('');
  const totalCurrentModuleWeight = moduleData
    ? calculateModuleWeights(moduleData?.assignments)
    : 0;
  const [currentCompletionStatus, setCurrentCompletionStatus] =
    useState('Incomplete');
  const [formError, setFormError] = useState('');
  const [completeMarkError, setCompleteMarkError] = useState('');
  const [invalidWeightError, setInvalidWeightError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetAllFormState = () => {
    setAssignmentTitle('');
    setAssignmentWeight('');
    setAssignmentMark('');
    setFormError('');
    setCompleteMarkError('');
    setInvalidWeightError('');
  };

  const handleClose = () => {
    resetAllFormState();
    onClose();
  };

  const submitNewAssignment = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!moduleData) return;

    e.preventDefault();

    // Resetting error states so if the error no longer occurs, and another error is found, then this is clear
    setFormError('');
    setInvalidWeightError('');
    setCompleteMarkError('');

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

    if (currentCompletionStatus === 'Complete' && !assignmentMark) {
      setCompleteMarkError('Please fill in your achieved mark!');
      setIsSubmitting(false);
      return;
    }

    const formData: formData = {
      title: assignmentTitle,
      weightingPercent: Number(assignmentWeight),
      moduleId: moduleData.id,
      markPercent: assignmentMark ? Number(assignmentMark) : null,
    };

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

      addAssignment(moduleData.id, data.assignment);
      handleClose();
    } catch (error) {
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError('An unexpected error occurred... Try again later');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Assignment</DialogTitle>
          <DialogDescription>
            Fill in the details for your new assignment below. <br /> Click
            "Create" when you're done.
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
                ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
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
                setCurrentCompletionStatus(value);
                if (currentCompletionStatus === 'Incomplete') {
                  setAssignmentMark('');
                }
                setCompleteMarkError('');
              }}
            >
              <ToggleGroupItem value="Incomplete">Incomplete</ToggleGroupItem>
              <ToggleGroupItem value="Complete">Complete</ToggleGroupItem>
            </ToggleGroup>
          </div>
          {currentCompletionStatus === 'Complete' && (
            <>
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
                  className={`${completeMarkError ? 'border-red-400 ring-red-400' : ''}`}
                />
              </div>
              {completeMarkError && (
                <p className="mt-[-10px] text-center text-[13px] text-red-400">
                  {completeMarkError}
                </p>
              )}
            </>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </form>
        {formError && <p className="text-center text-red-400">{formError}</p>}
      </DialogContent>
    </Dialog>
  );
}
