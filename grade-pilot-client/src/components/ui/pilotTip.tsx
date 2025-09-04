import React, { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface FinalResponse {
  moduleOverallMark: number;
  classificationAchieved: string;
  reqAvgMarkTarget: number | null;
  reqAvgMarkPass: number | null;
  reqAvgMarkTwoTwo: number | null;
  reqAvgMarkTwoOne: number | null;
  reqAvgMarkFirst: number | null;
}

interface PilotTipProps {
  pilotResponseObject: FinalResponse;
  moduleTargetMark: number | null | undefined;
}

export default function PilotTip({
  pilotResponseObject,
  moduleTargetMark,
}: PilotTipProps) {
  const [selectedTarget, setSelectedTarget] = useState('');

  const targetMap = {
    TargetMark: pilotResponseObject.reqAvgMarkTarget,
    Pass: pilotResponseObject.reqAvgMarkPass,
    TwoTwo: pilotResponseObject.reqAvgMarkTwoTwo,
    TwoOne: pilotResponseObject.reqAvgMarkTwoOne,
    First: pilotResponseObject.reqAvgMarkFirst,
  };

  const getToggleItemClasses = (mark: number | null) => {
    if (mark === null) {
      return 'text-green-400 data-[state=on]:bg-green-500 data-[state=on]:text-white hover:bg-green-500 border-transparent';
    }

    return 'border-transparent';
  };

  const requiredMark = targetMap[selectedTarget as keyof typeof targetMap]; // Makes sure Typescript sees that this will always be valid

  return (
    <>
      <p>For this module, pick what you want to achieve: </p>
      <div className="mt-1 mb-1 flex w-[40vw] rounded-md border-1 border-white">
        <ToggleGroup
          variant="outline"
          type="single"
          className="flex-1"
          onValueChange={setSelectedTarget}
          value={selectedTarget}
        >
          <ToggleGroupItem
            value="Pass"
            className={getToggleItemClasses(pilotResponseObject.reqAvgMarkPass)}
          >
            <span
              className={`${pilotResponseObject.reqAvgMarkPass != null && pilotResponseObject.reqAvgMarkPass > 100 ? 'opacity-50' : ''}`}
            >
              Pass
            </span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="TwoTwo"
            className={getToggleItemClasses(
              pilotResponseObject.reqAvgMarkTwoTwo,
            )}
          >
            <span
              className={`${pilotResponseObject.reqAvgMarkTwoTwo != null && pilotResponseObject.reqAvgMarkTwoTwo > 100 ? 'opacity-50' : ''}`}
            >
              2:2
            </span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="TwoOne"
            className={getToggleItemClasses(
              pilotResponseObject.reqAvgMarkTwoOne,
            )}
          >
            <span
              className={`${pilotResponseObject.reqAvgMarkTwoOne != null && pilotResponseObject.reqAvgMarkTwoOne > 100 ? 'opacity-50' : ''}`}
            >
              2:1
            </span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="First"
            className={getToggleItemClasses(
              pilotResponseObject.reqAvgMarkFirst,
            )}
          >
            <span
              className={`${pilotResponseObject.reqAvgMarkFirst != null && pilotResponseObject.reqAvgMarkFirst > 100 ? 'opacity-50' : ''}`}
            >
              First
            </span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="TargetMark"
            className={`${getToggleItemClasses(pilotResponseObject.reqAvgMarkTarget)}`}
          >
            <span
              className={`${pilotResponseObject.reqAvgMarkTarget != null && pilotResponseObject.reqAvgMarkTarget > 100 ? 'opacity-50' : ''}`}
            >
              Target: {moduleTargetMark != null ? `${moduleTargetMark}%` : 'None'}
            </span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      {}
      {selectedTarget && (
        <>
          {requiredMark === null ? (
            <p className="font-bold text-green-400">
              You have already achieved this classification!
            </p>
          ) : requiredMark > 100 ? (
            <span className="font-bold text-red-600">
              This is no longer possible to achieve
            </span>
          ) : requiredMark < 0 ? (
            'You have no target mark!'
          ) : (
            <p>
              You need an average mark of{' '}
              <span className="font-extrabold text-yellow-400">
                {requiredMark || '??'}%
              </span>{' '}
              in your remaining assignments
            </p>
          )}
        </>
      )}
    </>
  );
}
