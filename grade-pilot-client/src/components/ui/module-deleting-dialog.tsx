import React, { useState } from 'react';
import type { Module } from '@/types';
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

interface ModuleDeletingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  moduleData: Module | null;
}

export default function ModuleDeletingDialog({
  isOpen,
  onClose,
  moduleData,
}: ModuleDeletingDialogProps) {
  const { deleteModule } = useYearDetails();
  const { token } = useAuth();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submitDeleteModule = async () => {
    setIsSubmitting(true);
    setError('');

    if (!moduleData) return; // To be type-safe
    try {
      const response = await fetch(`${apiUrl}/module/${moduleData.id}`, {
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('An unexpected error occured... Try again later');
      }

      deleteModule(moduleData.id);
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to delete module... Try again later');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This module will be permanently
            removed from the current year.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && <p className="text-center text-red-400">{error}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={submitDeleteModule}
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
