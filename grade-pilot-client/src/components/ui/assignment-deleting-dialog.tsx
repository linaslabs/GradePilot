import React, { useState } from 'react';
import type { AssignmentType } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/hooks/useAuth';
import { useYearDetails } from '@/contexts/YearDetailsContext';

interface AssignmentDeletingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assignmentData: AssignmentType | null;
}

export default function AssignmentDeletingDialog({
  isOpen,
  onClose,
  assignmentData,
}: AssignmentDeletingDialogProps) {
  const { deleteAssignment } = useYearDetails();
  const { token } = useAuth();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submitDeleteAssignment = async () => {
    setIsSubmitting(true);
    setError('');

    if (!assignmentData) return; // To be type-safe
    try {
      const response = await fetch(
        `${apiUrl}/assignment/${assignmentData.id}`,
        {
          method: 'DELETE',
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('An unexpected error occured... Try again later');
      }

      deleteAssignment(assignmentData.id); // Calls back to update the UI by deleting the assignment from yearInfo state
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to delete assignment... Try again later');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This assignment will be permanently
            removed from the current module.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && <p className="text-center text-red-400">{error}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={submitDeleteAssignment}
            className="hover:bg-red-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
