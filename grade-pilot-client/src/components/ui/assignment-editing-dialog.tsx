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

interface AssignmentEditingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assignmentData: AssignmentType | null;
  moduleData: Module | null;
}

interface formData {
  title: string;
  markPercent: number | null;
  weightingPercent: number;
}

export default function AssignmentEditingDialog({
  isOpen,
  onClose,
  assignmentData,
  moduleData,
}: AssignmentEditingDialogProps) {
  const { updateAssignment } = useYearDetails();
  const { token } = useAuth();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentWeight, setAssignmentWeight] = useState('');
  const [assignmentMark, setAssignmentMark] = useState('');
  const [currentCompletionStatus, setCurrentCompletionStatus] =
    useState('Incomplete');
  const totalCurrentModuleWeight = moduleData
    ? calculateModuleWeights(moduleData?.assignments) -
      (assignmentData ? assignmentData?.weightingPercent : 0)
    : 0;
  const [formError, setFormError] = useState('');
  const [completeMarkError, setCompleteMarkError] = useState('');
  const [invalidWeightError, setInvalidWeightError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetAllFormState = () => {
    setAssignmentTitle('');
    setAssignmentWeight('');
    setAssignmentMark('');
    setCurrentCompletionStatus('Incomplete');
    setFormError('');
    setCompleteMarkError('');
    setInvalidWeightError('');
  };

  const handleClose = () => {
    resetAllFormState();
    onClose();
  };

  useEffect(() => {
    if (isOpen && assignmentData) {
      setAssignmentTitle(assignmentData.title);
      setAssignmentWeight(String(assignmentData.weightingPercent));
      if (
        assignmentData.markPercent !== null &&
        assignmentData.markPercent !== undefined
      ) {
        setAssignmentMark(String(assignmentData.markPercent));
        setCurrentCompletionStatus('Complete');
      } else {
        setAssignmentMark('');
        setCurrentCompletionStatus('Incomplete');
      }
    }
  }, [isOpen, assignmentData]);

  if (!assignmentData) return null;

  const initialIsComplete = assignmentData.markPercent != null;

  const originalMarkString =
    assignmentData.markPercent == null
      ? ''
      : String(assignmentData.markPercent);

  const assignmentIsEdited =
    assignmentTitle !== assignmentData?.title ||
    assignmentWeight !== String(assignmentData.weightingPercent) ||
    initialIsComplete !== (currentCompletionStatus === 'Complete') ||
    assignmentMark !== originalMarkString;

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

    if (currentCompletionStatus === 'Complete' && !assignmentMark) {
      setCompleteMarkError('Please fill in your achieved mark!');
      setIsSubmitting(false);
      return;
    }

    const formData: formData = {
      title: assignmentTitle,
      weightingPercent: Number(assignmentWeight),
      markPercent:
        assignmentMark && currentCompletionStatus === 'Complete'
          ? Number(assignmentMark)
          : null,
    };

    try {
      const response = await fetch(
        `${apiUrl}/assignment/${assignmentData.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.customMessage ||
            'An unexpected error occured... Try again later',
        );
      }

      handleClose();
      updateAssignment(data.assignment);
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
          <DialogTitle>Edit Assignment</DialogTitle>
          <DialogDescription>
            Fill in the details to update the Assignment below. Click "Edit"
            when you're done.
          </DialogDescription>
        </DialogHeader>
        <form
          className="mt-4 flex w-full flex-col gap-4"
          onSubmit={submitNewAssignment}
        >
          <div className="space-y-2">
            <Label htmlFor="edit-assignment-title">Title</Label>
            <Input
              type="text"
              id="edit-assignment-title"
              value={assignmentTitle}
              placeholder="e.g. Coursework"
              onChange={(e) => setAssignmentTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-assignment-weight">Module Weight</Label>
            <Input
              type="number"
              id="edit-assignment-weight"
              value={assignmentWeight}
              min={1}
              max={100}
              onChange={(e) => setAssignmentWeight(e.target.value)}
              onKeyDown={(evt) =>
                ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
              }
              className={
                invalidWeightError ? 'border-red-400 ring-red-400' : ''
              }
            />
          </div>
          {invalidWeightError && (
            <p className="mt-[-10px] text-center text-[13px] text-red-400">
              {invalidWeightError}
            </p>
          )}
          <div className="space-y-2">
            <Label>Status</Label>
            <ToggleGroup
              variant="outline"
              type="single"
              className="w-full"
              value={currentCompletionStatus}
              onValueChange={(value) => {
                setCurrentCompletionStatus(value);
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
                <Label htmlFor="edit-assignment-mark">Mark</Label>
                <Input
                  type="number"
                  id="edit-assignment-mark"
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

          <Button type="submit" disabled={isSubmitting || !assignmentIsEdited}>
            {isSubmitting ? 'Editing...' : 'Edit'}
          </Button>
        </form>
        {formError && <p className="text-center text-red-400">{formError}</p>}
      </DialogContent>
    </Dialog>
  );
}
