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
  // Editing year weighting and target classification
  const { yearNumber, newYearWeighting, newTargetClassification } = req.body;

  const updatingData = {};

  if (newYearWeighting) {
    updatingData.weightingPercent = newYearWeighting;
  }
  if (newTargetClassification) {
    updatingData.targetClassification = newTargetClassification;
  }

  await prisma.academicYear.update({
    where: {
      yearNumber: yearNumber,

      degree: {
        userId: req.user.userId,
      },
    },

    data: updatingData,
  });

  res.sendStatus(200);
};
