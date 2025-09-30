import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useYearDetails } from '@/contexts/YearDetailsContext';
import DialogToolTip from './dialogToolTip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from './button';
import { Label } from './label';
import { Input } from './input';
import type { Module } from '@/types';

interface ModuleEditingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  moduleData: Module | null;
}

interface FormData {
  name: string;
  credits: number;
  moduleCode: string | null;
  targetMark: number | null;
}

export default function ModuleEditingDialog({
  isOpen,
  onClose,
  moduleData,
}: ModuleEditingDialogProps) {
  const { updateModule } = useYearDetails();
  const { token } = useAuth();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleCode, setModuleCode] = useState('');
  const [moduleCredits, setModuleCredits] = useState('');
  const [moduleTargetMark, setModuleTargetMark] = useState('');

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // "Normalising" the original moduleCode info, so if its "null" it is " '' " so it can be compared to the current state
  const originalModuleCodeString = moduleData?.moduleCode ?? '';
  const originalTargetMarkString =
    moduleData?.targetMark != null ? String(moduleData.targetMark) : '';

  const moduleIsEdited =
    moduleTitle !== moduleData?.name ||
    moduleCode !== originalModuleCodeString ||
    moduleCredits !== String(moduleData.credits) ||
    moduleTargetMark !== originalTargetMarkString;

  useEffect(() => {
    if (isOpen && moduleData) {
      setModuleTitle(moduleData.name);
      setModuleCredits(String(moduleData.credits));
      if (moduleData.moduleCode != null) {
        setModuleCode(moduleData.moduleCode);
      } else {
        setModuleCode('');
      }

      if (moduleData.targetMark != null) {
        setModuleTargetMark(String(moduleData.targetMark));
      }
    }
  }, [isOpen, moduleData]);
  if (!moduleData) return null;

  const resetAllFormState = () => {
    setModuleTitle('');
    setModuleCode('');
    setModuleCredits('');
    setModuleTargetMark('');
    setFormError('');
  };

  const handleClose = () => {
    resetAllFormState();
    onClose();
  };
  const submitNewModule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    if (!moduleTitle || !moduleCredits) {
      // Could instead throw error and handle in error handler? need to check if modal is open and type "error"
      setFormError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    const FormData: FormData = {
      name: moduleTitle,
      credits: Number(moduleCredits),
      moduleCode: moduleCode || null,
      targetMark: moduleTargetMark ? Number(moduleTargetMark) : null,
    };

    try {
      const response = await fetch(`${apiUrl}/module/${moduleData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(FormData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.customMessage ||
            'An unexpected error occured... Try again later',
        );
      }

      // Then use "onUpdate" to update info
      updateModule(data.module);
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Module</DialogTitle>
          <DialogDescription>
            Fill in the details to update the module below. Click "Edit" when
            you're done.
          </DialogDescription>
        </DialogHeader>
        <form
          className="mt-4 flex w-full flex-col gap-4"
          onSubmit={submitNewModule}
        >
          <div className="space-y-2">
            <Label htmlFor="edit-module-code" className="flex gap-1">
              Code
              <span className="text-muted-foreground text-xs">(Optional)</span>
            </Label>
            <Input
              type="text"
              id="edit-module-code"
              value={moduleCode}
              placeholder="e.g. CS175"
              onChange={(e) => setModuleCode(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-module-title">Title</Label>
            <Input
              type="text"
              id="edit-module-title"
              value={moduleTitle}
              placeholder="e.g. Programming For Computer Scientists"
              onChange={(e) => setModuleTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-module-cats" className="flex gap-1">
              Credits
              <DialogToolTip content="CATS - A standard part of the UK credit system. Ratio of this number to the total year CATS is the weighting of the module on the year" />
            </Label>
            <Input
              type="number"
              id="edit-module-cats"
              value={moduleCredits}
              min={1}
              // Add max value?
              onChange={(e) => setModuleCredits(e.target.value)}
              onKeyDown={(evt) =>
                ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-module-targetMark" className="flex gap-1">
              Target Mark
              <DialogToolTip content="This is the mark from 0-100% you hope to achieve for this module overall" />
              <span className="text-muted-foreground text-xs">(Optional)</span>
            </Label>
            <Input
              type="number"
              value={moduleTargetMark}
              min={0}
              max={100}
              id="edit-module-targetMark"
              onChange={(e) => setModuleTargetMark(e.target.value)}
              onKeyDown={(evt) =>
                ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
              }
            />
          </div>
          <Button type="submit" disabled={isSubmitting || !moduleIsEdited}>
            {isSubmitting ? 'Editing...' : 'Edit'}
          </Button>
        </form>
        {formError && <p className="text-center text-red-400">{formError}</p>}
      </DialogContent>
    </Dialog>
  );
}
