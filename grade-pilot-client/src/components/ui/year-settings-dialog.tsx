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

interface YearSettingsData {
  totalCredits?: number; // number | undefined encapsulates "null" as well
  weightingPercent?: number;
  targetMark?: number;
}

interface YearSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  yearSettingsData: YearSettingsData;
}

interface FormData {
  yearId?: string;
  newYearTotalCredits: number;
  newYearWeighting: number;
  newYearMark: number;
}

export default function YearSettingsDialog({
  isOpen,
  onClose,
  yearSettingsData,
}: YearSettingsProps) {
  const { updateYear, yearInfo } = useYearDetails();
  const { token } = useAuth();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [originalTotalYearCredits, setOriginalTotalYearCredits] = useState('');
  const [totalYearCredits, setTotalYearCredits] = useState('');
  const [originalYearDegreeWeighting, setOriginalYearDegreeWeighting] =
    useState('');
  const [yearDegreeWeighting, setYearDegreeWeighting] = useState('');
  const [originalYearTargetMark, setOriginalYearTargetMark] = useState('');
  const [yearTargetMark, setYearTargetMark] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!yearSettingsData) return;

    if (yearSettingsData.totalCredits != null) {
      setOriginalTotalYearCredits(String(yearSettingsData.totalCredits));
    } else {
      setOriginalTotalYearCredits('');
    }

    if (yearSettingsData.weightingPercent != null) {
      setOriginalYearDegreeWeighting(String(yearSettingsData.weightingPercent));
    } else {
      setOriginalYearDegreeWeighting('');
    }

    if (yearSettingsData.targetMark != null) {
      setOriginalYearTargetMark(String(yearSettingsData.targetMark));
    } else {
      setOriginalYearTargetMark('');
    }
  }, [yearSettingsData]);

  const settingsIsEdited =
    originalTotalYearCredits !== totalYearCredits ||
    originalYearDegreeWeighting !== yearDegreeWeighting ||
    originalYearTargetMark !== yearTargetMark;

  const resetAllFormState = () => {
    // Reset state? Not necessary for editing modules.. because state is reloaded when this dialog renders again

    // setOriginalTotalYearCredits('');
    // setOriginalYearDegreeWeighting('');
    // setOriginalYearTargetMark('');
    // setTotalYearCredits('');
    // setYearDegreeWeighting('');
    // setYearTargetMark('');

    setError('');
  };

  const handleClose = () => {
    resetAllFormState();
    onClose();
  };

  const configureYearSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    if (!totalYearCredits || !yearDegreeWeighting || !yearTargetMark) {
      setError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    const formData: FormData = {
      yearId: yearInfo?.id,
      newYearTotalCredits: Number(totalYearCredits),
      newYearWeighting: Number(yearDegreeWeighting),
      newYearMark: Number(yearTargetMark),
    };

    try {
      const response = await fetch(`${apiUrl}/year/${yearInfo?.yearNumber}`, {
        method: 'PATCH',
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

      // Then use "onUpdate" to update info
      updateYear(data.updatedSettings);
      handleClose();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred... Try again later');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure Year Settings</DialogTitle>
          <DialogDescription>
            Fill in or update the details of your year below. Click "Configure"
            when you're done.
          </DialogDescription>
        </DialogHeader>
        <form
          className="mt-4 flex w-full flex-col gap-4"
          onSubmit={configureYearSettings}
        >
          <div className="space-y-2">
            <Label htmlFor="total-year-credits" className="flex gap-1">
              Total Year Credits
            </Label>
            <Input
              type="number"
              id="total-year-credits"
              value={totalYearCredits}
              min={1}
              placeholder="e.g. 120"
              onChange={(e) => setTotalYearCredits(e.target.value)}
              onKeyDown={(evt) =>
                ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
              }
            />
          </div>
          <div className="space-y-2">
            <div className="flex gap-1">
              <Label htmlFor="year-degree-weighting">Degree Weighting</Label>
              <DialogToolTip content="The weight that this year's final result has on your degree. A degree may be split into 3 years weighing 10%, 30% and 60% for example" />
            </div>
            <Input
              type="number"
              id="year-degree-weighting"
              value={yearDegreeWeighting}
              min={1}
              placeholder="e.g. 10%"
              onChange={(e) => setYearDegreeWeighting(e.target.value)}
              onKeyDown={(evt) =>
                ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year-target-mark" className="flex gap-1">
              Year Target Mark
            </Label>
            <Input
              type="number"
              id="year-target-mark"
              value={yearTargetMark}
              min={1}
              // Add max value?
              onChange={(e) => setYearTargetMark(e.target.value)}
              onKeyDown={(evt) =>
                ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()
              }
            />
          </div>
          <Button type="submit" disabled={isSubmitting || !settingsIsEdited}>
            {isSubmitting ? 'Editing...' : 'Edit'}
          </Button>
        </form>
        {error && <p className="text-center text-red-400">{error}</p>}
      </DialogContent>
    </Dialog>
  );
}
