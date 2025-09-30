import prisma from "../lib/prisma.js";
import { NotFoundError } from "../errors/index.js";

export const getAcademicYear = async (req, res) => {
  const { id: yearNumber } = req.params;
  // Gets the modules and assignments for a year
  const academicYear = await prisma.academicYear.findFirst({
    where: {
      yearNumber: Number(yearNumber),

      degree: {
        // Need to uniquely identify via the user and year number since "get" doesn't include body to send academicYearId
        userId: req.user.userId,
      },
    },
    include: {
      modules: {
        orderBy: {
          // Making sure that order of the modules created dont change
          createdAt: "asc",
        },
        include: {
          assignments: true,
        },
      },
    },
  });

  if (!academicYear) {
    throw new NotFoundError("Academic year not found");
  }

  res.status(200).json({ academicYear: academicYear });
};

// Add and delete years? Probably not
// Year objects created when degree created

export const updateAcademicYear = async (req, res) => {
  // Editing year weighting and target mark
  const { yearId, newYearTotalCredits, newYearWeighting, newYearMark } =
    req.body;

  const updatingData = {};

  if (newYearWeighting != null) {
    updatingData.weightingPercent = newYearWeighting;
  }
  if (newYearMark != null) {
    updatingData.targetMark = newYearMark;
  }
  if (newYearTotalCredits != null) {
    updatingData.totalCredits = newYearTotalCredits;
  }

  const newYear = await prisma.academicYear.update({
    where: {
      id: yearId,
    },

    data: updatingData,
  });

  res.status(200).json({ updatedSettings: updatingData });
};
