import React from 'react';
import type { AcademicYearData } from '@/types';
import { BookMarked, BowArrow, Edit, Info, Pencil, Target, Trophy, Weight } from 'lucide-react';
import { GraduationCap } from 'lucide-react';
import { Medal } from 'lucide-react';

export default function YearDetailsHeader({
  yearInfo,
}: {
  yearInfo: AcademicYearData | null;
}) {
  return (
    <div>
      <h1 className="font-bold">Year {yearInfo?.yearNumber}</h1>

      {/* FOLLOWING NOT NECESSARILY NEEDED FOR THIS APPLICATION */}
      
      {/* <h3 className="flex items-center gap-1">
        {' '}
        <Info className="h-5 w-5" /> Year info
      </h3>
      <div className="mt-1 mb-3 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="flex items-center justify-center gap-1 rounded-sm border-1 border-gray-600 pt-1 pr-3 pb-1 pl-3">
          <span className="flex items-center gap-1">
            {' '}
            <GraduationCap className="h-5 w-5" />
            Credits:
          </span>
          <span className="font-bold">120</span>
        </div>
        <div className="flex items-center justify-center gap-1 rounded-sm border-1 border-gray-600 pt-1 pr-3 pb-1 pl-3">
          <span className="flex items-center">
            <Weight className="2-4 h-4" />
            Weighting:
          </span>
          <span className="font-bold">10%</span>
        </div>
        <div className="flex items-center justify-center gap-1 rounded-sm border-1 border-blue-400 pt-1 pr-3 pb-1 pl-3">
          <span className="flex items-center gap-1">
            <BookMarked className="h-4 w-4" />
            Mark:
          </span>
          <span className="font-bold">10%</span>
        </div>
        <div className="flex items-center justify-center gap-1 rounded-sm border-1 border-orange-400 pt-1 pr-3 pb-1 pl-3">
          <span className="flex items-center gap-1">
            <Trophy className="h-4 w-4" />
            Target:
          </span>
          <span className="font-bold">40%</span>
        </div>
        <div className="flex items-center justify-center gap-1 rounded-sm bg-gray-600 pt-1 pb-1 w-10">
          <span className="flex items-center gap-1">
            <Edit className="h-5 w-5" />
          </span>
        </div>
      </div> */}
    </div>
  );
}
