import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface YearData {
  yearNumber: number;
  weightingPercent: number;
  targetClassification?: string;
}

interface OnboardingPayload {
  title: string;
  studyLevel: string;
  degreeType: string;
  yearData: YearData[];
  currentYear: number;
  targetDegreeClassification?: string; // The '?' makes this property optional
}

export default function Onboarding() {
  const [studyLevel, setStudyLevel] = useState('');
  const [title, setTitle] = useState('');
  const [degreeType, setDegreeType] = useState('');
  const [totalLengthYears, setTotalLengthYears] = useState(0);
  const [currentYear, setCurrentYear] = useState(0);
  const [targetDegreeClassification, setTargetDegreeClassification] =
    useState('');
  const [error, setError] = useState('');

  const { token } = useAuth();
  const navigate = useNavigate();

  const submitOnboarding = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !title ||
      !studyLevel ||
      !degreeType ||
      !totalLengthYears ||
      !currentYear
    ) {
      setError('Please fill out all the required fields');
      return; // Stops function
    }

    // Populating the yearData - ADD YEAR WEIGHTING COMPILATION HERE TOO WHEN FUNCTIONALITY IS ADDED
    const yearData = [];
    for (let index = 0; index < totalLengthYears; index++) {
      yearData[index] = {
        yearNumber: index + 1,
        weightingPercent: 10, // PLACEHOLDER VALUE
        targetClassification: undefined,
      };
    }

    const formData: OnboardingPayload = {
      title,
      studyLevel,
      degreeType,
      yearData,
      currentYear,
    };

    if (targetDegreeClassification) {
      formData.targetDegreeClassification = targetDegreeClassification;
    }

    try {
      const response = await fetch('http://127.0.0.1:3000/api/degree', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`, // NEED TO ADD AUTH
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

      console.log(response);
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred... Try again later');
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 pb-40">
      <h1 className="text-[min(7vw,60px)] font-bold">
        Tell us about yourself...
      </h1>
      <form
        className="flex w-[min(80vw,500px)] flex-col gap-4"
        onSubmit={submitOnboarding}
      >
        <div className="space-y-2">
          <Label className="text-0.5xl" htmlFor="studyLevel">
            What is your study level?
          </Label>
          <ToggleGroup
            onValueChange={(value) => {
              if (value) setStudyLevel(value);
            }}
            variant="outline"
            type="single"
            className="w-full"
            id="studyLevel"
          >
            <ToggleGroupItem value="UNDERGRADUATE">
              Undergraduate
            </ToggleGroupItem>
            <ToggleGroupItem value="POSTGRADUATE">Postgraduate</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="space-y-2">
          <Label className="text-0.5xl" htmlFor="degreeTitle">
            What is your degree subject/title?{' '}
            <span className="text-gray-400"> E.g. "Computer Science"</span>
          </Label>
          <Input
            type="text"
            id="degreeTitle"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-0.5xl" htmlFor="degreeType">
            What is your degree type?
          </Label>
          <ToggleGroup
            onValueChange={(value) => {
              if (value) setDegreeType(value);
            }}
            variant="outline"
            type="single"
            className="w-full"
            id="degreeType"
          >
            <ToggleGroupItem value="Batchelors">Bachelors </ToggleGroupItem>
            <ToggleGroupItem value="Masters">Masters</ToggleGroupItem>
            <ToggleGroupItem value="Doctorate">Doctorate</ToggleGroupItem>
            <ToggleGroupItem value="Major">Major</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="space-y-2">
          <Label className="text-0.5xl" htmlFor="degreeLength">
            How many years do you want to track?
          </Label>
          <ToggleGroup
            variant="outline"
            type="single"
            className="w-full"
            id="degreeLength"
            onValueChange={(value) => {
              if (value) setTotalLengthYears(Number(value));
            }}
          >
            <ToggleGroupItem value="1">1 </ToggleGroupItem>
            <ToggleGroupItem value="2">2</ToggleGroupItem>
            <ToggleGroupItem value="3">3</ToggleGroupItem>
            <ToggleGroupItem value="4">4</ToggleGroupItem>
            <ToggleGroupItem value="5">5</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="space-y-2">
          <Label className="text-0.5xl" htmlFor="currentYear">
            What is your current year?
          </Label>
          <ToggleGroup
            variant="outline"
            type="single"
            className="w-full"
            id="currentYear"
            onValueChange={(value) => {
              if (value) setCurrentYear(Number(value));
            }}
          >
            <ToggleGroupItem value="1">1 </ToggleGroupItem>
            <ToggleGroupItem value="2">2</ToggleGroupItem>
            <ToggleGroupItem value="3">3</ToggleGroupItem>
            <ToggleGroupItem value="4">4</ToggleGroupItem>
            <ToggleGroupItem value="5">5</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="space-y-2">
          <Label className="text-0.5xl" htmlFor="targetDegreeClassification">
            Choose your target degree classification{' '}
            <span className="text-gray-400">(Optional)</span>
          </Label>
          <ToggleGroup
            variant="outline"
            type="single"
            className="w-full"
            id="targetDegreeClassification"
            onValueChange={(value) => {
              if (value) setTargetDegreeClassification(value);
            }}
          >
            <ToggleGroupItem value="PASS">Pass </ToggleGroupItem>
            <ToggleGroupItem value="THIRD_CLASS">Third</ToggleGroupItem>
            <ToggleGroupItem value="LOWER_SECOND_CLASS">2:2</ToggleGroupItem>
            <ToggleGroupItem value="UPPER_SECOND_CLASS">2:1</ToggleGroupItem>
            <ToggleGroupItem value="FIRST_CLASS">First</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <p className="text-center text-red-400">{error}</p>
        <Button type="submit">Finish</Button>
      </form>
      <p className="text-red-400">{}</p>
    </div>
  );
}
