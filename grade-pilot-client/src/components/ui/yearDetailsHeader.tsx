import React from 'react';
import { useYearDetails } from '@/contexts/YearDetailsContext';
import { calculateYearStats, yearPilotReached } from '@/utils/calculations';
import {
  TrendingUp,
  Trophy,
  Weight,
  Settings,
  Edit,
  MoveHorizontal,
  Info,
  ClipboardCheck,
  CheckCheckIcon,
  CheckCircle,
} from 'lucide-react';
import { GraduationCap } from 'lucide-react';
import DialogToolTip from './dialogToolTip';
import { Button } from './button';
import { Progress } from './progress';

export default function YearDetailsHeader() {
  const { yearInfo, openYearSettingsModal } = useYearDetails();

  if (!yearInfo) return;

  // Check if all modules for the year and their cats add up to total year cats
  const pilotReachedEvaluation = yearPilotReached(
    yearInfo.modules,
    yearInfo.totalCredits,
  );

  // Check if the evaluation means the pilot has been reached, if so, then calculate the yearStats
  const yearStats = pilotReachedEvaluation.isReached
    ? calculateYearStats(yearInfo.modules, yearInfo.totalCredits)
    : null;

  return (
    <div className="mb-4">
      <h1 className="font-bold">Year {yearInfo?.yearNumber}</h1>
      <h3 className="flex items-center gap-1">
        <Info className="h-5 w-5 rounded-sm" />
        Year info
      </h3>

      {yearInfo.targetMark ? (
        <>
          <div className="mt-1 mb-3 grid gap-4 md:grid-cols-1 lg:grid-cols-3">
            <div className="flex items-center justify-center gap-1 rounded-sm border-1 border-gray-600 pt-1 pr-3 pb-1 pl-3">
              <span className="flex items-center gap-1">
                <GraduationCap className="h-5 w-5" />
                Credits:
              </span>
              <span className="font-bold">{yearInfo.totalCredits}</span>
            </div>
            <div className="flex items-center justify-center gap-1 rounded-sm border-1 border-gray-600 pt-1 pr-3 pb-1 pl-3">
              <span className="flex items-center">
                <Weight className="mr-1 h-4 w-4" />
                Weighting:
              </span>
              <span className="font-bold">{yearInfo.weightingPercent}%</span>
            </div>
            <Button
              className="flex items-center justify-center gap-1 rounded-sm bg-gray-700 text-gray-300 transition-all duration-300 ease-in-out hover:bg-white hover:text-gray-600"
              onClick={() => openYearSettingsModal()}
            >
              <Settings className="2-4 h-4" />
              Year Settings
            </Button>
          </div>

          {yearStats ? (
            <>
              <div
                className={`col-span-12 flex items-center justify-center gap-3 rounded-sm border-1 ${yearStats.isYearCompleted ? 'border-green-500' : 'border-white'} pt-2 pr-5 pb-2 pl-5 text-white transition-opacity duration-400`}
              >
                {!yearStats.isYearCompleted && (
                  <div className="flex flex-col items-center">
                    <DialogToolTip
                      content="This is your Pilot - It tracks your overall year average."
                      content2="*Projected Average: the average mark of all your modules. If the module is incomplete, the target mark is used."
                      content3="*Possible Range: this is the worst and best possible year averages you could get (only relevant if you have incomplete modules)"
                      content4="*Target Average: This is your target average for the year (you can adjust this in the year settings)"
                    />
                    <img src="/pilot.png" alt="pilot" className="h-12 w-12" />
                  </div>
                )}

                {yearStats.isYearCompleted ? (
                  <div className="flex flex-col items-center justify-center gap-1 pt-1 pb-1 pl-3">
                    <span className="text-center text-[12px]">
                      Final Year Average
                    </span>
                    <span className="flex items-center gap-1 text-2xl font-bold">
                      <ClipboardCheck />
                      {yearStats?.projected}%
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col items-center justify-center gap-1 pt-1 pr-3 pb-1 pl-3">
                      <span className="text-center text-[12px]">
                        Projected Average
                      </span>
                      <span className="flex items-center gap-1 text-2xl font-bold">
                        <TrendingUp className="h-5 w-5" />
                        {yearStats?.projected}%
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1 pt-1 pr-3 pb-1 pl-3">
                      <span className="text-center text-[12px]">
                        Possible Range
                      </span>
                      <span className="flex items-center gap-1 text-2xl font-bold">
                        <span className="text-[20px]">
                          {yearStats?.lowestProjected}%
                        </span>
                        <MoveHorizontal className="h-5 w-5" />
                        {yearStats?.highestProjected}%
                      </span>
                    </div>
                  </>
                )}
                <div className="flex flex-col items-center justify-center gap-1 pt-1 pr-3 pb-1 pl-3">
                  <span className="text-center text-[12px]">
                    Target Average
                  </span>
                  <span className="flex items-center gap-1 text-2xl font-bold">
                    {yearStats.lowestProjected > yearInfo.targetMark ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <Trophy className={`h-5 w-5`} />
                    )}
                    <span>{yearInfo.targetMark}%</span>
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div
                className={`col-span-12 flex items-center gap-3 rounded-sm border-1 border-white pt-2 pr-5 pb-2 pl-5 text-white opacity-40 transition-opacity duration-400`}
              >
                <div className="flex flex-col items-center">
                  <img src="/pilot.png" alt="pilot" className="h-12 w-12" />
                </div>
                <div className="text-[15px]">
                  <span className="text-[12px]">
                    To enable your year pilot:
                  </span>{' '}
                  <br />
                  All modules must add up to your exact total year credits
                  <Progress
                    value={
                      pilotReachedEvaluation.totalModuleCredits /
                      ((yearInfo.totalCredits ?? 1) / 100) // Progress is on scale 0-100, so reframing to fit this scale
                    }
                    className="mt-1 h-1 flex-1"
                  />
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <Button
          className="flex items-center justify-center gap-1 rounded-sm bg-gray-700 text-gray-300 transition-all duration-300 ease-in-out hover:bg-white hover:text-gray-600"
          onClick={() => openYearSettingsModal()}
        >
          <Settings className="h-5 w-5 rounded-sm" />
          Configure Year Settings
        </Button>
      )}
    </div>
  );
}
