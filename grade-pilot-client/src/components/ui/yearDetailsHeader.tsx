import React from 'react';
import type { AcademicYearData } from '@/types';
import {
  TrendingUp,
  Trophy,
  Weight,
  Settings,
  Edit,
  MoveHorizontal,
  Info,
} from 'lucide-react';
import { GraduationCap } from 'lucide-react';
import DialogToolTip from './dialogToolTip';

export default function YearDetailsHeader({
  yearInfo,
}: {
  yearInfo: AcademicYearData | null;
}) {
  return (
    <div className="mb-4">
      <h1 className="font-bold">Year {yearInfo?.yearNumber}</h1>

      <h3 className="flex items-center gap-1">
        <Info className="h-5 w-5 rounded-sm" />
        Year info
      </h3>
      <div className="mt-1 mb-3 grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        <div className="flex items-center justify-center gap-1 rounded-sm border-1 border-gray-600 pt-1 pr-3 pb-1 pl-3">
          <span className="flex items-center gap-1">
            <GraduationCap className="h-5 w-5" />
            Credits:
          </span>
          <span className="font-bold">120</span>
        </div>
        <div className="flex items-center justify-center gap-1 rounded-sm border-1 border-gray-600 pt-1 pr-3 pb-1 pl-3">
          <span className="flex items-center">
            <Weight className="mr-1 h-4 w-4" />
            Weighting:
          </span>
          <span className="font-bold">10%</span>
        </div>
        <div className="flex items-center justify-center gap-1 rounded-sm bg-gray-700 pt-1 pr-3 pb-1 pl-3 transition-all duration-200 hover:bg-white hover:text-gray-600">
          <span className="flex items-center">
            <Settings className="2-4 h-4" />
            Year Settings
          </span>
        </div>
      </div>

      <div
        className={`col-span-12 flex items-center gap-3 rounded-sm border-1 border-white pt-2 pr-5 pb-2 pl-5 text-white transition-opacity duration-400`}
      >
        <div className="flex flex-col items-center">
          <DialogToolTip
            content="This is your Pilot - It tracks your overall year average."
            content2="*Projected Average: the average mark of all your modules. If the module is incomplete, the target mark is used."
            content3="*Possible Range: this is the worst and best possible year averages you could get (only relevant if you have incomplete modules)"
            content4="*Target Average: This is your target average for the year (you can adjust this in the year settings)"
          />
          <img src="/pilot.png" alt="pilot" className="h-12 w-12" />
        </div>

        <div className="flex flex-col items-center justify-center gap-1 pt-1 pr-3 pb-1 pl-3">
          <span className="text-center text-[12px]">Projected Average</span>
          <span className="flex items-center gap-1 text-2xl font-bold">
            <TrendingUp className="h-5 w-5" />
            10%
          </span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 pt-1 pr-3 pb-1 pl-3">
          <span className="text-center text-[12px]">Possible Range</span>
          <span className="flex items-center gap-1 text-2xl font-bold">
            <span className="text-[20px]">10%</span>
            <MoveHorizontal className="h-5 w-5" />
            100%
          </span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 pt-1 pr-3 pb-1 pl-3">
          <span className="text-center text-[12px]">Target Average</span>
          <span className="flex items-center gap-1 text-2xl font-bold">
            <Trophy className="h-5 w-5" />
            10%
          </span>
        </div>
      </div>
    </div>
  );
}
