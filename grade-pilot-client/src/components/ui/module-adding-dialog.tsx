import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
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
import { useYearDetails } from '@/contexts/YearDetailsContext';

interface ModuleAddingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  yearId: string | null;
}

interface formData {
  name: string;
  credits: number;
  academicYearId: string | null;
  moduleCode?: string | null;
  targetMark?: number | null;
}

export default function ModuleAddingDialog({
  isOpen,
  onClose,
  yearId,
}: ModuleAddingDialogProps) {
  const { token } = useAuth();
  const { addModule } = useYearDetails();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleCode, setModuleCode] = useState('');
  const [moduleCredits, setModuleCredits] = useState('');
  const [moduleTargetMark, setModuleTargetMark] = useState('');

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearFormState = () => {
    setModuleTitle('');
    setModuleCode('');
    setModuleCredits('');
    setModuleTargetMark('');
    setFormError('');
  };

  const handleClose = () => {
    clearFormState();
    onClose();
  };

  const submitNewModule = async (e: React.FormEvent<HTMLFormElement>) => {
    // If statement to remove typescript error as yearId could be null
    if (!yearId) {
      return;
    }
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
      academicYearId: yearId,
      moduleCode: moduleCode || null,
      targetMark: moduleTargetMark ? Number(moduleTargetMark) : null,
    };

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

      addModule(data.module);
      handleClose();
    } catch (error) {
      if (error instanceof Error) {
        setFormError(error.message); // Could this be setError instead?
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
          <DialogTitle>New Module</DialogTitle>
          <DialogDescription>
            Fill in the details for your new module below. <br /> Click "Create"
            when you're done.
          </DialogDescription>
        </DialogHeader>
        <form
          className="mt-4 flex w-full flex-col gap-4"
          onSubmit={submitNewModule}
        >
          <div className="space-y-2">
            <Label htmlFor="add-module-code" className="flex gap-1">
              Code{' '}
              <span className="text-muted-foreground text-xs">(Optional)</span>
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
                ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-module-targetMark" className="flex gap-1">
              Target Mark
              <DialogToolTip content="This is the mark from 0-100% you hope to achieve for this module overall" />
              <span className="text-muted-foreground text-xs">(Optional)</span>
            </Label>
            <Input
              type="number"
              value={moduleTargetMark}
              min={0}
              max={100}
              id="add-module-targetMark"
              onChange={(e) => setModuleTargetMark(e.target.value)}
              onKeyDown={(evt) =>
                ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
              }
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </form>
        {formError && <p className="text-center text-red-400">{formError}</p>}
      </DialogContent>
    </Dialog>
  );
}
